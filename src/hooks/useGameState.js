import create from 'zustand'

const useGameState = create((set, get) => {

  return {
    set,
    get,
    controls: {
      left: false,
      right: false
    },
    speedFactor: 1,
    groundPosition: 0,
    setGroundPosition: (pos) => set(state => ({ groundPosition: pos })),
    increaseSpeed: () => set(state => ({ speedFactor: state.speedFactor + 1 })),
    resetSpeed: () => set(state => ({ speedFactor: 1 }))
  }
})

export default useGameState