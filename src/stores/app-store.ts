import { create } from 'zustand';
import { ActiveLayers, DataState, RouteCandidate, VehicleType } from '../types';
import { RoutingEngine } from '../domain/routing/routing-engine';

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

  // V4 Route Planner State
  isRoutePlannerOpen: boolean;
  routeOriginId: string | null;
  routeDestinationId: string | null;
  selectedVehicle: VehicleType;
  routeCandidates: RouteCandidate[];
  selectedRouteCandidateId: string | null;
  routeOmissionNote: string | null;

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

  // V4 Route Planner Actions
  setRoutePlannerOpen: (open: boolean) => void;
  setRouteOriginId: (id: string | null) => void;
  setRouteDestinationId: (id: string | null) => void;
  setSelectedVehicle: (vehicle: VehicleType) => void;
  setSelectedRouteCandidateId: (id: string | null) => void;
  recalculateRoutes: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedRoadId: 'road-nguyen-huu-canh', // Initial road matching specification
  timelineHour: 0,
  isPlaying: false,
  activeLayers: {
    roadFlood: true,
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

  // V4 Initial States
  isRoutePlannerOpen: false,
  routeOriginId: 'node-ben-thanh',
  routeDestinationId: 'node-xuan-thuy-thao-dien',
  selectedVehicle: 'motorbike',
  routeCandidates: [],
  selectedRouteCandidateId: null,
  routeOmissionNote: null,

  setDataState: (dataState) => set({ dataState }),
  setSelectedRoadId: (id) => set({ selectedRoadId: id }),
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

  // V4 Actions
  setRoutePlannerOpen: (open) => {
    set({ isRoutePlannerOpen: open });
    if (open) {
      // Clear single road inspector to prevent clutter
      set({ selectedRoadId: null });
      get().recalculateRoutes();
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
  recalculateRoutes: () => {
    const { routeOriginId, routeDestinationId, selectedVehicle, timelineHour } = get();
    if (!routeOriginId || !routeDestinationId || routeOriginId === routeDestinationId) {
      set({ routeCandidates: [], selectedRouteCandidateId: null, routeOmissionNote: null });
      return;
    }

    const engine = RoutingEngine.getInstance();
    const planResult = engine.findRoutesWithPlan({
      originNodeId: routeOriginId,
      destinationNodeId: routeDestinationId,
      vehicle: selectedVehicle,
      departureHour: timelineHour,
    });

    set({
      routeCandidates: planResult.candidates,
      selectedRouteCandidateId: planResult.candidates[0]?.id || null,
      routeOmissionNote: planResult.omissionNote || null,
    });
  },
}));
