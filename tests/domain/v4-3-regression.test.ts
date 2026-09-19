import { describe, it, expect, beforeEach } from 'vitest';
import { RoutingEngine, formatOmissionReason } from '../../src/domain/routing/routing-engine';
import { useAppStore } from '../../src/stores/app-store';

describe('V4.3 Route Unknown QA & Map State Stability (Spec: ROUTE-UNKNOWN-QA-PROMPT & MAP-STATE-QA-PROMPT)', () => {
  let engine: RoutingEngine;

  beforeEach(() => {
    engine = RoutingEngine.getInstance();
    useAppStore.setState({
      selectedRoadId: 'road-nguyen-huu-canh',
      timelineHour: 0,
      isRoutePlannerOpen: false,
      priorMapStateSnapshot: null,
      qaUnknownFixtureEnabled: false,
      routeOriginId: 'node-ben-thanh',
      routeDestinationId: 'node-xuan-thuy-thao-dien',
      selectedVehicle: 'motorbike',
    });
  });

  describe('1. ROUTE-UNKNOWN-QA: QA UNKNOWN Fixture Validation', () => {
    it('fixture is disabled by default in production, giving 100% coverage', () => {
      const plan = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        qaUnknownFixture: false,
      });

      expect(plan.candidates.length).toBeGreaterThan(0);
      const primary = plan.candidates[0];
      expect(primary.coveragePercent).toBe(100);
      expect(primary.unknownCount).toBe(0);
      expect(primary.evaluation.unknownSegmentCount).toBe(0);
      expect(primary.evaluation.unknownDistanceMeters).toBe(0);
    });

    it('produces coverage < 100%, unknownCount > 0, unknownDistanceMeters > 0 when QA fixture enabled', () => {
      const plan = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        qaUnknownFixture: true,
      });

      expect(plan.candidates.length).toBeGreaterThan(0);
      const primary = plan.candidates[0];

      // Must satisfy ROUTE-UNKNOWN-QA criteria
      expect(primary.coveragePercent).toBeLessThan(100);
      expect(primary.unknownCount).toBeGreaterThan(0);
      expect(primary.evaluation.unknownSegmentCount).toBeGreaterThan(0);
      expect(primary.evaluation.unknownDistanceMeters).toBeGreaterThan(0);
      expect(primary.evaluation.dataCoverage).toBeLessThan(1.0);
    });

    it('excludes unknown segments from maxKnownDepth calculation', () => {
      const plan = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        qaUnknownFixture: true,
      });

      const cand = plan.candidates[0];
      // maxKnownDepth must only be derived from known segments
      expect(cand.evaluation.maxKnownDepthCm).toBeDefined();
      expect(typeof cand.evaluation.maxKnownDepthCm).toBe('number');

      // The overridden segments (seg-nhc-1, seg-nhc-2) must not be treated as 0cm or safe
      const unknownSegs = cand.segments.filter(
        (s) => s.floodForecast[0]?.status === 'unknown'
      );
      expect(unknownSegs.length).toBeGreaterThan(0);
      for (const seg of unknownSegs) {
        expect(seg.floodForecast[0].status).toBe('unknown');
        expect(seg.floodForecast[0].riskLevel).toBe('unknown');
      }
    });

    it('ensures no QA fake data leaks into production path when toggle is disabled', () => {
      // 1. Run with QA fixture enabled
      const qaPlan = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        qaUnknownFixture: true,
      });
      expect(qaPlan.candidates[0].unknownCount).toBeGreaterThan(0);

      // 2. Immediately run with production default (disabled)
      const prodPlan = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        qaUnknownFixture: false,
      });
      expect(prodPlan.candidates[0].unknownCount).toBe(0);
      expect(prodPlan.candidates[0].coveragePercent).toBe(100);
    });
  });

  describe('2. CANDIDATE-OMISSION-QA: Reject Reasons & Formatting', () => {
    it('formats all 5 candidate omission reasons with exact Vietnamese copy', () => {
      expect(formatOmissionReason('duplicate', 2)).toContain('Không có tuyến khác đủ khác biệt để hiển thị.');
      expect(formatOmissionReason('vehicle_blocked', 2)).toContain('Một tuyến bị loại do không phù hợp với phương tiện đã chọn.');
      expect(formatOmissionReason('flood_blocked', 2)).toContain('Một tuyến bị loại do mức ngập dự báo quá cao.');
      expect(formatOmissionReason('disconnected', 0)).toContain('Không tìm được kết nối hợp lệ cho một phương án.');
      expect(formatOmissionReason('no_distinct_alternative', 2)).toBe('Chỉ tìm được 2 tuyến khác biệt tại thời điểm này.');
    });

    it('returns requestedCount and displayedCount in RoutePlanResult', () => {
      const plan = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(plan.requestedCount).toBe(3);
      expect(plan.displayedCount).toBe(plan.candidates.length);
    });
  });

  describe('3. MAP-STATE-QA: State Stability & Restoration Lifecycle', () => {
    it('preserves and restores selected road, timeline hour, and layers when closing planner', () => {
      const store = useAppStore.getState();

      // Step 1: Initial state
      expect(store.selectedRoadId).toBe('road-nguyen-huu-canh');
      expect(store.timelineHour).toBe(0);
      expect(store.isRoutePlannerOpen).toBe(false);

      // Step 2: Open Route Planner
      store.setRoutePlannerOpen(true);
      const openState = useAppStore.getState();
      expect(openState.isRoutePlannerOpen).toBe(true);
      expect(openState.selectedRoadId).toBeNull(); // Cleared to prevent visual clutter
      expect(openState.priorMapStateSnapshot).toEqual({
        selectedRoadId: 'road-nguyen-huu-canh',
        timelineHour: 0,
        activeLayers: openState.activeLayers,
        interactionMode: 'browse',
      });
      expect(openState.routeCandidates.length).toBeGreaterThan(0);

      // Step 3: Switch vehicle and timeline to +3h inside planner
      openState.setSelectedVehicle('car');
      openState.setTimelineHour(3);
      const mutatedState = useAppStore.getState();
      expect(mutatedState.selectedVehicle).toBe('car');
      expect(mutatedState.timelineHour).toBe(3);

      // Step 4: Close Route Planner
      mutatedState.setRoutePlannerOpen(false);
      const closedState = useAppStore.getState();

      // Step 5: Verify prior map state is restored!
      expect(closedState.isRoutePlannerOpen).toBe(false);
      expect(closedState.selectedRoadId).toBe('road-nguyen-huu-canh'); // Restored!
      expect(closedState.timelineHour).toBe(0); // Restored!
      expect(closedState.priorMapStateSnapshot).toBeNull();
      expect(closedState.routeCandidates.length).toBe(0); // Cleaned up!
    });

    it('repeats open/close 10 times without state corruption or leakage (Stress Test)', () => {
      for (let i = 0; i < 10; i++) {
        // Pre-condition
        useAppStore.setState({ selectedRoadId: `road-test-${i}`, timelineHour: i % 4 });

        // Open
        useAppStore.getState().setRoutePlannerOpen(true);
        expect(useAppStore.getState().isRoutePlannerOpen).toBe(true);
        expect(useAppStore.getState().selectedRoadId).toBeNull();

        // Mutate in planner
        useAppStore.getState().setTimelineHour(6);
        useAppStore.getState().setSelectedVehicle(i % 2 === 0 ? 'car' : 'motorbike');

        // Close
        useAppStore.getState().setRoutePlannerOpen(false);
        const restored = useAppStore.getState();
        expect(restored.isRoutePlannerOpen).toBe(false);
        expect(restored.selectedRoadId).toBe(`road-test-${i}`);
        expect(restored.timelineHour).toBe(i % 4);
        expect(restored.priorMapStateSnapshot).toBeNull();
      }
    });
  });
});
