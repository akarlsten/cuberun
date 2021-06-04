import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

import Player from './Player'


export default function CubeWorld({ color, bgColor }) {

  return (
    <Canvas style={{ background: `${bgColor}` }}>
      <directionalLight intensity={1.5} />
      <ambientLight intensity={0.2} />
      <Player />
      <Perf />
    </Canvas>
  )
}

