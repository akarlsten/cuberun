import { Suspense, useRef, useMemo, useLayoutEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTexture, Stars } from '@react-three/drei'
import * as THREE from 'three'

import useStore from '../hooks/useStore'

function Sun() {
  const { clock, camera } = useThree()

  const sun = useStore((s) => s.sun)

  const sunColor = useMemo(() => new THREE.Color(0xffb12b), [sun])

  useLayoutEffect(() => { }, [])

  useFrame((state, delta) => {
    sun.current.scale.x += Math.sin(clock.getElapsedTime() * 3) / 3000
    sun.current.scale.y += Math.sin(clock.getElapsedTime() * 3) / 3000
  })

  return (
    <mesh ref={sun} scale={[1, 1, 1]} position={[0, 0, -1000]}>
      <sphereGeometry attach="geometry" args={[200, 30, 30]} />
      <meshPhongMaterial fog={false} emissive={sunColor} emissiveIntensity={1} attach="material" color="red" />
    </mesh>
  )
}

function Sky() {
  const texture = useTexture('wallup-140739.jpg')
  const sky = useRef()
  const stars = useRef()


  useFrame((state, delta) => {
    sky.current.rotation.z += delta / 50
    stars.current.rotation.z += delta / 50
    sky.current.rotation.y -= delta / 50
    sky.current.rotation.y += delta / 50
  })


  return (
    <>
      <Stars ref={stars} radius={400} depth={50} count={20000} factor={20} saturation={1} fade />
      <mesh ref={sky} scale={[-1, 1, 1]} position={[0, 10, -50]} rotation={[0, 0, 10]}>
        <pointLight position={[0, 5000, 0]} intensity={0.9} />
        <pointLight position={[0, -5000, 0]} intensity={0.9} />
        <sphereGeometry attach="geometry" args={[1000, 10, 10]} />
        <meshPhongMaterial fog={false} side={THREE.BackSide} attach="material" map={texture} />
      </mesh>
    </>
  )
}

export default function Skybox() {

  return (
    <Suspense fallback={null}>
      <Sun />
      <Sky />
    </Suspense>
  )
}