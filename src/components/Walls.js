import { Cone } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import { useStore, mutation } from '../state/useStore'
import { PLANE_SIZE, WALL_RADIUS, COLORS } from '../constants'

export default function Walls() {
  const ship = useStore((s) => s.ship)

  const rightWall = useRef()
  const leftWall = useRef()

  useFrame((state, delta) => {
    if (ship.current) {
      rightWall.current.position.z = ship.current.position.z
      leftWall.current.position.z = ship.current.position.z

      if (ship.current.position.x <= (-PLANE_SIZE / 2) + (WALL_RADIUS / 2) || ship.current.position.x >= (PLANE_SIZE / 2) - (WALL_RADIUS / 2)) {
        mutation.gameSpeed = 0
        mutation.gameOver = true
      }
    }

    leftWall.current.material.color = mutation.globalColor
    rightWall.current.material.color = mutation.globalColor
  })

  return (
    <>
      <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[-PLANE_SIZE / 2, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={leftWall}>
        <meshBasicMaterial attach="material" color={COLORS[0].three} />
      </Cone>
      <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[PLANE_SIZE / 2, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={rightWall}>
        <meshBasicMaterial attach="material" color={COLORS[0].three} />
      </Cone>
    </>
  )
}