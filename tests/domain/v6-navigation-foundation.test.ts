import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/stores/app-store';
import { snapCoordinatesToRoutableNetwork } from '../../src/services/geodata/hcmc-places-database';
import { HCMC_GRAPH_SEGMENTS } from '../../src/services/geodata/hcmc-graph-network';

describe('V6 Navigation Foundation: Snapping, Unsupported Destinations, and Route Filters', () => {
  beforeEach(() => {
    // Reset store state
    const store = useAppStore.getState();
    store.setRoutePlannerOpen(false);
    store.setSelectedStrategy('LEAST_FLOOD');
    store.setPreferredMaxDepthCm(undefined);
    store.setOriginPlace(null);
    store.setDestinationPlace(null);
  });

  describe('1. Segment-Level Orthogonal Snapping', () => {
    it('accurately projects point onto segment polyline and computes valid snapped coordinates', () => {
      // Point directly near Dien Bien Phu segment: [106.702, 10.785] to [106.701, 10.792]
      // Test coordinate slightly east of the segment:
      const inputLng = 106.7019;
      const inputLat = 10.788;
      const snap = snapCoordinatesToRoutableNetwork(inputLng, inputLat);

      expect(snap.status).toBe('near');
      expect(snap.distanceMeters).toBeLessThanOrEqual(80);
      expect(snap.segmentId).toBeDefined();
      expect(snap.nodeId).toBeDefined();
      expect(snap.snappedLng).toBeCloseTo(106.7016, 2);
      expect(snap.snappedLat).toBeCloseTo(10.788, 2);
    });

    it('assigns status exact when point is directly on the road segment (< 25m)', () => {
      const snap = snapCoordinatesToRoutableNetwork(106.6983, 10.7725); // Ben Thanh
      expect(snap.status).toBe('exact');
      expect(snap.distanceMeters).toBeLessThan(25);
    });

    it('assigns status unsupported when point is far from any road network (> 300m)', () => {
      const remoteSnap = snapCoordinatesToRoutableNetwork(107.05, 10.25); // Far ocean / Can Gio
      expect(remoteSnap.status).toBe('unsupported');
      expect(remoteSnap.distanceMeters).toBeGreaterThan(300);
    });
  });

  describe('2. Unsupported Destination Confirmation Flow (Phase 5)', () => {
    it('halts auto-routing when destination snap status is unsupported (> 300m)', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);
      store.setRouteOriginId('node-ben-thanh');

      // Set destination far beyond network
      store.setDestinationPlace({
        id: 'off-grid-island',
        type: 'poi',
        label: 'Khu vực xa ngoài mạng đường',
        lng: 107.1,
        lat: 10.2,
        matchQuality: 'poi',
      });

      const state = useAppStore.getState();
      // Must set pending flag and NOT compute route candidates
      expect(state.unsupportedDestinationPending).toBe(true);
      expect(state.routeCandidates.length).toBe(0);
      expect(state.unsupportedDestinationPlace?.id).toBe('off-grid-island');
    });

    it('proceeds to route only after explicit confirmUnsupportedDestination action', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);
      store.setRouteOriginId('node-ben-thanh');

      store.setDestinationPlace({
        id: 'off-grid-island',
        type: 'poi',
        label: 'Khu vực xa ngoài mạng đường',
        lng: 107.1,
        lat: 10.2,
        matchQuality: 'poi',
      });

      expect(useAppStore.getState().unsupportedDestinationPending).toBe(true);

      // User explicitly confirms routing to nearest supported road point
      useAppStore.getState().confirmUnsupportedDestination();

      const afterConfirm = useAppStore.getState();
      expect(afterConfirm.unsupportedDestinationPending).toBe(false);
      expect(afterConfirm.routeDestinationId).toBeDefined();
      expect(afterConfirm.routeCandidates.length).toBeGreaterThan(0);
    });

    it('cancels destination and reopens search when cancelUnsupportedDestination is triggered', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);

      store.setDestinationPlace({
        id: 'off-grid-island',
        type: 'poi',
        label: 'Khu vực xa ngoài mạng đường',
        lng: 107.1,
        lat: 10.2,
        matchQuality: 'poi',
      });

      useAppStore.getState().cancelUnsupportedDestination();

      const afterCancel = useAppStore.getState();
      expect(afterCancel.unsupportedDestinationPending).toBe(false);
      expect(afterCancel.destinationPlace).toBeNull();
      expect(afterCancel.isSearchOpen).toBe(true);
    });
  });

  describe('3. Route Filter Contract (Phase 6 & 7)', () => {
    it('supports selecting strategy (LEAST_FLOOD, BALANCED, FASTEST) and reranks candidates', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);
      store.setRouteOriginId('node-ben-thanh');
      store.setRouteDestinationId('node-quoc-huong-xlhn');

      store.setSelectedStrategy('FASTEST');
      const stateFastest = useAppStore.getState();
      expect(stateFastest.selectedStrategy).toBe('FASTEST');
      expect(stateFastest.routeCandidates.length).toBeGreaterThan(0);
      expect(stateFastest.routeCandidates[0].strategy).toBe('FASTEST');

      store.setSelectedStrategy('LEAST_FLOOD');
      const stateLeast = useAppStore.getState();
      expect(stateLeast.selectedStrategy).toBe('LEAST_FLOOD');
      expect(stateLeast.routeCandidates[0].strategy).toBe('LEAST_FLOOD');
    });

    it('supports setting preferredMaxDepthCm and recalculates route candidates', () => {
      const store = useAppStore.getState();
      store.setRoutePlannerOpen(true);
      store.setRouteOriginId('node-ben-thanh');
      store.setRouteDestinationId('node-nhc-tan-cang');

      // By default without limit
      store.setPreferredMaxDepthCm(undefined);
      const withoutLimit = useAppStore.getState().routeCandidates;
      expect(withoutLimit.length).toBeGreaterThan(0);

      // With strict limit <= 10cm
      store.setPreferredMaxDepthCm(10);
      const withLimit = useAppStore.getState().routeCandidates;
      expect(useAppStore.getState().preferredMaxDepthCm).toBe(10);
      expect(withLimit.length).toBeGreaterThan(0);
    });
  });

  describe('4. Road Graph Expansion Road Classes (Phase 3)', () => {
    it('includes residential and service road classes in HCMC_GRAPH_SEGMENTS', () => {
      const residentialSeg = HCMC_GRAPH_SEGMENTS.find((s) => s.roadClass === 'residential');
      const serviceSeg = HCMC_GRAPH_SEGMENTS.find((s) => s.roadClass === 'service');

      expect(residentialSeg).toBeDefined();
      expect(residentialSeg!.roadClass).toBe('residential');
      expect(serviceSeg).toBeDefined();
      expect(serviceSeg!.roadClass).toBe('service');
    });
  });
});
