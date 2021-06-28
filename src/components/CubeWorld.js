import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

import { useStore } from '../state/useStore'

// THREE components
import Ship from './Ship'
import Ground from './Ground'
import Effects from './Effects'
import Skybox from './Skybox'
import Cubes from './Cubes'
import FixedCubes from './FixedCubes'
import Chevrons from './Chevrons'
import Walls from './Walls'
import Arch from './Arch'

// State/dummy components
import KeyboardControls from './KeyboardControls'
import GameState from './GameState'
import GlobalColor from './GlobalColor'
import Music from './Music'
import Sound from './Sound'

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
          intensity={3}
          position={[0, Math.PI, 0]}
        />
        <ambientLight intensity={0.1} />
        <Ship>
          {directionalLight.current && <primitive object={directionalLight.current.target} />}
        </Ship>
        <Walls />
        <Cubes />
        <FixedCubes />
        <Chevrons />
        <Arch />
        <Ground groundColor={bgColor} />
        <Perf />
        <KeyboardControls />
        <Effects />
        <GlobalColor />
        <Music />
        <Sound />
      </Canvas>
      <Hud />
      <GameOverScreen />
      <Overlay />
    </>
  )
}

