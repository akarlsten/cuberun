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
    setGroundPosition: (pos) => set(state => ({ groundPosition: pos })),
    increaseSpeed: () => set(state => ({ speedFactor: state.speedFactor + 1 })),
    resetSpeed: () => set(state => ({ speedFactor: 1 }))
  }
})

const mutation = {
  velocity: [0, 0, 0],
  gameSpeed: 0
}

export default useStore