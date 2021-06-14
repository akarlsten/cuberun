import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

import { useStore, mutation } from '../state/useStore'

export default function TextBox({ input }) {
  const groundPosition = useStore(state => state.groundPosition)
  const speed = useStore(state => state.speedFactor)
  const controls = useStore(state => state.controls)

  const textGroup = useRef()

  const { clock, camera } = useThree()

  const deltaRef = useRef(0)
  const velocityRef = useRef(0)
  const shipRef = useRef({})

  const ship = useStore(state => state.ship)

  useFrame((state, delta) => {
    deltaRef.current = delta
    velocityRef.current = mutation.horizontalVelocity
    if (ship.current) {
      shipRef.current = ship.current
      textGroup.current.position.y = ship.current.position.y
      textGroup.current.position.z = ship.current.position.z
      textGroup.current.position.x = ship.current.position.x
    }
  })

  return (
    <group ref={textGroup}>
      <Text fontSize={0.2} position={[0, 3.3, 0]} color="white" anchorX="center" anchorY="middle">
        Game over: {JSON.stringify(mutation.gameOver)} - X: {shipRef?.current?.position?.x.toFixed(2)} Z: {shipRef?.current?.position?.z.toFixed(2)}
      </Text>
      <Text fontSize={0.2} position={[0, 3, 0]} color="white" anchorX="center" anchorY="middle">
        {mutation.gameSpeed} - {JSON.stringify(controls)}
      </Text>
      <Text fontSize={0.2} position={[0, 2.7, 0]} color="white" anchorX="center" anchorY="middle">
        {velocityRef.current}
      </Text>
    </group>
  )
}