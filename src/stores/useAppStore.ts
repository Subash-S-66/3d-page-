import { create } from 'zustand';

interface AppState {
  currentRoomId: string;
  isTransitioning: boolean;
  setCurrentRoomId: (id: string) => void;
  setIsTransitioning: (val: boolean) => void;
  controlsEnabled: boolean;
  setControlsEnabled: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRoomId: 'lobby',
  isTransitioning: false,
  setCurrentRoomId: (id) => set({ currentRoomId: id }),
  setIsTransitioning: (val) => set({ isTransitioning: val }),
  controlsEnabled: true,
  setControlsEnabled: (val) => set({ controlsEnabled: val })
}));
