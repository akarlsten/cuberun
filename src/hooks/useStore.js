import { createRef } from 'react'
import create from 'zustand'

import { CUBE_AMOUNT, STARTING_GAME_SPEED } from '../constants'

const useStore = create((set, get) => {

  return {
    set,
    get,
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
    setGroundPosition: (pos) => set(state => ({ groundPosition: pos })),
    increaseSpeed: () => set(state => ({ speedFactor: state.speedFactor + 1 })),
    resetSpeed: () => set(state => ({ speedFactor: 1 }))
  }
})

const mutation = {
  gameOver: false,
  gameSpeed: STARTING_GAME_SPEED,
  leftSpeed: 0,
  rightSpeed: 0,
  horizontalVelocity: 0
}

export { useStore, mutation }