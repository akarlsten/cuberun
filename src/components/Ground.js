import * as THREE from 'three'
import { useRef, useState, Suspense, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'

import { useStore, mutation } from '../hooks/useStore'

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

function Ground({ groundColor }) {
  const ground = useRef()
  const increaseSpeed = useStore(state => state.increaseSpeed)
  const resetSpeed = useStore(state => state.resetSpeed)

  const texture = useLoader(THREE.TextureLoader, 'texture-5.png')

  const [color, setColor] = useState(randomColor)

  // subscribe to controller updates on mount
  const controlsRef = useRef(useStore.getState().controls)
  useEffect(() => useStore.subscribe(
    controls => (controlsRef.current = controls),
    state => state.controls
  ), [])

  useFrame((state, delta) => {
    const { left, right } = controlsRef.current
    const { speedFactor: speed } = useStore.getState()

    ground.current.position.z += 200 * delta * mutation.gameSpeed

    if (ground.current.position.z >= 5000) {
      ground.current.position.z = 0
      mutation.gameSpeed += 0.3
      setColor(randomColor)
    }

    if (mutation.gameSpeed > 5) {
      mutation.gameSpeed = 0.3
    }

    if (left && !right) {
      ground.current.position.x += Math.min(0.5, mutation.leftSpeed)
    }

    if (!left && right) {
      ground.current.position.x -= Math.min(0.5, mutation.rightSpeed)
    }
  })

  if (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1500, 1500)
    texture.anisotropy = 16
  }

  return (
    <>
      {/* <gridHelper widlin ref={ground} rotation={[0, 0, 0]} position={[0, -5, 0]} args={[20000, 400, 'hotpink' || `#${color}`, 'hotpink' || `#${color}`]} /> */}
      <mesh
        ref={ground}
        receiveShadow
        visible
        position={[0, -5.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[20000, 20000, 1, 1]} />
        <meshStandardMaterial
          map={texture}
          receiveShadow
          attach="material"
          roughness={1}
          metalness={0}
          roughness={1}
        />
      </mesh>
    </>
  )
}

function LoadingGround() {
  return (
    <mesh
      receiveShadow
      visible
      position={[0, -5.05, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeBufferGeometry attach="geometry" args={[5000, 5000, 1, 1]} />
      <meshStandardMaterial
        receiveShadow
        attach="material"
        color={`black`}
        roughness={1}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

export default function CompleteGround({ groundColor }) {

  return (
    <Suspense fallback={<LoadingGround />}>
      <Ground />
    </Suspense>
  )

}