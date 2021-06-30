import { Cone } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import { useStore, mutation } from '../state/useStore'
import { PLANE_SIZE, WALL_RADIUS, COLORS, LEFT_BOUND, RIGHT_BOUND } from '../constants'

export default function Walls() {
  const ship = useStore((s) => s.ship)

  const rightWall = useRef()
  const leftWall = useRef()

  useFrame((state, delta) => {
    if (ship.current) {
      rightWall.current.position.z = ship.current.position.z
      leftWall.current.position.z = ship.current.position.z

      if (ship.current.position.x <= LEFT_BOUND + (WALL_RADIUS / 2) || ship.current.position.x >= RIGHT_BOUND - (WALL_RADIUS / 2)) {
        mutation.gameSpeed = 0
        mutation.gameOver = true
      }
    }

    leftWall.current.material.color = mutation.globalColor
    rightWall.current.material.color = mutation.globalColor
  })

  return (
    <>
      <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[LEFT_BOUND, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={leftWall}>
        <meshBasicMaterial attach="material" color={COLORS[0].three} />
      </Cone>
      <Cone args={[WALL_RADIUS, PLANE_SIZE * 2, 8]} position={[RIGHT_BOUND, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={rightWall}>
        <meshBasicMaterial attach="material" color={COLORS[0].three} />
      </Cone>
    </>
  )
}