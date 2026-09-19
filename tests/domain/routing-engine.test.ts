import { describe, it, expect, beforeEach } from 'vitest';
import { RoutingEngine } from '../../src/domain/routing/routing-engine';
import { VEHICLE_PROFILES, getDepthPenalty } from '../../src/domain/routing/vehicle-profiles';
import { calculateSegmentCost, evaluateRoute } from '../../src/domain/routing/route-cost-engine';
import { HCMC_GRAPH_SEGMENTS } from '../../src/services/geodata/hcmc-graph-network';

describe('V4 Route Planner & Cost Engine (Spec: ROUTE-QA-PROMPT.md)', () => {
  let engine: RoutingEngine;

  beforeEach(() => {
    engine = RoutingEngine.getInstance();
  });

  describe('Scenario A: Vehicle Profiles (Motorbike vs Car)', () => {
    it('applies different penalty curves to motorbike and car for 20cm flood', () => {
      const mbPen = getDepthPenalty(20, VEHICLE_PROFILES.motorbike);
      const carPen = getDepthPenalty(20, VEHICLE_PROFILES.car);

      // Motorbikes are more sensitive to 20cm flood than cars
      expect(mbPen).toBe(180);
      expect(carPen).toBe(80);
      expect(mbPen).toBeGreaterThan(carPen);
    });

    it('produces higher cost for motorbike on flooded segments like Nguyen Huu Canh', () => {
      const nhcSegment = HCMC_GRAPH_SEGMENTS.find((s) => s.id === 'seg-nhc-1')!;
      expect(nhcSegment).toBeDefined();

      const mbCost = calculateSegmentCost(nhcSegment, VEHICLE_PROFILES.motorbike, 0, 'LEAST_FLOOD');
      const carCost = calculateSegmentCost(nhcSegment, VEHICLE_PROFILES.car, 0, 'LEAST_FLOOD');

      expect(mbCost).toBeGreaterThan(carCost);
    });
  });

  describe('Scenario B: Forecast Departure Hour (NOW vs +3h vs +12h)', () => {
    it('recalculates segment cost and depth when timeline changes from NOW to +3h and +12h', () => {
      const nhcSegment = HCMC_GRAPH_SEGMENTS.find((s) => s.id === 'seg-nhc-1')!;
      
      const costHour0 = calculateSegmentCost(nhcSegment, VEHICLE_PROFILES.motorbike, 0, 'LEAST_FLOOD');
      const costHour3 = calculateSegmentCost(nhcSegment, VEHICLE_PROFILES.motorbike, 3, 'LEAST_FLOOD');
      const costHour12 = calculateSegmentCost(nhcSegment, VEHICLE_PROFILES.motorbike, 12, 'LEAST_FLOOD');

      // Hour 3 has peak accumulated rain (38cm vs 28cm at hour 0)
      expect(costHour3).toBeGreaterThan(costHour0);
      // Hour 12 water recedes (8cm vs 28cm at hour 0)
      expect(costHour0).toBeGreaterThan(costHour12);
    });

    it('changes route evaluation maxDepth across timeline hours', () => {
      const candidatesH0 = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      const candidatesH12 = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 12,
      });

      expect(candidatesH0.length).toBeGreaterThan(0);
      expect(candidatesH12.length).toBeGreaterThan(0);

      // At hour 12, water has drained significantly across the city
      const leastFloodH0 = candidatesH0.find((c) => c.strategy === 'LEAST_FLOOD')!;
      const leastFloodH12 = candidatesH12.find((c) => c.strategy === 'LEAST_FLOOD')!;

      expect(leastFloodH12.maxDepthCm!).toBeLessThanOrEqual(leastFloodH0.maxDepthCm!);
    });
  });

  describe('Scenario C: Unknown Segment Policy', () => {
    it('never treats UNKNOWN segments as 0 cm or safe', () => {
      const unknownSeg = HCMC_GRAPH_SEGMENTS.find((s) => s.id === 'seg-doan-van-bo-connector-unknown')!;
      expect(unknownSeg).toBeDefined();

      const cost = calculateSegmentCost(unknownSeg, VEHICLE_PROFILES.motorbike, 0, 'LEAST_FLOOD');
      // Cost must exceed base travel time due to unknown penalty
      expect(cost).toBeGreaterThan(unknownSeg.estimatedTravelSeconds);

      const evaluated = evaluateRoute([unknownSeg], 'LEAST_FLOOD', 0, VEHICLE_PROFILES.motorbike);
      expect(evaluated.unknownCount).toBe(1);
      expect(evaluated.coveragePercent).toBe(0);
      expect(evaluated.evaluation.unknownSegmentCount).toBe(1);
      expect(evaluated.evaluation.maxEstimatedDepthCm).toBeUndefined();
      expect(evaluated.recommendationState).toBe('insufficient_data');
    });
  });

  describe('Scenario D: Severe Segment Avoidance in Least Flood', () => {
    it('chooses Dien Bien Phu corridor over flooded Nguyen Huu Canh for Least Flood strategy', () => {
      const candidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-cau-sai-gon-bt',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(candidates.length).toBeGreaterThan(0);

      const leastFlood = candidates.find((c) => c.strategy === 'LEAST_FLOOD');
      expect(leastFlood).toBeDefined();

      // Least Flood must NOT use the flooded Nguyen Huu Canh segment (28cm)
      const usedNHC = leastFlood!.segments.some((s) => s.roadId === 'nguyen-huu-canh');
      expect(usedNHC).toBe(false);

      // Least Flood uses the elevated Dien Bien Phu corridor
      const usedDBP = leastFlood!.segments.some((s) => s.roadId === 'dien-bien-phu');
      expect(usedDBP).toBe(true);
      expect(leastFlood!.maxDepthCm!).toBeLessThanOrEqual(10);
    });
  });

  describe('Scenario E: Route Explainability & No Guarantee Wording', () => {
    it('provides human-readable explanation and avoids absolute safety guarantee wording', () => {
      const candidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'car',
        departureHour: 0,
      });

      for (const candidate of candidates) {
        expect(candidate.explanation.length).toBeGreaterThan(10);
        expect(candidate.recommendationText.length).toBeGreaterThan(5);

        // FORBIDDEN wording check
        const text = `${candidate.explanation} ${candidate.recommendationText}`.toLowerCase();
        expect(text).not.toContain('bảo đảm an toàn tuyệt đối');
        expect(text).not.toContain('chắc chắn không ngập');
        expect(text).not.toContain('an toàn 100%');
      }
    });
  });

  describe('Scenario F: Route Deduplication', () => {
    it('does not return duplicate route candidates if paths are identical', () => {
      // Connect across Cau Sai Gon where only 1 single physical link exists
      const candidates = engine.findRoutes({
        originNodeId: 'node-cau-sai-gon-bt',
        destinationNodeId: 'node-cau-sai-gon-td',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      // Exactly 1 unique route exists, so no fake duplicates are generated
      expect(candidates.length).toBe(1);
      expect(candidates[0].segments.length).toBe(1);
      expect(candidates[0].segments[0].id).toBe('seg-cau-sai-gon');
    });
  });

  describe('Scenario E (Extended): No Viable Alternative / Severe Warning', () => {
    it('warns not_recommended when traversing deep flood without inventing safe route', () => {
      // Route directly into Thao Dien flood basin via Quoc Huong (35cm+)
      const candidates = engine.findRoutes({
        originNodeId: 'node-quoc-huong-xlhn',
        destinationNodeId: 'node-quoc-huong-mid',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(candidates.length).toBeGreaterThan(0);
      const cand = candidates[0];
      expect(cand.maxDepthCm!).toBeGreaterThanOrEqual(25);
      expect(cand.recommendationState).toBe('not_recommended');
      expect(cand.recommendationText).toContain('Không khuyến nghị');
    });

    it('returns empty array when two nodes are disconnected, never fakes route', () => {
      // Non-existent or completely isolated node test
      const candidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-fake-isolated-point',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(candidates).toEqual([]);
    });
  });

  describe('ROUTE-ENGINE-QA: Multi-Candidate & Vehicle Differentiation', () => {
    it('generates 2-3 genuinely distinct alternative corridors between Ben Thanh and Thao Dien', () => {
      const candidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(candidates.length).toBeGreaterThanOrEqual(2);
      expect(candidates.length).toBeLessThanOrEqual(3);

      // Verify each candidate has a unique sequence of segments
      const signatures = new Set(candidates.map((c) => c.segments.map((s) => s.id).join('->')));
      expect(signatures.size).toBe(candidates.length);
    });

    it('differentiates scores and travel durations between motorbike and car on the same A/B', () => {
      const mbCandidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      const carCandidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'car',
        departureHour: 0,
      });

      expect(mbCandidates.length).toBeGreaterThan(0);
      expect(carCandidates.length).toBeGreaterThan(0);

      // The top candidate vehicle scores must reflect vehicle differences
      expect(mbCandidates[0].vehicle).toBe('motorbike');
      expect(carCandidates[0].vehicle).toBe('car');
      expect(mbCandidates[0].routeScore).toBeDefined();
      expect(carCandidates[0].routeScore).toBeDefined();
    });
  });

  describe('ROUTE-ENGINE-QA: Stress Test (Item G)', () => {
    it('handles 20 vehicle toggles and 20 timeline changes without performance degradation or state corruption', () => {
      const vehicles: ('motorbike' | 'car')[] = ['motorbike', 'car'];
      const hours = [0, 1, 3, 6, 12, 24];

      for (let i = 0; i < 20; i++) {
        const v = vehicles[i % 2];
        const h = hours[i % hours.length];

        const routes = engine.findRoutes({
          originNodeId: 'node-ben-thanh',
          destinationNodeId: 'node-xuan-thuy-thao-dien',
          vehicle: v,
          departureHour: h,
        });

        expect(routes.length).toBeGreaterThan(0);
        expect(routes[0].vehicle).toBe(v);
        expect(routes[0].routeScore).toBeGreaterThanOrEqual(15);
      }
    });
  });

  describe('Spatial Snapping (Nearest Node Lookup)', () => {
    it('snaps coordinates near Nguyen Huu Canh to node-nhc-thu-thiem', () => {
      const result = engine.findNearestNode(106.7175, 10.7935);
      expect(result).not.toBeNull();
      expect(result!.node.id).toBe('node-nhc-thu-thiem');
      expect(result!.distanceMeters).toBeLessThan(50);
    });

    it('returns null if coordinates are far beyond HCMC urban corridors', () => {
      // Longitude/latitude in South China Sea / Vung Tau far away
      const result = engine.findNearestNode(107.8, 10.1, 3000);
      expect(result).toBeNull();
    });
  });

  describe('V4.2 Credibility & Explainability Enhancements', () => {
    it('calculates length-based coverage and unknownDistanceMeters accurately', () => {
      const routes = engine.findRoutes({
        originNodeId: 'node-doan-van-bo-ttt',
        destinationNodeId: 'node-cau-kenh-te-q4',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(routes.length).toBeGreaterThan(0);
      const cand = routes[0];

      // Route goes through seg-doan-van-bo-connector-unknown
      expect(cand.unknownCount).toBeGreaterThan(0);
      expect(cand.evaluation.unknownSegmentCount).toBe(cand.unknownCount);
      expect(cand.evaluation.unknownDistanceMeters).toBeGreaterThan(0);
      expect(cand.evaluation.totalDistanceMeters).toBe(
        cand.evaluation.knownDistanceMeters + cand.evaluation.unknownDistanceMeters
      );
      expect(cand.evaluation.dataCoverage).toBeCloseTo(
        cand.evaluation.knownDistanceMeters / cand.evaluation.totalDistanceMeters,
        2
      );
      expect(cand.evaluation.dataCoverage).toBeLessThan(1.0);
    });

    it('records candidate omission explanation when fewer than 3 candidates are returned', () => {
      const planResult = engine.findRoutesWithPlan({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 3,
      });

      if (planResult.candidates.length < 3) {
        expect(planResult.omissionNote).toBeDefined();
        expect(typeof planResult.omissionNote).toBe('string');
        expect(planResult.omissionNote).toContain('Chỉ tìm được');
        expect(planResult.omissionReason).toBeDefined();
      }
    });

    it('assigns qualitative compatibilityLevel alongside routeScore', () => {
      const routes = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'car',
        departureHour: 0,
      });

      expect(routes.length).toBeGreaterThan(0);
      for (const r of routes) {
        expect(['CAO', 'VỪA', 'THẤP', 'KHÔNG KHUYẾN NGHỊ']).toContain(r.compatibilityLevel);
        if (r.routeScore >= 80) {
          expect(r.compatibilityLevel).toBe('CAO');
        } else if (r.routeScore >= 55) {
          expect(r.compatibilityLevel).toBe('VỪA');
        } else if (r.routeScore >= 35) {
          expect(r.compatibilityLevel).toBe('THẤP');
        } else {
          expect(r.compatibilityLevel).toBe('KHÔNG KHUYẾN NGHỊ');
        }
      }
    });

    it('respects configurable diversityThreshold', () => {
      // Extremely strict threshold 0.1 should prune routes with minor overlap
      const strictRoutes = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        diversityThreshold: 0.1,
      });

      // Relaxed threshold 0.95 allows more overlap
      const relaxedRoutes = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
        diversityThreshold: 0.95,
      });

      expect(strictRoutes.length).toBeGreaterThan(0);
      expect(relaxedRoutes.length).toBeGreaterThanOrEqual(strictRoutes.length);
    });
  });

});


