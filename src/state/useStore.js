import { Color } from 'three'
import { createRef } from 'react'
import create from 'zustand'

const useStore = create((set, get) => {

  return {
    set,
    get,
    score: 0,
    level: 0,
    gameOver: false,
    gameStarted: false,
    musicEnabled: JSON.parse(localStorage.getItem('musicEnabled')) ?? false,
    controls: {
      left: false,
      right: false,
    },
    directionalLight: createRef(),
    camera: createRef(),
    ship: createRef(),
    sun: createRef(),
    sfx: createRef(),
    hasInteracted: false,
    setHasInteracted: () => set(state => ({ hasInteracted: true })),
    incrementLevel: () => set(state => ({ level: state.level + 1 })),
    setScore: (score) => set(state => ({ score: score })),
    setGameStarted: (started) => set(state => ({ gameStarted: started })),
    setGameOver: (over) => set(state => ({ gameOver: over })),
    enableMusic: (enabled) => set(state => ({ musicEnabled: enabled }))
  }
})

const mutation = {
  gameOver: false,
  score: 0,
  gameSpeed: 0.0,
  desiredSpeed: 0.0,
  horizontalVelocity: 0,
  colorLevel: 0,
  shouldShiftItems: false,
  currentMusicLevel: 0,
  currentLevelLength: 0,
  globalColor: new Color()
}

export { useStore, mutation }