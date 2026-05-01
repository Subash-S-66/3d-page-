'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import Cursor from '@/components/ui/Cursor'
import SmoothScroll from '@/components/layout/SmoothScroll'
import SplashScreen from '@/components/ui/SplashScreen'
import ScrollTracker from '@/components/layout/ScrollTracker'
import { Canvas } from '@react-three/fiber'
import MainScene from '@/components/canvas/MainScene'
import { motion, AnimatePresence } from 'framer-motion'
import { Anchor } from 'lucide-react'

export default function HomeClient() {
  const [mounted, setMounted] = useState(false)
  const hasStarted = useStore((state) => state.hasStarted)
  const scrollProgress = useStore((state) => state.scrollProgress)
  const currentZone = useStore((state) => state.currentZone)

  const [formState, setFormState] = useState<'idle' | 'typing' | 'sent'>('idle')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when hasn't started
  useEffect(() => {
    if (!mounted) return
    if (!hasStarted) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [hasStarted, mounted])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sent')
    // Call the global function exposed by the 3D transmitter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).fireTransmitter) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).fireTransmitter()
    }
  }

  if (!mounted) return null

  return (
    <main className="bg-black min-h-screen text-white">
      <Cursor />
      <SplashScreen />

      <SmoothScroll>
        <ScrollTracker />
        {/* We need a tall container to scroll through */}
        <div className="relative w-full" style={{ height: '600vh' }}>

          <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
            {hasStarted && (
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <MainScene />
              </Canvas>
            )}
          </div>

          {/* HTML UI Overlay Layer */}
          <div className="relative z-10 w-full h-full pointer-events-none flex flex-col">

            {/* Zone 0 UI */}
            <div className="h-screen flex flex-col items-center justify-end pb-20">
              <motion.div
                className="flex flex-col items-center gap-4 text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: scrollProgress < 0.05 && hasStarted ? 1 : 0 }}
                transition={{ duration: 1 }}
              >
                <span className="text-xs tracking-[0.3em] uppercase">Scroll to descend</span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Anchor size={24} className="opacity-70" />
                </motion.div>
                <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent" />
              </motion.div>
            </div>

            {/* Zone 1 UI */}
            <div className="h-screen flex items-center justify-start pl-20 pointer-events-auto">
               <motion.div
                className="max-w-md"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: currentZone === 1 ? 1 : 0, x: currentZone === 1 ? 0 : -50 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl font-light mb-4 text-[#ffaaee]">SKILLS</h2>
                <p className="text-white/70 font-sans font-light tracking-wide leading-relaxed">
                  Hover over the coral structures to analyze proficiency. Each branching node represents a dedicated discipline, illuminated by years of focused adaptation within the development ecosystem.
                </p>
              </motion.div>
            </div>

            {/* Zone 2 UI */}
            <div className="h-screen flex items-center justify-end pr-20 pointer-events-auto">
              <motion.div
                className="max-w-md text-right"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: currentZone === 2 ? 1 : 0, x: currentZone === 2 ? 0 : 50 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl font-light mb-4 text-[#33aaff]">PROJECTS</h2>
                <p className="text-white/70 font-sans font-light tracking-wide leading-relaxed">
                  Catch the bioluminescent organisms. In the twilight zone, only the most ambitious architecture generates its own light. Click to inspect the core logic.
                </p>
              </motion.div>
            </div>

            {/* Zone 3 UI */}
            <div className="h-screen flex items-center justify-start pl-20 pointer-events-auto">
              <motion.div
                className="max-w-md"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: currentZone === 3 ? 1 : 0, x: currentZone === 3 ? 0 : -50 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-5xl font-light mb-4 text-[#888888]">EXPERIENCE</h2>
                <p className="text-white/70 font-sans font-light tracking-wide leading-relaxed">
                  The midnight zone. Use your cursor as a submarine spotlight to illuminate the ruins of past endeavors. The deeper the wreck, the further back in time.
                </p>
              </motion.div>
            </div>

            {/* Zone 4 UI */}
            <div className="h-screen flex items-center justify-center pointer-events-auto relative">
              <motion.div
                className="absolute text-center max-w-2xl px-4 mix-blend-difference"
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{
                  opacity: currentZone === 4 ? 1 : 0,
                  filter: currentZone === 4 ? 'blur(0px)' : 'blur(10px)'
                }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <p className="font-serif text-2xl md:text-4xl text-white/90 leading-relaxed tracking-wide">
                  &quot;In the depths of complexity, we find the simplest truths.&quot;
                </p>
              </motion.div>
            </div>

            {/* Zone 5 UI - The Contact Form */}
            <div className="h-screen flex items-center justify-center pointer-events-auto">
               <motion.div
                className="max-w-md w-full p-8 border border-white/10 bg-black/50 backdrop-blur-md relative overflow-hidden group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: currentZone === 5 ? 1 : 0, y: currentZone === 5 ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff00ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <h2 className="text-3xl font-light mb-6 text-center tracking-widest text-[#ffaaff]">TRANSMIT</h2>

                <AnimatePresence mode="wait">
                  {formState !== 'sent' ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4 relative z-10"
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <input
                        type="text"
                        placeholder="IDENTIFICATION"
                        className="bg-transparent border-b border-white/20 p-2 text-sm focus:outline-none focus:border-[#ff00ff] transition-colors uppercase tracking-widest"
                        required
                      />
                      <textarea
                        placeholder="MESSAGE PAYLOAD"
                        className="bg-transparent border-b border-white/20 p-2 h-32 text-sm focus:outline-none focus:border-[#ff00ff] transition-colors uppercase tracking-widest resize-none"
                        required
                      />
                      <button
                        type="submit"
                        className="mt-4 border border-[#ff00ff]/50 text-[#ff00ff] py-3 text-sm tracking-widest hover:bg-[#ff00ff]/10 transition-colors uppercase"
                      >
                        Initiate Sequence
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="text-center py-16 text-[#ff00ff] tracking-widest text-sm relative z-10"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      PAYLOAD DELIVERED. ASCENDING.
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </div>
      </SmoothScroll>
    </main>
  )
}
