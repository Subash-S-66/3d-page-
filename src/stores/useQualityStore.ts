import { create } from 'zustand';

interface QualityState {
  tier: 'low' | 'high' | 'uninitialized';
  setTier: (tier: 'low' | 'high') => void;
  initializeQuality: () => void;
}

export const useQualityStore = create<QualityState>((set) => ({
  tier: 'uninitialized',
  setTier: (tier) => set({ tier }),
  initializeQuality: () => {
    // Simple GPU performance heuristic
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      set({ tier: 'low' });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        set({ tier: 'low' });
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Fallback for known low-end or integrated GPUs if necessary,
        // but generally for desktop we'll assume 'high' unless specifically weak
        if (renderer.includes('intel') || renderer.includes('hd graphics')) {
           // We might still allow high on Intel, but let's just default to high on desktop for this demo
           // unless it's a very weak integrated card.
           set({ tier: 'high' }); // Keep it simple: High for desktop, Low for mobile
        } else {
           set({ tier: 'high' });
        }
      } else {
        set({ tier: 'high' });
      }
    } catch (e) {
      set({ tier: 'low' });
    }
  }
}));
