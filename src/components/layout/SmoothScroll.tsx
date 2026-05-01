'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
