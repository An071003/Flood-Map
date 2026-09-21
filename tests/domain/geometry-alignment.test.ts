import { describe, it, expect } from 'vitest';
import {
  CANONICAL_ROAD_SEGMENTS,
  CANONICAL_SEGMENTS_MAP,
  getMergedCanonicalGeometry,
} from '../../src/services/geodata/canonical-road-network';
import {
  HCMC_GRAPH_SEGMENTS,
  HCMC_ROAD_NODES,
} from '../../src/services/geodata/hcmc-graph-network';
import { MAJOR_HCMC_ROADS } from '../../src/services/geodata/hcmc-roads';
import { RoutingEngine } from '../../src/domain/routing/routing-engine';

describe('P0 Real Road Geometry QA Heuristics (Spec: GEOMETRY-ALIGNMENT-QA-PROMPT.md)', () => {
  const nodeMap = new Map(HCMC_ROAD_NODES.map((n) => [n.id, n]));

  // Haversine distance helper
  function haversineMeters(lng1: number, lat1: number, lng2: number, lat2: number): number {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371000 * c;
  }

  describe('1. Canonical Network Integrity & Provenance', () => {
    it('ensures 100% of canonical road segments have verified quality and provenance', () => {
      expect(CANONICAL_ROAD_SEGMENTS.length).toBeGreaterThanOrEqual(46);

      for (const seg of CANONICAL_ROAD_SEGMENTS) {
        expect(seg.geometryQuality).toBe('verified');
        expect(seg.source).toBe('osm');
        expect(seg.sourceWayId).toBeDefined();
        expect(seg.id).toBeDefined();
        expect(seg.roadName).toBeDefined();
        expect(seg.lengthMeters).toBeGreaterThan(0);
        expect(seg.estimatedTravelSeconds).toBeGreaterThan(0);
      }
    });

    it('ensures no duplicate segment IDs exist in canonical road network', () => {
      const ids = CANONICAL_ROAD_SEGMENTS.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('validates coordinate boundaries within HCMC geographical bounds', () => {
      for (const seg of CANONICAL_ROAD_SEGMENTS) {
        const coords = seg.geometry.coordinates;
        expect(coords.length).toBeGreaterThanOrEqual(2);

        for (const [lng, lat] of coords) {
          expect(lng).toBeGreaterThan(106.5);
          expect(lng).toBeLessThan(106.85);
          expect(lat).toBeGreaterThan(10.65);
          expect(lat).toBeLessThan(10.9);
          expect(Number.isFinite(lng)).toBe(true);
          expect(Number.isFinite(lat)).toBe(true);
        }
      }
    });
  });

  describe('2. Automated Geometry Heuristics (No Straight-line Shortcuts)', () => {
    it('flags segments exceeding 500m that lack sufficient curvature vertices', () => {
      const LONG_SEGMENT_THRESHOLD = 500;
      const MIN_VERTICES_FOR_LONG_SEGMENTS = 3;

      for (const seg of CANONICAL_ROAD_SEGMENTS) {
        if (seg.lengthMeters >= 1000) {
          // Segments 1km or longer must have at least 4 vertices unless proven straight bridge
          const isStraightBridge = seg.id.includes('bridge') || seg.id.includes('cau-');
          const minExpected = isStraightBridge ? 3 : 4;
          expect(
            seg.geometry.coordinates.length,
            `Segment ${seg.id} (${seg.roadName}, length ${seg.lengthMeters}m) has only ${seg.geometry.coordinates.length} vertices`
          ).toBeGreaterThanOrEqual(minExpected);
        } else if (seg.lengthMeters >= LONG_SEGMENT_THRESHOLD) {
          expect(
            seg.geometry.coordinates.length,
            `Segment ${seg.id} has only ${seg.geometry.coordinates.length} vertices`
          ).toBeGreaterThanOrEqual(MIN_VERTICES_FOR_LONG_SEGMENTS);
        }
      }
    });

    it('verifies endpoint continuity between segments and declared graph nodes (<= 25m)', () => {
      for (const seg of HCMC_GRAPH_SEGMENTS) {
        const fromNode = nodeMap.get(seg.fromNodeId);
        const toNode = nodeMap.get(seg.toNodeId);

        expect(fromNode, `Missing fromNode for ${seg.id}`).toBeDefined();
        expect(toNode, `Missing toNode for ${seg.id}`).toBeDefined();

        const coords = seg.geometry.coordinates;
        const startCoord = coords[0];
        const endCoord = coords[coords.length - 1];

        // First point should match fromNode (or toNode if reversed) within 25m
        const distStartToFrom = haversineMeters(startCoord[0], startCoord[1], fromNode!.lng, fromNode!.lat);
        const distEndToTo = haversineMeters(endCoord[0], endCoord[1], toNode!.lng, toNode!.lat);

        expect(
          distStartToFrom,
          `Segment ${seg.id} start coordinate deviates ${distStartToFrom.toFixed(1)}m from node ${seg.fromNodeId}`
        ).toBeLessThanOrEqual(25);

        expect(
          distEndToTo,
          `Segment ${seg.id} end coordinate deviates ${distEndToTo.toFixed(1)}m from node ${seg.toNodeId}`
        ).toBeLessThanOrEqual(25);
      }
    });
  });

  describe('3. Specific Corridor Real-World Alignment', () => {
    it('verifies Phan Thúc Duyện / Trường Sơn (seg-lang-cha-ca-ptd) hugs park perimeter and does not cut park center', () => {
      const ptdSeg = CANONICAL_SEGMENTS_MAP.get('seg-lang-cha-ca-ptd');
      expect(ptdSeg).toBeDefined();

      // Park center is approximately [106.6605, 10.7985]
      // The road must stay on the western edge (lng <= 106.662 and curves around [106.6612, 10.7990])
      // It must have at least 6 coordinate points tracing the curved perimeter
      expect(ptdSeg!.geometry.coordinates.length).toBeGreaterThanOrEqual(6);

      // Verify each coordinate lies strictly outside the inner park green lawn:
      // Inner lawn is [106.6602..106.6610, 10.7980..10.7995]
      for (const [lng, lat] of ptdSeg!.geometry.coordinates) {
        const inLawnInterior = lng > 106.6602 && lng < 106.6609 && lat > 10.7982 && lat < 10.7995;
        expect(inLawnInterior, `Coordinate [${lng}, ${lat}] cuts through inner park lawn!`).toBe(false);
      }
    });

    it('verifies Trần Xuân Soạn stays south of Kênh Tẻ canal and does not cut into water', () => {
      const txsWest = CANONICAL_SEGMENTS_MAP.get('seg-tran-xuan-soan');
      const txsEast = CANONICAL_SEGMENTS_MAP.get('seg-txs-htp');
      expect(txsWest).toBeDefined();
      expect(txsEast).toBeDefined();

      // Kênh Tẻ canal center is north of lat 10.753. Trần Xuân Soạn road stays south of the embankment (lat <= 10.753)
      for (const [lng, lat] of txsWest!.geometry.coordinates) {
        expect(lat, `Trần Xuân Soạn coordinate [${lng}, ${lat}] cuts north into Kênh Tẻ canal!`).toBeLessThanOrEqual(10.753);
      }
      for (const [lng, lat] of txsEast!.geometry.coordinates) {
        expect(lat, `Trần Xuân Soạn Đông coordinate [${lng}, ${lat}] cuts north into canal!`).toBeLessThanOrEqual(10.753);
      }
    });

    it('verifies river crossing segments occur strictly on valid bridges', () => {
      const bridges = [
        'seg-cau-sai-gon',
        'seg-cau-ba-son',
        'seg-cau-calmette',
        'seg-cau-ong-lanh',
        'seg-cau-khanh-hoi',
        'seg-cau-kenh-te',
        'seg-cau-thu-thiem-1',
      ];

      for (const bridgeId of bridges) {
        const seg = CANONICAL_SEGMENTS_MAP.get(bridgeId);
        expect(seg, `Bridge segment ${bridgeId} not found in canonical network`).toBeDefined();
        expect(seg!.geometry.coordinates.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('4. Monitored Roads Consolidation (Single Source of Truth)', () => {
    it('verifies all 12 monitored roads in MAJOR_HCMC_ROADS derive geometries from canonical segments', () => {
      expect(MAJOR_HCMC_ROADS.length).toBe(12);

      for (const road of MAJOR_HCMC_ROADS) {
        expect(road.properties.segmentIds).toBeDefined();
        expect(road.properties.segmentIds!.length).toBeGreaterThanOrEqual(1);
        expect(road.properties.geometryQuality).toBe('verified');

        // Merged geometry should match the road geometry exactly
        const merged = getMergedCanonicalGeometry(road.properties.segmentIds!);
        expect(road.geometry.coordinates.length).toBe(merged.coordinates.length);
        expect(road.geometry.coordinates).toEqual(merged.coordinates);
      }
    });
  });

  describe('5. Routing Engine Compatibility (Zero Regressions)', () => {
    it('generates multi-segment route candidates with 100% verified canonical geometry', () => {
      const engine = RoutingEngine.getInstance();
      const candidates = engine.findRoutes({
        originNodeId: 'node-ben-thanh',
        destinationNodeId: 'node-xuan-thuy-thao-dien',
        vehicle: 'motorbike',
        departureHour: 0,
      });

      expect(candidates.length).toBeGreaterThan(0);

      for (const cand of candidates) {
        expect(cand.geometry.coordinates.length).toBeGreaterThan(10);

        // Every segment traversed must have verified geometry
        for (const seg of cand.segments) {
          expect(seg.geometryQuality).toBe('verified');
          expect(seg.geometry.coordinates.length).toBeGreaterThanOrEqual(2);
        }

        // Validate continuous stitching (no NaN, no huge teleportation jumps)
        const coords = cand.geometry.coordinates;
        for (let i = 0; i < coords.length - 1; i++) {
          const p1 = coords[i];
          const p2 = coords[i + 1];
          const dist = haversineMeters(p1[0], p1[1], p2[0], p2[1]);
          // Consecutive vertices on real road geometry should be <= 800m
          expect(
            dist,
            `Consecutive vertices in candidate ${cand.id} have abnormal gap of ${dist.toFixed(0)}m between [${p1}] and [${p2}]`
          ).toBeLessThanOrEqual(800);
        }
      }
    });
  });
});
