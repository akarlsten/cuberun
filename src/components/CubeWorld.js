import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Stars, Sky } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { BlurPass, Resizer } from 'postprocessing'

import { useEffect, useRef, useState } from 'react'

import Player from './Player'
import Ground from './Ground'
import Text from './Text'
import KeyboardControls from './KeyboardControls'

export default function CubeWorld({ color, bgColor }) {
  const [light, setLight] = useState()

  return (
    <Canvas dpr={[1, 1.5]} shadows style={{ background: `${bgColor}` }}>
      <Stars radius={200} depth={50} count={5000} factor={4} saturation={0} fade />
      <directionalLight
        ref={setLight}
        intensity={1}
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
      <fog attach="fog" args={[bgColor, 0, 500]} />
      <Player>
        {light && <primitive object={light.target} />}
      </Player>
      <Ground />
      <Text />
      <Perf />
      <KeyboardControls />
    </Canvas>
  )
}

