import { Suspense, useState, useRef, useMemo, useLayoutEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTexture, Stars } from '@react-three/drei'
import * as THREE from 'three'

import galaxyTexture from '../textures/galaxy.jpg'

import { mutation, useStore } from '../state/useStore'

function Sun() {
  const { clock, camera } = useThree()

  const sun = useStore((s) => s.sun)
  const ship = useStore((s) => s.ship)

  const sunColor = useMemo(() => new THREE.Color(1, 0.694, 0.168), [sun])

  useFrame((state, delta) => {
    sun.current.scale.x += Math.sin(clock.getElapsedTime() * 3) / 3000
    sun.current.scale.y += Math.sin(clock.getElapsedTime() * 3) / 3000

    if (ship.current) {
      sun.current.position.z = ship.current.position.z - 1000
      sun.current.position.x = ship.current.position.x
    }
  })

  return (
    <mesh ref={sun} scale={[1, 1, 1]} position={[0, 0, -1000]}>
      <sphereGeometry attach="geometry" args={[200, 30, 30]} />
      <meshPhongMaterial fog={false} emissive={sunColor} emissiveIntensity={1} attach="material" color="red" />
    </mesh>
  )
}

function Sky() {
  const texture = useTexture(galaxyTexture)
  const sky = useRef()
  const stars = useRef()

  const ship = useStore((s) => s.ship)


  useFrame((state, delta) => {
    sky.current.rotation.z += delta * 0.02 * mutation.gameSpeed
    stars.current.rotation.z += delta * 0.02 * mutation.gameSpeed

    if (ship.current) {
      sky.current.position.x = ship.current.position.x
      stars.current.position.x = ship.current.position.x
      sky.current.position.z = ship.current.position.z
      stars.current.position.z = ship.current.position.z
    }
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
      <fog attach="fog" args={['#bf6c00', 600, 800]} />
    </Suspense>
  )
}