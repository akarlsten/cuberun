import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useRef, useLayoutEffect, useState, Suspense, useMemo } from 'react'
import { MirroredRepeatWrapping, Vector2, BackSide } from 'three'

import { useStore, mutation } from '../state/useStore'
import { PLANE_SIZE, COLORS, LEVEL_SIZE } from '../constants'

import galaxyTexture from '../textures/galaxyTextureBW.png'

function HyperspaceTunnel() {
  const texture = useTexture(galaxyTexture)

  const ship = useStore((s) => s.ship)
  const level = useStore(s => s.level)

  const { clock } = useThree()

  const tunnel = useRef()

  const tunnel2 = useRef()

  const tunnels = useRef()

  const repeatX = useRef(10)
  const repeatY = useRef(4)


  const [lathe] = useState(() => {
    const points = [
      new Vector2(100, 150),
      new Vector2(90, 200),
      new Vector2(80, 250),
      new Vector2(70, 300),
      new Vector2(60, 350),
      new Vector2(50, 400),

    ]

    return points
  })

  const [lathe2] = useState(() => {
    const points = [
      new Vector2(50, 400),
      new Vector2(300, 600), // 6
      new Vector2(300, 1000), // 7
      new Vector2(300, 1600), // 8
      new Vector2(100, 1720), // 9
      new Vector2(50, 1790),
      new Vector2(50, 1980)]

    return points
  })

  useLayoutEffect(() => {
    texture.wrapS = texture.wrapT = MirroredRepeatWrapping
    texture.repeat.set(10, 4)
    texture.anisotropy = 16
  }, [texture])

  const lowerBound = useMemo(() => -4250 - PLANE_SIZE * (level * LEVEL_SIZE), [level])
  const upperBound = useMemo(() => -6500 - PLANE_SIZE * (level * LEVEL_SIZE), [level])
  const prevLowerBound = useMemo(() => -4250 - PLANE_SIZE * ((level - 1) * LEVEL_SIZE), [level])
  const prevUpperBound = useMemo(() => -6500 - PLANE_SIZE * ((level - 1) * LEVEL_SIZE), [level])

  useFrame((state, delta) => {
    if (ship.current) {
      if (mutation.shouldShiftItems) {
        tunnel.current.position.z = lowerBound - 50
        tunnel2.current.position.z = lowerBound - 50
      }
    }

    if (ship.current) {
      if ((ship.current.position.z < lowerBound && ship.current.position.z > upperBound) ||
        (ship.current.position.z < prevLowerBound && ship.current.position.z > prevUpperBound)) {
        tunnel2.current.visible = true
      } else {
        tunnel2.current.visible = false
      }
    }


    repeatY.current = 0.3 + (Math.sin(clock.getElapsedTime() / 3)) * 1.5
    repeatX.current = 6 + (Math.sin(clock.getElapsedTime() / 2)) * 4

    tunnel.current.material.map.offset.x += 0.01 * delta * 165
    tunnel.current.material.map.offset.y += 0.005 * delta * 165
    tunnel.current.material.map.repeat.set(repeatX.current, repeatY.current)
    tunnel.current.material.emissive = mutation.globalColor
    tunnel2.current.material.map.offset.x += 0.01 * delta * 165
    tunnel2.current.material.map.offset.y += 0.005 * delta * 165
    tunnel2.current.material.map.repeat.set(repeatX.current, repeatY.current)
    tunnel2.current.material.emissive = mutation.globalColor
  })

  return (
    <group ref={tunnels}>
      <mesh ref={tunnel} position={[0, 0, -4300]} rotation={[0, -Math.PI / 2, Math.PI / 2]}>
        <latheBufferGeometry args={[lathe, 50]} />
        <meshStandardMaterial fog={false} attach="material" side={BackSide} emissiveIntensity={0.4} emissive={COLORS[5].three} map={texture} />
      </mesh>
      <mesh visible={false} ref={tunnel2} position={[0, 0, -4300]} rotation={[0, -Math.PI / 2, Math.PI / 2]}>
        <latheBufferGeometry args={[lathe2, 50]} />
        <meshStandardMaterial fog={false} attach="material" side={BackSide} emissiveIntensity={0.4} emissive={COLORS[5].three} map={texture} />
      </mesh>
    </group>
  )
}

export default function SuspendedHyperspaceTunnel() {
  return (
    <Suspense fallback={null}>
      <HyperspaceTunnel />
    </Suspense>
  )
}