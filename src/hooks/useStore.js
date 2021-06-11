import { createRef } from 'react'
import create from 'zustand'

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
    camera: createRef(),
    ship: createRef(),
    sun: createRef(),
    cubes: [],
    setGroundPosition: (pos) => set(state => ({ groundPosition: pos })),
    increaseSpeed: () => set(state => ({ speedFactor: state.speedFactor + 1 })),
    resetSpeed: () => set(state => ({ speedFactor: 1 }))
  }
})

const mutation = {
  gameSpeed: 0.3,
  leftSpeed: 0,
  rightSpeed: 0
}

export { useStore, mutation }