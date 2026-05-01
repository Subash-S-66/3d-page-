'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

export default function SplashScreen() {
  const { hasStarted, setHasStarted } = useStore()
  const [isExiting, setIsExiting] = useState(false)

  const handleStart = () => {
    setIsExiting(true)
    setTimeout(() => {
      setHasStarted(true)
    }, 1000)
  }

  return (
    <AnimatePresence>
      {!hasStarted && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <motion.div
            className="flex flex-col items-center space-y-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase">
              The Deep Dive
            </h1>

            <p className="text-sm tracking-widest text-white/50">
              DEPTH: 0M / 11,000M
            </p>

            <button
              onClick={handleStart}
              className="px-8 py-3 mt-8 border border-white/20 hover:border-white/80 transition-colors duration-500 tracking-widest text-sm uppercase group relative overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                Begin Descent
              </span>
              <div className="absolute inset-0 bg-white transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-in-out" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
