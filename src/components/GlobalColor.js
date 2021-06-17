import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import { COLORS } from '../constants'

import { mutation } from '../state/useStore'

// handles gracefully fading all objects to the correct color depending on level
// mutates state directly for performance reasons
export default function GlobalColor({ materialRef }) {
  const colorAlpha = useRef(0)
  const previousLevel = useRef(0)

  const rainbowAlpha1 = useRef(0)
  const rainbowAlpha2 = useRef(0)
  const rainbowAlpha3 = useRef(0)
  const rainbowAlpha4 = useRef(0)
  const rainbowAlpha5 = useRef(0)

  useFrame((state, delta) => {
    // Make sure the first level is red
    if (mutation.level === 0) {
      mutation.globalColor.set(COLORS[0].three)
    }

    // Rainbow Level
    if (mutation.level === 6) {
      const rainbowSpeed = delta * 0.03

      if (rainbowAlpha1.current < 1) {
        rainbowAlpha1.current += rainbowSpeed
        mutation.globalColor.lerpColors(COLORS[0].three, COLORS[2].three, rainbowAlpha1.current)
      } else if (rainbowAlpha2.current < 1) {
        rainbowAlpha2.current += rainbowSpeed
        mutation.globalColor.lerpColors(COLORS[2].three, COLORS[4].three, rainbowAlpha2.current)
      } else if (rainbowAlpha3.current < 1) {
        rainbowAlpha3.current += rainbowSpeed
        mutation.globalColor.lerpColors(COLORS[4].three, COLORS[1].three, rainbowAlpha3.current)
      } else if (rainbowAlpha4.current < 1) {
        rainbowAlpha4.current += rainbowSpeed
        mutation.globalColor.lerpColors(COLORS[1].three, COLORS[5].three, rainbowAlpha4.current)
      } else if (rainbowAlpha5.current < 1) {
        rainbowAlpha5.current += rainbowSpeed
        mutation.globalColor.lerpColors(COLORS[5].three, COLORS[0].three, rainbowAlpha5.current)
      } else {
        rainbowAlpha1.current = 0
        rainbowAlpha2.current = 0
        rainbowAlpha3.current = 0
        rainbowAlpha4.current = 0
        rainbowAlpha5.current = 0
      }

      previousLevel.current = 0

      // regular levels
    } else if (mutation.level > previousLevel.current) {
      mutation.globalColor.lerpColors(COLORS[previousLevel.current].three, COLORS[mutation.level].three, colorAlpha.current)
      if (colorAlpha.current + (delta * mutation.gameSpeed) * 0.5 > 1) {
        colorAlpha.current = 1
      } else {
        colorAlpha.current += (delta * mutation.gameSpeed) * 0.5
      }

      if (colorAlpha.current === 1) {
        previousLevel.current = mutation.level
        colorAlpha.current = 0
      }
    }
  })

  return null
}