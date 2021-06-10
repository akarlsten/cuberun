import { useEffect } from 'react'
import useGameState from '../hooks/useStore'

const pressed = []

function useKeys(target, event, up = true) {
  useEffect(() => {
    const downHandler = (e) => {
      if (target.indexOf(e.key) !== -1) {
        const isRepeating = !!pressed[e.keyCode]
        pressed[e.keyCode] = true
        if (up || !isRepeating) event(true)
      }
    }

    const upHandler = (e) => {
      if (target.indexOf(e.key) !== -1) {
        pressed[e.keyCode] = false
        if (up) event(false)
      }
    }

    window.addEventListener('keydown', downHandler, { passive: true })
    window.addEventListener('keyup', upHandler, { passive: true })
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [target, event, up])
}

export default function KeyboardControls() {
  const set = useGameState((state) => state.set)
  useKeys(['ArrowLeft', 'a', 'A'], (left) => set((state) => ({ ...state, controls: { ...state.controls, left } })))
  useKeys(['ArrowRight', 'd', 'D'], (right) => set((state) => ({ ...state, controls: { ...state.controls, right } })))

  return null
}