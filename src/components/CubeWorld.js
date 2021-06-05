import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'

import Player from './Player'
import Ground from './Ground'
import Text from './Text'

import useStore from '../hooks/useStore'

export default function CubeWorld({ color, bgColor }) {
  const groundPosRef = useRef(useStore.getState().groundPosition)

  useEffect(() => {
    useStore.subscribe(
      groundPosition => (groundPosRef.current = groundPosition),
      state => state.groundPosition
    )
  }, [])

  return (
    <Canvas style={{ background: `${bgColor}` }}>
      <directionalLight intensity={1.5} />
      <ambientLight intensity={0.2} />
      <Player />
      <Text />
      <Ground />
      <Perf />
    </Canvas>
  )
}

