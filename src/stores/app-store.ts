import { create } from 'zustand';
import { ActiveLayers, DataState } from '../types';

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
}

export const useAppStore = create<AppState>((set) => ({
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
  setDataState: (dataState) => set({ dataState }),

  setSelectedRoadId: (id) => set({ selectedRoadId: id }),
  setTimelineHour: (hour) => set({ timelineHour: Math.min(Math.max(hour, 0), 24) }),
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
}));
