'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [isClient, setIsClient] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring physics for the laggy sonar-trail feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    setIsClient(true)
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [cursorX, cursorY])

  if (!isClient) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 w-8 h-8 rounded-full border border-white/50 mix-blend-difference"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  )
}
