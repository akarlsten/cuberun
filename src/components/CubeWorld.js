import { Canvas, useFrame } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect, useRef, useState, Suspense } from 'react'

import { useStore } from '../state/useStore'

// THREE components
import Ship from './Ship'
import Ground from './Ground'
import Text from './Text'
import Effects from './Effects'
import Skybox from './Skybox'
import Cubes from './Cubes'
import Walls from './Walls'

// State/dummy components
import KeyboardControls from './KeyboardControls'
import GameState from './GameState'

// HTML components
import Overlay from './html/Overlay'
import Hud from './html/Hud'
import GameOverScreen from './html/GameOverScreen'


export default function CubeWorld({ color, bgColor }) {
  const directionalLight = useStore((s) => s.directionalLight)

  return (
    <>
      <Canvas dpr={[1, 1.5]} shadows style={{ background: `${bgColor}` }}>
        <GameState />
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
      <Hud />
      <GameOverScreen />
      <Overlay />
    </>
  )
}

