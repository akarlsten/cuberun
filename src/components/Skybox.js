import { useThree } from '@react-three/fiber'
import { CubeTextureLoader } from 'three'

// TODO: delete this ugly shit

export default function Skybox() {
  const { scene } = useThree()
  const loader = new CubeTextureLoader()

  const texture = loader.load([
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
  ])

  scene.background = texture

  return null
}