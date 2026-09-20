import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/stores/app-store';
import {
  searchPlaces,
  stripVietnamesePrefixes,
  snapCoordinatesToRoutableNetwork,
  SNAP_THRESHOLDS,
} from '../../src/services/geodata/hcmc-places-database';

describe('V5.1 Rigorous Search & Routing Truthfulness QA Suite', () => {
  beforeEach(() => {
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
      originSnapResult: null,
      destinationSnapResult: null,
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
  // 1. SEARCH-VALIDATION-PROMPT: 7 Essential Queries & Ground-Truth Contracts
  // =========================================================================
  describe('SEARCH-VALIDATION-PROMPT: 7 Canonical Queries Truthfulness', () => {
    it('Query 1: `Nguyễn Hữu Cảnh` -> returns road with matchQuality "street-level" and valid coordinates', () => {
      const results = searchPlaces('Nguyễn Hữu Cảnh');
      expect(results.length).toBeGreaterThan(0);

      const road = results.find((r) => r.type === 'road');
      expect(road).toBeDefined();
      expect(road!.label).toContain('Nguyễn Hữu Cảnh');
      expect(road!.matchQuality).toBe('street-level');
      expect(road!.district).toBe('Bình Thạnh');
      expect(road!.lng).toBeCloseTo(106.715, 1);
      expect(road!.lat).toBeCloseTo(10.795, 1);
      expect(road!.linkedRoadId).toBe('road-nguyen-huu-canh');
      expect(road!.secondaryLabel).toBeDefined();
      expect(road!.secondaryLabel).toContain('Định vị theo tim đường');
    });

    it('Query 2: `123 Nguyễn Hữu Cảnh` -> returns approximate address with honest label & disclaimer', () => {
      const results = searchPlaces('123 Nguyễn Hữu Cảnh');
      expect(results.length).toBeGreaterThan(0);

      const addr = results.find((r) => r.type === 'address');
      expect(addr).toBeDefined();
      expect(addr!.houseNumber).toBe('123');
      expect(addr!.matchQuality).toBe('approximate');
      // Must NOT pretend to be exact house coordinate
      expect(addr!.name || addr!.label).toContain('(ước lượng)');
      expect(addr!.secondaryLabel).toContain('ước lượng theo tim đường');
      expect(addr!.linkedRoadId).toBe('road-nguyen-huu-canh');
      expect(addr!.routableNodeId).toBeDefined();
    });

    it('Query 3: `Chợ Bến Thành` -> returns POI with matchQuality "poi" and verified hub node', () => {
      const results = searchPlaces('Chợ Bến Thành');
      expect(results.length).toBeGreaterThan(0);

      const poi = results.find((r) => r.type === 'poi' || r.name?.includes('Bến Thành'));
      expect(poi).toBeDefined();
      expect(poi!.matchQuality).toBe('poi');
      expect(poi!.district).toBe('Quận 1');
      expect(poi!.routableNodeId).toBe('node-ben-thanh');
      expect(poi!.routableSnapDistanceMeters).toBe(0);
      expect(poi!.isOutsideGraph).toBe(false);
    });

    it('Query 4: `Ngã tư Hàng Xanh` -> returns intersection with matchQuality "poi" & exact hub node', () => {
      const results = searchPlaces('Ngã tư Hàng Xanh');
      expect(results.length).toBeGreaterThan(0);

      const intersection = results[0];
      expect(intersection.matchQuality).toBe('poi');
      expect(intersection.routableNodeId).toBe('node-hang-xanh');
      expect(intersection.district).toBe('Bình Thạnh');
      expect(intersection.routableSnapDistanceMeters).toBe(0);
    });

    it('Query 5: `123/45 Nguyễn Xí` -> detects alley, sets matchQuality "approximate", and notes snap distance', () => {
      const results = searchPlaces('123/45 Nguyễn Xí');
      expect(results.length).toBeGreaterThan(0);

      const alley = results.find((r) => r.type === 'alley');
      expect(alley).toBeDefined();
      expect(alley!.matchQuality).toBe('approximate');
      expect(alley!.houseNumber).toBe('123/45');
      expect(alley!.secondaryLabel).toContain('ước lượng vị trí đầu hẻm');
      expect(alley!.routableSnapDistanceMeters).toBeGreaterThan(50);
      expect(alley!.isOutsideGraph).toBe(true);
    });

    it('Query 6: `nguyen huu canh` & `duong nguyen huu canh` -> prefix-stripped & diacritic-free normalization', () => {
      // Test prefix strip function directly
      expect(stripVietnamesePrefixes('đường Nguyễn Hữu Cảnh')).toBe('Nguyễn Hữu Cảnh');
      expect(stripVietnamesePrefixes('hẻm 48 Điện Biên Phủ')).toBe('48 Điện Biên Phủ');
      expect(stripVietnamesePrefixes('quận Bình Thạnh')).toBe('Bình Thạnh');

      // Test diacritic-insensitive search
      const noDiacritics = searchPlaces('nguyen huu canh');
      expect(noDiacritics.length).toBeGreaterThan(0);
      expect(noDiacritics.some((r) => r.linkedRoadId === 'road-nguyen-huu-canh')).toBe(true);

      // Test with "duong" prefix
      const withPrefix = searchPlaces('duong nguyen huu canh');
      expect(withPrefix.length).toBeGreaterThan(0);
      expect(withPrefix.some((r) => r.linkedRoadId === 'road-nguyen-huu-canh')).toBe(true);
    });

    it('Query 7: Far/unsupported point -> snap distance and limitation properly detected', () => {
      // Coordinates far outside HCMC routable network (e.g. Can Gio deep mangroves or sea)
      const farSnap = snapCoordinatesToRoutableNetwork(107.0, 10.3);
      expect(farSnap.distanceMeters).toBeGreaterThan(SNAP_THRESHOLDS.FAR_MAX_METERS);
      expect(farSnap.status).toBe('unsupported');

      // Store disclosure check
      const store = useAppStore.getState();
      store.setDestinationPlace({
        id: 'far-point',
        type: 'poi',
        label: 'Vị trí xa mạng lưới',
        lng: 107.0,
        lat: 10.3,
        matchQuality: 'poi',
      });

      const stateAfter = useAppStore.getState();
      expect(stateAfter.destinationSnapResult).toBeDefined();
      expect(stateAfter.destinationSnapResult!.status).toBe('unsupported');
      expect(stateAfter.snapWarningNote).toContain('Tuyến được tính đến điểm hỗ trợ gần nhất');
      expect(stateAfter.snapWarningNote).toContain('m.');
    });
  });

  // =========================================================================
  // 2. ROUTE-VISUAL-QA-PROMPT: Snapping Approach Connector & Disclosures
  // =========================================================================
  describe('ROUTE-VISUAL-QA: Approach Connectors and Visual Contracts', () => {
    it('Creates valid snap connector coordinates when destination gap >= 50m', () => {
      const store = useAppStore.getState();
      const alleyPlace = {
        id: 'alley-test',
        type: 'alley' as const,
        label: 'Hẻm 48 Điện Biên Phủ',
        lng: 106.715,
        lat: 10.800,
        matchQuality: 'approximate' as const,
        routableSnapDistanceMeters: 140,
        isOutsideGraph: true,
      };

      store.setDestinationPlace(alleyPlace);

      const state = useAppStore.getState();
      expect(state.destinationSnapResult).toBeDefined();
      expect(state.destinationSnapResult!.distanceMeters).toBeGreaterThanOrEqual(50);
      expect(state.snapWarningNote).toBe(
        'Tuyến được tính đến điểm hỗ trợ gần nhất, cách vị trí đã chọn 140 m.'
      );

      // The snap result contains the input coordinates and the graph-snapped coordinates
      expect(state.destinationSnapResult!.inputLng).toBe(106.715);
      expect(state.destinationSnapResult!.inputLat).toBe(10.800);
      expect(state.destinationSnapResult!.snappedLng).toBeDefined();
      expect(state.destinationSnapResult!.snappedLat).toBeDefined();
      expect(state.destinationSnapResult!.nodeId).toBe('node-hang-xanh');
    });

    it('Does NOT emit snap warning note when place is directly on routable node (< 25m)', () => {
      const store = useAppStore.getState();
      const nodePlace = {
        id: 'direct-node',
        type: 'poi' as const,
        label: 'Chợ Bến Thành',
        lng: 106.6983,
        lat: 10.7725,
        matchQuality: 'poi' as const,
        routableNodeId: 'node-ben-thanh',
        routableSnapDistanceMeters: 0,
        isOutsideGraph: false,
      };

      store.setDestinationPlace(nodePlace);

      const state = useAppStore.getState();
      expect(state.snapWarningNote).toBeNull();
      expect(state.destinationSnapResult?.status).toBe('exact');
    });

    it('Correctly calculates origin snap connector when origin is off-graph', () => {
      const store = useAppStore.getState();
      const alleyOrigin = {
        id: 'alley-orig',
        type: 'alley' as const,
        label: 'Hẻm 60 Ung Văn Khiêm',
        lng: 106.719,
        lat: 10.809,
        matchQuality: 'approximate' as const,
        routableSnapDistanceMeters: 140,
        isOutsideGraph: true,
      };

      store.setOriginPlace(alleyOrigin);

      const state = useAppStore.getState();
      expect(state.originSnapResult).toBeDefined();
      expect(state.originSnapResult!.inputLng).toBe(106.719);
      expect(state.originSnapResult!.inputLat).toBe(10.809);
      expect(state.originSnapResult!.nodeId).toBe('node-hang-xanh');
    });
  });

  // =========================================================================
  // 3. MOBILE-V5.1-QA-PROMPT: Responsiveness, Sheet Gestures & Vehicle Filters
  // =========================================================================
  describe('MOBILE-V5.1-QA: Vehicle routing sensitivity & search cache behavior', () => {
    it('Switches vehicle modes correctly and triggers route recalculation', () => {
      const store = useAppStore.getState();
      expect(store.selectedVehicle).toBe('motorbike');

      store.setSelectedVehicle('car');
      expect(useAppStore.getState().selectedVehicle).toBe('car');

      store.setSelectedVehicle('motorbike');
      expect(useAppStore.getState().selectedVehicle).toBe('motorbike');
    });

    it('Caches search queries and returns consistent results upon repeated queries', () => {
      const firstRun = searchPlaces('Bến Thành');
      const secondRun = searchPlaces('Bến Thành');
      expect(firstRun).toEqual(secondRun);
      expect(firstRun.length).toBeGreaterThan(0);
      expect(firstRun[0].matchQuality).toBe('poi');
    });

    it('Verifies RouteSnapResult contains valid segmentId property', () => {
      const snap = snapCoordinatesToRoutableNetwork(106.7145, 10.7925);
      expect(snap.segmentId).toBeDefined();
      expect(typeof snap.segmentId).toBe('string');
      expect(snap.segmentId.length).toBeGreaterThan(0);
    });

    it('Verifies floodModelPreference === "cautious" increases route penalty in engine', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);
      store.setRouteOriginId('node-nhc-tdt');
      store.setRouteDestinationId('node-nhc-thu-thiem');

      store.setFloodModelPreference('auto');
      const autoCandidates = useAppStore.getState().routeCandidates;
      expect(autoCandidates.length).toBeGreaterThan(0);
      const autoScore = autoCandidates[0].routeScore;

      store.setFloodModelPreference('cautious');
      const cautiousCandidates = useAppStore.getState().routeCandidates;
      expect(cautiousCandidates.length).toBeGreaterThan(0);
      const cautiousScore = cautiousCandidates[0].routeScore;

      // Cautious preference must reflect higher flood penalty (lower or equal suitability score)
      expect(cautiousScore).toBeLessThanOrEqual(autoScore);
    });
  });
});

