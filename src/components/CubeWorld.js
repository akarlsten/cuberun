import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Stars } from '@react-three/drei'


import { useEffect, useRef, useState } from 'react'

import Player from './Player'
import Ground from './Ground'
import Text from './Text'
import KeyboardControls from './KeyboardControls'
import Effects from './Effects'
import Skybox from './Skybox'

export default function CubeWorld({ color, bgColor }) {
  const [light, setLight] = useState()

  return (
    <Canvas dpr={[1, 1.5]} shadows style={{ background: `${bgColor}` }}>
      <Stars transparent opacity={0} radius={200} depth={50} count={5000} factor={10} saturation={0} fade />
      <directionalLight
        ref={setLight}
        intensity={4}
        shadow-bias={-0.001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        castShadow
        position={[0, Math.PI, 0]}
      />
      <ambientLight intensity={0.1} />
      <Player>
        {light && <primitive object={light.target} />}
      </Player>
      <Ground groundColor={bgColor} />
      <Text />
      <Perf />
      <KeyboardControls />
      <Effects />
      <fog attach="fog" args={['black', 10, 500]} />
    </Canvas>
  )
}

