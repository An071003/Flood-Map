import { create } from 'zustand';
import {
  ActiveLayers,
  AppInteractionMode,
  CandidateOmissionReason,
  DataQualityPreference,
  DataState,
  FloodModelPreference,
  RouteCandidate,
  RouteSnapResult,
  RouteStrategy,
  SearchPlace,
  VehicleType,
} from '../types';
import { RoutingEngine } from '../domain/routing/routing-engine';
import {
  snapCoordinatesToGraph,
  snapCoordinatesToRoutableNetwork,
} from '../services/geodata/hcmc-places-database';

export interface MapStateSnapshot {
  selectedRoadId: string | null;
  timelineHour: number;
  activeLayers: ActiveLayers;
  interactionMode: AppInteractionMode;
}

interface AppState {
  selectedRoadId: string | null;
  timelineHour: number;
  isPlaying: boolean;
  activeLayers: ActiveLayers;
  isSearchOpen: boolean;
  searchQuery: string;
  persistedSearchQuery: string;
  isMobileInspectorExpanded: boolean;
  cameraResetNonce: number;
  dataState: DataState;
  lastUpdatedTimestamp: string;

  // V5 Interaction Mode & Navigation First
  interactionMode: AppInteractionMode;
  originPlace: SearchPlace | null;
  destinationPlace: SearchPlace | null;
  originSnapResult: RouteSnapResult | null;
  destinationSnapResult: RouteSnapResult | null;
  snapWarningNote: string | null;
  floodModelPreference: FloodModelPreference;
  dataQualityPreference: DataQualityPreference;
  userCurrentLocation: { lng: number; lat: number; label: string } | null;
  isLocating: boolean;
  locationError: string | null;

  // V6 Filter Contract & Unsupported Destination State
  selectedStrategy: RouteStrategy;
  preferredMaxDepthCm?: number;
  unsupportedDestinationPending: boolean;
  unsupportedDestinationPlace: SearchPlace | null;

  // V4/V5 Route Planner State
  isRoutePlannerOpen: boolean;
  routeOriginId: string | null;
  routeDestinationId: string | null;
  selectedVehicle: VehicleType;
  routeCandidates: RouteCandidate[];
  selectedRouteCandidateId: string | null;
  routeOmissionNote: string | null;
  routeOmissionReason: CandidateOmissionReason | null;
  requestedRouteCount: number;
  displayedRouteCount: number;

  // State Snapshot & QA Fixture
  priorMapStateSnapshot: MapStateSnapshot | null;
  qaUnknownFixtureEnabled: boolean;

  // Actions
  setSelectedRoadId: (id: string | null) => void;
  setTimelineHour: (hour: number) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  toggleLayer: (layer: keyof ActiveLayers) => void;
  set3D: (is3D: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPersistedSearchQuery: (query: string) => void;
  setMobileInspectorExpanded: (expanded: boolean) => void;
  triggerResetCamera: () => void;
  setDataState: (state: DataState) => void;

  // V5 Actions
  setInteractionMode: (mode: AppInteractionMode) => void;
  setOriginPlace: (place: SearchPlace | null) => void;
  setDestinationPlace: (place: SearchPlace | null) => void;
  setFloodModelPreference: (pref: FloodModelPreference) => void;
  setDataQualityPreference: (pref: DataQualityPreference) => void;
  fetchUserLocation: (target?: 'origin' | 'destination') => Promise<void>;

  // V6 Actions
  setSelectedStrategy: (strategy: RouteStrategy) => void;
  setPreferredMaxDepthCm: (depth?: number) => void;
  confirmUnsupportedDestination: () => void;
  cancelUnsupportedDestination: () => void;

  // Route Planner Actions
  setRoutePlannerOpen: (open: boolean) => void;
  setRouteOriginId: (id: string | null) => void;
  setRouteDestinationId: (id: string | null) => void;
  setSelectedVehicle: (vehicle: VehicleType) => void;
  setSelectedRouteCandidateId: (id: string | null) => void;
  setQaUnknownFixtureEnabled: (enabled: boolean) => void;
  recalculateRoutes: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedRoadId: null, // V5 Browse mode default: no road pre-selected
  timelineHour: 0,
  isPlaying: false,
  activeLayers: {
    roadFlood: false, // Rule 1: Global flood-road overlay default OFF in browse mode
    rain: true,
    weatherLabels: true,
    tide: true,
    is3D: true,
    hcmcBoundary: true,
  },
  isSearchOpen: false,
  searchQuery: '',
  persistedSearchQuery: '',
  isMobileInspectorExpanded: false,
  cameraResetNonce: 0,
  dataState: 'fresh',
  lastUpdatedTimestamp: '14:32 (2 phút trước)',

  // V5 Navigation-first State
  interactionMode: 'browse',
  originPlace: null,
  destinationPlace: null,
  originSnapResult: null,
  destinationSnapResult: null,
  snapWarningNote: null,
  floodModelPreference: 'auto',
  dataQualityPreference: 'all',
  userCurrentLocation: null,
  isLocating: false,
  locationError: null,

  // V6 Filter Contract & Unsupported Destination State
  selectedStrategy: 'LEAST_FLOOD',
  preferredMaxDepthCm: undefined,
  unsupportedDestinationPending: false,
  unsupportedDestinationPlace: null,

  // Route Planner Initial States
  isRoutePlannerOpen: false,
  routeOriginId: 'node-ben-thanh',
  routeDestinationId: 'node-xuan-thuy-thao-dien',
  selectedVehicle: 'motorbike',
  routeCandidates: [],
  selectedRouteCandidateId: null,
  routeOmissionNote: null,
  routeOmissionReason: null,
  requestedRouteCount: 3,
  displayedRouteCount: 0,

  // Initial Snapshot & QA
  priorMapStateSnapshot: null,
  qaUnknownFixtureEnabled: false,

  setDataState: (dataState) => set({ dataState }),
  setSelectedRoadId: (id) => {
    if (id) {
      set({ selectedRoadId: id, interactionMode: 'road-selected' });
    } else {
      set({
        selectedRoadId: null,
        interactionMode: get().isRoutePlannerOpen ? 'route-planning' : 'browse',
      });
    }
  },
  setTimelineHour: (hour) => {
    const clamped = Math.min(Math.max(hour, 0), 24);
    set({ timelineHour: clamped });
    if (get().isRoutePlannerOpen) {
      get().recalculateRoutes();
    }
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layer]: !state.activeLayers[layer],
      },
    })),
  set3D: (is3D) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        is3D,
      },
    })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPersistedSearchQuery: (query) => set({ persistedSearchQuery: query }),
  setMobileInspectorExpanded: (expanded) => set({ isMobileInspectorExpanded: expanded }),
  triggerResetCamera: () => set((state) => ({ cameraResetNonce: state.cameraResetNonce + 1 })),

  // V5 Navigation Actions
  setInteractionMode: (mode) => set({ interactionMode: mode }),

  setOriginPlace: (place) => {
    set({ originPlace: place });
    if (place) {
      const snapResult = snapCoordinatesToRoutableNetwork(place.lng, place.lat);
      const nodeId = place.routableNodeId || snapResult.nodeId;
      set({
        routeOriginId: nodeId,
        originSnapResult: snapResult,
      });
    } else {
      set({ originSnapResult: null });
    }
    get().recalculateRoutes();
  },

  setDestinationPlace: (place) => {
    if (!place) {
      set({
        destinationPlace: null,
        destinationSnapResult: null,
        snapWarningNote: null,
        unsupportedDestinationPending: false,
        unsupportedDestinationPlace: null,
      });
      get().recalculateRoutes();
      return;
    }

    const snapResult = snapCoordinatesToRoutableNetwork(place.lng, place.lat);
    const dist = place.routableSnapDistanceMeters ?? snapResult.distanceMeters;

    // V6 Phase 5: Unsupported destination flow - do not auto-route when status is 'unsupported' (>300m)
    if (snapResult.status === 'unsupported' || dist > 300) {
      const snapWarning = `Tuyến được tính đến điểm hỗ trợ gần nhất, cách vị trí đã chọn ${dist} m.`;
      set({
        destinationPlace: place,
        destinationSnapResult: snapResult,
        unsupportedDestinationPending: true,
        unsupportedDestinationPlace: place,
        routeCandidates: [],
        selectedRouteCandidateId: null,
        snapWarningNote: snapWarning,
      });
      return;
    }

    const nodeId = place.routableNodeId || snapResult.nodeId;
    let snapWarning: string | null = null;
    if (place.isOutsideGraph || dist > 50 || snapResult.status === 'far') {
      snapWarning = `Tuyến được tính đến điểm hỗ trợ gần nhất, cách vị trí đã chọn ${dist} m.`;
    }

    set({
      destinationPlace: place,
      routeDestinationId: nodeId,
      destinationSnapResult: snapResult,
      snapWarningNote: snapWarning,
      unsupportedDestinationPending: false,
      unsupportedDestinationPlace: null,
    });
    get().recalculateRoutes();
  },

  confirmUnsupportedDestination: () => {
    const { unsupportedDestinationPlace, destinationSnapResult } = get();
    if (!unsupportedDestinationPlace || !destinationSnapResult) return;

    const nodeId = destinationSnapResult.nodeId;
    const dist = destinationSnapResult.distanceMeters;
    const snapWarning = `Tuyến được tính đến điểm hỗ trợ gần nhất, cách vị trí đã chọn ${dist} m.`;

    set({
      routeDestinationId: nodeId,
      snapWarningNote: snapWarning,
      unsupportedDestinationPending: false,
    });
    get().recalculateRoutes();
  },

  cancelUnsupportedDestination: () => {
    set({
      destinationPlace: null,
      destinationSnapResult: null,
      unsupportedDestinationPending: false,
      unsupportedDestinationPlace: null,
      snapWarningNote: null,
      isSearchOpen: true,
    });
  },

  setSelectedStrategy: (strategy) => {
    set({ selectedStrategy: strategy });
    if (get().isRoutePlannerOpen) get().recalculateRoutes();
  },

  setPreferredMaxDepthCm: (depth) => {
    set({ preferredMaxDepthCm: depth });
    if (get().isRoutePlannerOpen) get().recalculateRoutes();
  },

  setFloodModelPreference: (pref) => {
    set({ floodModelPreference: pref });
    if (get().isRoutePlannerOpen) get().recalculateRoutes();
  },

  setDataQualityPreference: (pref) => {
    set({ dataQualityPreference: pref });
    if (get().isRoutePlannerOpen) get().recalculateRoutes();
  },

  fetchUserLocation: async (target = 'origin') => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      const fallbackPlace: SearchPlace = {
        id: 'user-fallback-location',
        type: 'poi',
        label: 'Vị trí mặc định (Quận 1 · Bến Thành)',
        name: 'Vị trí mặc định (Quận 1 · Bến Thành)',
        lng: 106.6983,
        lat: 10.7725,
        matchQuality: 'poi',
        routableNodeId: 'node-ben-thanh',
        routableSnapDistanceMeters: 0,
        isOutsideGraph: false,
      };
      set({
        locationError: 'Trình duyệt không hỗ trợ định vị GPS. Đang dùng vị trí Bến Thành (Quận 1).',
      });
      if (target === 'origin') {
        get().setOriginPlace(fallbackPlace);
      } else {
        get().setDestinationPlace(fallbackPlace);
      }
      get().setRoutePlannerOpen(true);
      return;
    }

    set({ isLocating: true, locationError: null });

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lng = pos.coords.longitude;
          const lat = pos.coords.latitude;
          const snap = snapCoordinatesToGraph(lng, lat);
          const currentPlace: SearchPlace = {
            id: 'user-current-location',
            type: 'poi',
            label: 'Vị trí của tôi (GPS)',
            name: 'Vị trí của tôi (GPS)',
            lng,
            lat,
            matchQuality: 'poi',
            routableNodeId: snap.nodeId,
            routableSnapDistanceMeters: snap.distanceMeters,
            isOutsideGraph: snap.distanceMeters > 50,
          };

          set({
            userCurrentLocation: { lng, lat, label: 'Vị trí của tôi (GPS)' },
            isLocating: false,
          });

          if (target === 'origin') {
            get().setOriginPlace(currentPlace);
          } else {
            get().setDestinationPlace(currentPlace);
          }
          get().setRoutePlannerOpen(true);
          resolve();
        },
        (err) => {
          console.warn('Geolocation warning, using central fallback:', err.message);
          const fallbackPlace: SearchPlace = {
            id: 'user-fallback-location',
            type: 'poi',
            label: 'Vị trí mặc định (Quận 1 · Bến Thành)',
            name: 'Vị trí mặc định (Quận 1 · Bến Thành)',
            lng: 106.6983,
            lat: 10.7725,
            matchQuality: 'poi',
            routableNodeId: 'node-ben-thanh',
            routableSnapDistanceMeters: 0,
            isOutsideGraph: false,
          };

          set({
            isLocating: false,
            locationError: 'Không thể truy cập GPS. Đang dùng vị trí Bến Thành (Quận 1).',
          });

          if (target === 'origin') {
            get().setOriginPlace(fallbackPlace);
          } else {
            get().setDestinationPlace(fallbackPlace);
          }
          get().setRoutePlannerOpen(true);
          resolve();
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    });
  },

  // Route Planner Actions with Snapshot & Restore (Phase 1 & 5 Spec)
  setRoutePlannerOpen: (open) => {
    const current = get();
    if (open) {
      // 1. Take a snapshot of prior map state before opening planner
      const snapshot: MapStateSnapshot = {
        selectedRoadId: current.selectedRoadId,
        timelineHour: current.timelineHour,
        activeLayers: { ...current.activeLayers },
        interactionMode: current.interactionMode,
      };
      set({
        priorMapStateSnapshot: snapshot,
        isRoutePlannerOpen: true,
        interactionMode: 'route-planning',
        selectedRoadId: null, // Clear single road inspector to prevent clutter
      });
      get().recalculateRoutes();
    } else {
      // 2. Restore prior map state when closing route planner
      const snapshot = current.priorMapStateSnapshot;
      if (snapshot) {
        set({
          isRoutePlannerOpen: false,
          selectedRoadId: snapshot.selectedRoadId,
          timelineHour: snapshot.timelineHour,
          activeLayers: { ...snapshot.activeLayers },
          interactionMode: snapshot.interactionMode === 'route-planning' ? 'browse' : snapshot.interactionMode,
          priorMapStateSnapshot: null,
          routeCandidates: [],
          selectedRouteCandidateId: null,
          routeOmissionNote: null,
          routeOmissionReason: null,
          displayedRouteCount: 0,
          snapWarningNote: null,
          unsupportedDestinationPending: false,
          unsupportedDestinationPlace: null,
        });
      } else {
        set({
          isRoutePlannerOpen: false,
          interactionMode: 'browse',
          routeCandidates: [],
          selectedRouteCandidateId: null,
          routeOmissionNote: null,
          routeOmissionReason: null,
          displayedRouteCount: 0,
          snapWarningNote: null,
          unsupportedDestinationPending: false,
          unsupportedDestinationPlace: null,
        });
      }
    }
  },

  setRouteOriginId: (id) => {
    set({ routeOriginId: id });
    get().recalculateRoutes();
  },

  setRouteDestinationId: (id) => {
    set({ routeDestinationId: id });
    get().recalculateRoutes();
  },

  setSelectedVehicle: (vehicle) => {
    set({ selectedVehicle: vehicle });
    get().recalculateRoutes();
  },

  setSelectedRouteCandidateId: (id) => set({ selectedRouteCandidateId: id }),

  setQaUnknownFixtureEnabled: (enabled) => {
    set({ qaUnknownFixtureEnabled: enabled });
    if (get().isRoutePlannerOpen) {
      get().recalculateRoutes();
    }
  },

  recalculateRoutes: () => {
    const {
      routeOriginId,
      routeDestinationId,
      selectedVehicle,
      timelineHour,
      qaUnknownFixtureEnabled,
      floodModelPreference,
      dataQualityPreference,
      selectedStrategy,
      preferredMaxDepthCm,
      unsupportedDestinationPending,
    } = get();

    if (unsupportedDestinationPending) {
      return;
    }

    if (!routeOriginId || !routeDestinationId || routeOriginId === routeDestinationId) {
      set({
        routeCandidates: [],
        selectedRouteCandidateId: null,
        routeOmissionNote: null,
        routeOmissionReason: null,
        requestedRouteCount: 3,
        displayedRouteCount: 0,
      });
      return;
    }

    const engine = RoutingEngine.getInstance();
    const planResult = engine.findRoutesWithPlan({
      originNodeId: routeOriginId,
      destinationNodeId: routeDestinationId,
      vehicle: selectedVehicle,
      departureHour: timelineHour,
      qaUnknownFixture: qaUnknownFixtureEnabled,
      floodModelPreference,
      dataQualityPreference,
      preferredStrategy: selectedStrategy,
      customMaxDepthCm: preferredMaxDepthCm,
    });

    set({
      routeCandidates: planResult.candidates,
      selectedRouteCandidateId: planResult.candidates[0]?.id || null,
      routeOmissionNote: planResult.omissionNote || null,
      routeOmissionReason: planResult.omissionReason || null,
      requestedRouteCount: planResult.requestedCount ?? 3,
      displayedRouteCount: planResult.displayedCount ?? planResult.candidates.length,
    });
  },
}));
