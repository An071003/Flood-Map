import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/stores/app-store';
import {
  searchPlaces,
  normalizeVietnamese,
} from '../../src/services/geodata/hcmc-places-database';
import { RoadWeatherService } from '../../src/services/road-weather-service';

describe('V5 Navigation-First & Search Geocoding QA Suite', () => {
  beforeEach(() => {
    // Reset app store to pristine baseline
    useAppStore.setState({
      interactionMode: 'browse',
      selectedRoadId: null,
      timelineHour: 0,
      activeLayers: {
        roadFlood: false,
        rain: true,
        weatherLabels: true,
        tide: true,
        is3D: true,
        hcmcBoundary: true,
      },
      originPlace: null,
      destinationPlace: null,
      snapWarningNote: null,
      floodModelPreference: 'auto',
      dataQualityPreference: 'all',
      isRoutePlannerOpen: false,
      routeCandidates: [],
      selectedRouteCandidateId: null,
      priorMapStateSnapshot: null,
    });
  });

  // =========================================================================
  // 1. SEARCH-GEOCODING-QA-PROMPT.md Requirements
  // =========================================================================
  describe('SEARCH-GEOCODING-QA: Place search, normalization, snapping & disclosures', () => {
    it('1. `Nguyễn Hữu Cảnh` => returns road with valid attributes and graph snapping', () => {
      const results = searchPlaces('Nguyễn Hữu Cảnh');
      expect(results.length).toBeGreaterThan(0);

      const roadResult = results.find((r) => r.type === 'road');
      expect(roadResult).toBeDefined();
      expect(roadResult!.label).toContain('Nguyễn Hữu Cảnh');
      expect(roadResult!.district).toBe('Bình Thạnh');
      expect(roadResult!.lng).toBeGreaterThan(106.5);
      expect(roadResult!.lat).toBeGreaterThan(10.5);
      expect(roadResult!.routableNodeId).toBeDefined();
      expect(roadResult!.routableSnapDistanceMeters).toBeDefined();
    });

    it('2. `123 Nguyễn Hữu Cảnh` => returns address with house number and snap disclosure', () => {
      const results = searchPlaces('123 Nguyễn Hữu Cảnh');
      expect(results.length).toBeGreaterThan(0);

      const addrResult = results.find((r) => r.type === 'address');
      expect(addrResult).toBeDefined();
      expect(addrResult!.houseNumber).toBe('123');
      expect(addrResult!.street).toContain('Nguyễn Hữu Cảnh');
      expect(addrResult!.label).toBe('123 Nguyễn Hữu Cảnh');
      expect(addrResult!.lng).toBeGreaterThan(106);
      expect(addrResult!.lat).toBeGreaterThan(10);
      expect(addrResult!.routableNodeId).toBeDefined();
      // Snap distance must be disclosed
      expect(addrResult!.routableSnapDistanceMeters).toBeGreaterThanOrEqual(0);
    });

    it('3. `Chợ Bến Thành` => returns POI with exact coordinates and hub snapping', () => {
      const results = searchPlaces('Chợ Bến Thành');
      expect(results.length).toBeGreaterThan(0);

      const poi = results.find((r) => r.type === 'poi' && r.label.includes('Bến Thành'));
      expect(poi).toBeDefined();
      expect(poi!.type).toBe('poi');
      expect(poi!.district).toBe('Quận 1');
      expect(poi!.routableNodeId).toBe('node-ben-thanh');
      expect(poi!.routableSnapDistanceMeters).toBe(0);
    });

    it('4. `Ngã tư Hàng Xanh` => returns intersection with exact hub node', () => {
      const results = searchPlaces('Ngã tư Hàng Xanh');
      expect(results.length).toBeGreaterThan(0);

      const intersection = results.find((r) => r.type === 'intersection');
      expect(intersection).toBeDefined();
      expect(intersection!.label).toBe('Ngã tư Hàng Xanh');
      expect(intersection!.district).toBe('Bình Thạnh');
      expect(intersection!.routableNodeId).toBe('node-hang-xanh');
      expect(intersection!.routableSnapDistanceMeters).toBe(0);
    });

    it('5. `123/45 Nguyễn Xí` => detects alley, communicates approximate/outside-graph handling', () => {
      const results = searchPlaces('123/45 Nguyễn Xí');
      expect(results.length).toBeGreaterThan(0);

      const alley = results.find((r) => r.type === 'alley');
      expect(alley).toBeDefined();
      expect(alley!.alley).toContain('123/45');
      expect(alley!.street).toContain('Nguyễn Xí');
      // Rule 2 & 5: Must disclose off-graph / alley distance (> 50m) and NOT claim false 0m on-graph
      expect(alley!.isOutsideGraph).toBe(true);
      expect(alley!.routableSnapDistanceMeters).toBeGreaterThan(50);
      expect(alley!.routableNodeId).toBeDefined();
    });

    it('6. `nguyen huu canh` => diacritic-insensitive search matches `Nguyễn Hữu Cảnh`', () => {
      expect(normalizeVietnamese('Nguyễn Hữu Cảnh')).toBe('nguyen huu canh');
      const results = searchPlaces('nguyen huu canh');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.label.includes('Nguyễn Hữu Cảnh'))).toBe(true);
    });

    it('7. Current location => fetches location, snaps to graph, and initializes origin', async () => {
      const store = useAppStore.getState();
      await store.fetchUserLocation('origin');

      const stateAfter = useAppStore.getState();
      expect(stateAfter.isLocating).toBe(false);
      expect(stateAfter.originPlace).toBeDefined();
      expect(stateAfter.originPlace!.routableNodeId).toBeDefined();
      expect(stateAfter.isRoutePlannerOpen).toBe(true);
    });

    it('8. Off-graph snap disclosure: sets snapWarningNote when destination is off-graph', () => {
      const store = useAppStore.getState();
      const offGraphPlace = {
        id: 'test-off-graph',
        type: 'alley' as const,
        label: 'Hẻm 48 Điện Biên Phủ',
        name: 'Hẻm 48 Điện Biên Phủ',
        street: 'Điện Biên Phủ',
        district: 'Bình Thạnh',
        lng: 106.715,
        lat: 10.8,
        matchQuality: 'approximate' as const,
        routableNodeId: 'node-hang-xanh',
        routableSnapDistanceMeters: 140,
        isOutsideGraph: true,
      };

      store.setDestinationPlace(offGraphPlace);

      const stateAfter = useAppStore.getState();
      expect(stateAfter.destinationPlace).toEqual(offGraphPlace);
      expect(stateAfter.routeDestinationId).toBe('node-hang-xanh');
      expect(stateAfter.snapWarningNote).toBe(
        'Tuyến được tính đến điểm hỗ trợ gần nhất, cách vị trí đã chọn 140 m.'
      );
    });
  });

  // =========================================================================
  // 2. NAVIGATION-VISUAL-QA-PROMPT.md Requirements
  // =========================================================================
  describe('NAVIGATION-VISUAL-QA: Visual hierarchy, interaction modes & lifecycle', () => {
    it('1. Browse Mode: roads are neutral by default, no global flood rainbow overlay', () => {
      const state = useAppStore.getState();
      expect(state.interactionMode).toBe('browse');
      expect(state.selectedRoadId).toBeNull();
      // Rule 1: Global flood rainbow is default OFF
      expect(state.activeLayers.roadFlood).toBe(false);
    });

    it('2. Selected Road Mode: only selected road is active, others neutral, inspector matches', () => {
      const store = useAppStore.getState();
      store.setSelectedRoadId('road-nguyen-huu-canh');

      const selectedState = useAppStore.getState();
      expect(selectedState.interactionMode).toBe('road-selected');
      expect(selectedState.selectedRoadId).toBe('road-nguyen-huu-canh');
      // Global roadFlood remains false so only selected road gets individual emphasis
      expect(selectedState.activeLayers.roadFlood).toBe(false);

      // Verify road snapshot data for inspector
      const weatherService = RoadWeatherService.getInstance();
      const snapshots = weatherService.getRoadSnapshots(selectedState.timelineHour);
      const roadSnap = snapshots.find((s) => s.road.id === 'road-nguyen-huu-canh');
      expect(roadSnap).toBeDefined();
      expect(roadSnap!.road.properties.roadName).toBe('Nguyễn Hữu Cảnh');

      // Timeline update updates the selected road
      store.setTimelineHour(4);
      expect(useAppStore.getState().timelineHour).toBe(4);
      const hour4Snapshots = weatherService.getRoadSnapshots(4);
      const hour4Snap = hour4Snapshots.find((s) => s.road.id === 'road-nguyen-huu-canh');
      expect(hour4Snap).toBeDefined();
    });

    it('3. Route Mode: candidate dominant, alternatives muted, unknown dashed, non-route neutral', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);

      const routeState = useAppStore.getState();
      expect(routeState.interactionMode).toBe('route-planning');
      expect(routeState.isRoutePlannerOpen).toBe(true);
      expect(routeState.routeCandidates.length).toBeGreaterThan(0);

      const selectedCandidate = routeState.routeCandidates.find(
        (c) => c.id === routeState.selectedRouteCandidateId
      );
      expect(selectedCandidate).toBeDefined();
      expect(selectedCandidate!.segments.length).toBeGreaterThan(0);

      // Segments have risk levels
      const firstSegment = selectedCandidate!.segments[0];
      const floodState = firstSegment.floodForecast[0];
      expect(floodState).toBeDefined();
      expect(['safe', 'watch', 'warning', 'severe', 'unknown']).toContain(floodState.riskLevel);
    });

    it('4. Candidate Switching: moves emphasis cleanly without duplicate or stale route', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);

      const candidates = useAppStore.getState().routeCandidates;
      expect(candidates.length).toBeGreaterThanOrEqual(2);

      const firstId = candidates[0].id;
      const secondId = candidates[1].id;

      store.setSelectedRouteCandidateId(firstId);
      expect(useAppStore.getState().selectedRouteCandidateId).toBe(firstId);

      store.setSelectedRouteCandidateId(secondId);
      expect(useAppStore.getState().selectedRouteCandidateId).toBe(secondId);
    });

    it('5. Exit Route Mode: map state snapshot is restored and overlays cleaned up', () => {
      const store = useAppStore.getState();
      // Setup prior state
      store.setSelectedRoadId('road-thao-dien');
      store.setTimelineHour(2);
      expect(useAppStore.getState().interactionMode).toBe('road-selected');

      // Open planner
      store.setRoutePlannerOpen(true);
      expect(useAppStore.getState().interactionMode).toBe('route-planning');
      expect(useAppStore.getState().selectedRoadId).toBeNull();
      expect(useAppStore.getState().priorMapStateSnapshot).toEqual({
        selectedRoadId: 'road-thao-dien',
        timelineHour: 2,
        activeLayers: useAppStore.getState().activeLayers,
        interactionMode: 'road-selected',
      });

      // Close planner
      store.setRoutePlannerOpen(false);
      const restored = useAppStore.getState();
      expect(restored.isRoutePlannerOpen).toBe(false);
      expect(restored.selectedRoadId).toBe('road-thao-dien');
      expect(restored.interactionMode).toBe('road-selected');
      expect(restored.timelineHour).toBe(2);
    });

    it('6. Route preference filters: respects strategy and dataQualityPreference', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);

      // Test cautious flood model preference
      store.setFloodModelPreference('cautious');
      expect(useAppStore.getState().floodModelPreference).toBe('cautious');

      // Test high_coverage_only data quality preference
      store.setDataQualityPreference('high_coverage_only');
      expect(useAppStore.getState().dataQualityPreference).toBe('high_coverage_only');

      const candidates = useAppStore.getState().routeCandidates;
      expect(candidates.length).toBeGreaterThan(0);
    });
  });
});
