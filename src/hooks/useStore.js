import create from 'zustand'

const useStore = create(set => ({
  speedFactor: 1,
  groundPosition: 0,
  setGroundPosition: (pos) => set(state => ({ groundPosition: pos })),
  increaseSpeed: () => set(state => ({ speedFactor: state.speedFactor + 1 }))
}))

export default useStore