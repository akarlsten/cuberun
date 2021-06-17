import { Color } from 'three'
import { createRef } from 'react'
import create from 'zustand'

const useStore = create((set, get) => {

  return {
    set,
    get,
    score: 0,
    currentSpeed: 0,
    gameOver: false,
    gameStarted: false,
    musicEnabled: true,
    controls: {
      left: false,
      right: false,
    },
    directionalLight: createRef(),
    camera: createRef(),
    ship: createRef(),
    sun: createRef(),
    setCurrentSpeed: (speed) => set(state => ({ currentSpeed: speed })),
    setScore: (score) => set(state => ({ score: score })),
    setGameStarted: (started) => set(state => ({ gameStarted: started })),
    setGameOver: (over) => set(state => ({ gameOver: over })),
    toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled }))
  }
})

const mutation = {
  gameOver: false,
  gameSpeed: 0.0,
  desiredSpeed: 0.0,
  horizontalVelocity: 0,
  level: 0,
  globalColor: new Color()
}

export { useStore, mutation }