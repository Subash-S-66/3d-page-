import { create } from 'zustand'

interface AppState {
  hasStarted: boolean
  setHasStarted: (started: boolean) => void
  scrollProgress: number
  setScrollProgress: (progress: number) => void
  currentZone: number
  setCurrentZone: (zone: number) => void
}

export const useStore = create<AppState>((set) => ({
  hasStarted: false,
  setHasStarted: (started) => set({ hasStarted: started }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  currentZone: 0,
  setCurrentZone: (zone) => set({ currentZone: zone }),
}))
