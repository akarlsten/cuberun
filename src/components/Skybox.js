import { Suspense, useRef, useMemo, useLayoutEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTexture, Stars } from '@react-three/drei'
import { Color, BackSide, MirroredRepeatWrapping } from 'three'

import galaxyTexture from '../textures/galaxy.jpg'

import { mutation, useStore } from '../state/useStore'

import { COLORS } from '../constants'

function Sun() {
  const { clock } = useThree()

  const sun = useStore((s) => s.sun)
  const ship = useStore((s) => s.ship)

  const sunColor = useMemo(() => new Color(1, 0.694, 0.168), [])

  useFrame((state, delta) => {
    if (ship.current) {
      sun.current.position.z = ship.current.position.z - 2000
      sun.current.position.x = ship.current.position.x
    }

    const scaleFactor = 0.45 + mutation.currentMusicLevel / 300

    if (scaleFactor > 0.8 && sun.current.scale.x < 1.05) {
      sun.current.scale.x += scaleFactor * delta * 2
      sun.current.scale.y += scaleFactor * delta * 2
    } else if (sun.current.scale.x > 1) {
      sun.current.scale.x -= scaleFactor * delta * 0.5
      sun.current.scale.y -= scaleFactor * delta * 0.5
    }

    sun.current.scale.x += Math.sin(clock.getElapsedTime() * 3) / 3000
    sun.current.scale.y += Math.sin(clock.getElapsedTime() * 3) / 3000
  })

  return (
    <mesh ref={sun} position={[0, 0, -2000]}>
      <sphereGeometry attach="geometry" args={[300, 30, 30]} />
      <meshStandardMaterial fog={false} emissive={sunColor} emissiveIntensity={1} attach="material" color={COLORS[1].three} />
    </mesh>
  )
}

function Sky() {
  const texture = useTexture(galaxyTexture)
  const sky = useRef()
  const stars = useRef()

  const ship = useStore((s) => s.ship)

  useLayoutEffect(() => {
    texture.wrapS = texture.wrapT = MirroredRepeatWrapping
    texture.repeat.set(1.8, 1.8)
    texture.anisotropy = 16
  }, [texture])


  useFrame((state, delta) => {
    sky.current.rotation.z += delta * 0.02 * mutation.gameSpeed
    stars.current.rotation.z += delta * 0.02 * mutation.gameSpeed
    sky.current.emissive = mutation.globalColor

    if (ship.current) {
      sky.current.position.x = ship.current.position.x
      stars.current.position.x = ship.current.position.x
      sky.current.position.z = ship.current.position.z
      stars.current.position.z = ship.current.position.z
    }
  })


  return (
    <>
      <Stars ref={stars} radius={800} depth={100} count={10000} factor={40} saturation={1} fade />
      <mesh ref={sky} position={[0, 10, -50]} rotation={[0, 0, Math.PI]}>
        <hemisphereLight intensity={0.7} />
        <sphereGeometry attach="geometry" args={[2000, 10, 10]} />
        <meshPhongMaterial emissive={COLORS[0].three} emissiveIntensity={0.1} fog={false} side={BackSide} attach="material" map={texture} />
      </mesh>
    </>
  )
}

function Fog() {
  const fog = useRef()

  useFrame((state, delta) => {
    fog.current.near = 100
    fog.current.far = 800
    fog.current.color = mutation.globalColor
  })

  return (
    <fog ref={fog} attach="fog" args={['#bf6c00', 600, 800]} />
  )
}


export default function Skybox() {

  return (
    <Suspense fallback={null}>
      <Sun />
      <Sky />
      <Fog />
    </Suspense>
  )
}