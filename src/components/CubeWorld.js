import { Canvas, useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Stars } from '@react-three/drei'
import { useEffect, useRef, useState, Suspense } from 'react'

import { useStore } from '../hooks/useStore'

import Ship from './Ship'
import Ground from './Ground'
import Text from './Text'
import KeyboardControls from './KeyboardControls'
import Effects from './Effects'
import Skybox from './Skybox'
import Cubes from './Cubes'
import Walls from './Walls'


export default function CubeWorld({ color, bgColor }) {
  const directionalLight = useStore((s) => s.directionalLight)

  return (
    <Canvas dpr={[1, 1.5]} shadows style={{ background: `${bgColor}` }}>
      <Skybox />
      <directionalLight
        ref={directionalLight}
        intensity={3} // 4
        position={[0, Math.PI, 0]}
      />
      <ambientLight intensity={0.1} />
      <Ship>
        {directionalLight.current && <primitive object={directionalLight.current.target} />}
      </Ship>
      <Walls />
      <Cubes />
      <Ground groundColor={bgColor} />
      <Text />
      <Perf />
      <KeyboardControls />
      <Effects />
    </Canvas>
  )
}

