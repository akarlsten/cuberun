import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'

import Player from './Player'
import Ground from './Ground'
import Text from './Text'
import KeyboardControls from './KeyboardControls'

export default function CubeWorld({ color, bgColor }) {

  return (
    <Canvas style={{ background: `${bgColor}` }}>
      <directionalLight intensity={1.5} />
      <ambientLight intensity={0.2} />
      <Player />
      <Text />
      <Ground />
      <Perf />
      <KeyboardControls />
    </Canvas>
  )
}

