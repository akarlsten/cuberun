import { createRef } from 'react'
import create from 'zustand'

import { CUBE_AMOUNT } from '../constants'

const useStore = create((set, get) => {

  return {
    set,
    get,
    gameOver: false,
    controls: {
      left: false,
      right: false,
    },
    speedFactor: 1,
    groundPosition: 0,
    directionalLight: createRef(),
    camera: createRef(),
    ship: createRef(),
    sun: createRef(),
    cubes: new Array(CUBE_AMOUNT).fill().map(() => {
      const ref = createRef()

      return ref
    }),
    toggleGameOver: () => set(state => ({ gameOver: !state.gameOver }))
  }
})

const mutation = {
  gameOver: false,
  gameSpeed: 0.6,
  horizontalVelocity: 0,
  score: 0,
  level: 0
}

export { useStore, mutation }