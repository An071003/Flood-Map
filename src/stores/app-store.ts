import { create } from 'zustand';
import { ActiveLayers } from '../types';

interface AppState {
  selectedAreaId: string | null;
  timelineHour: number;
  isPlaying: boolean;
  activeLayers: ActiveLayers;
  isSearchOpen: boolean;
  searchQuery: string;
  isMobileInspectorExpanded: boolean;
  cameraResetNonce: number;

  // Actions
  setSelectedAreaId: (id: string | null) => void;
  setTimelineHour: (hour: number) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  toggleLayer: (layer: keyof ActiveLayers) => void;
  set3D: (is3D: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setMobileInspectorExpanded: (expanded: boolean) => void;
  triggerResetCamera: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedAreaId: 'binh-thanh-nhc', // Initial selected area matching Prototype State C
  timelineHour: 0,
  isPlaying: false,
  activeLayers: {
    flood: true,
    rain: true,
    weather: true,
    tide: true,
    is3D: true,
  },
  isSearchOpen: false,
  searchQuery: '',
  isMobileInspectorExpanded: false,
  cameraResetNonce: 0,

  setSelectedAreaId: (id) => set({ selectedAreaId: id }),
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
  setMobileInspectorExpanded: (expanded) => set({ isMobileInspectorExpanded: expanded }),
  triggerResetCamera: () => set((state) => ({ cameraResetNonce: state.cameraResetNonce + 1 })),
}));
