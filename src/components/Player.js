import { Suspense } from 'react'
import Car from './Car'

const Loading = () => {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}


export default function Player() {

  return (
    <Suspense fallback={<Loading />}>
      <Car />
    </Suspense>
  )
}