'use client'

import { useLenis } from 'lenis/react'
import { useStore } from '@/store/useStore'

export default function ScrollTracker() {
  const setScrollProgress = useStore((state) => state.setScrollProgress)
  const setCurrentZone = useStore((state) => state.setCurrentZone)

  useLenis(({ progress }) => {
    setScrollProgress(progress)

    // Roughly determine current zone based on progress (0 to 1)
    const totalZones = 6
    const zoneIndex = Math.min(Math.floor(progress * totalZones), totalZones - 1)
    setCurrentZone(zoneIndex)
  })

  return null
}
