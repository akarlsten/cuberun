import { Cone } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import { useStore, mutation } from '../state/useStore'
import { PLANE_SIZE } from '../constants'


export default function Walls() {
  const ship = useStore((s) => s.ship)

  const rightWall = useRef()
  const leftWall = useRef()

  const wallRadius = 40

  useFrame((state, delta) => {
    if (ship.current) {
      rightWall.current.position.z = ship.current.position.z
      leftWall.current.position.z = ship.current.position.z

      if (ship.current.position.x <= (-PLANE_SIZE / 2) + (wallRadius / 2) || ship.current.position.x >= (PLANE_SIZE / 2) - (wallRadius / 2)) {
        mutation.gameSpeed = 0
        mutation.gameOver = true
      }
    }
  })

  return (
    <>
      <Cone args={[wallRadius, PLANE_SIZE, 16]} position={[-PLANE_SIZE / 2, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={leftWall}>
        <meshBasicMaterial attach="material" color="orange" />
      </Cone>
      <Cone args={[wallRadius, PLANE_SIZE, 16]} position={[PLANE_SIZE / 2, 0, -5]} rotation={[Math.PI / 2, 0, Math.PI]} ref={rightWall}>
        <meshBasicMaterial attach="material" color="orange" />
      </Cone>
    </>
  )
}