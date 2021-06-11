import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

import { useStore, mutation } from '../hooks/useStore'

export default function TextBox({ input }) {
  const groundPosition = useStore(state => state.groundPosition)
  const speed = useStore(state => state.speedFactor)
  const controls = useStore(state => state.controls)

  const textGroup = useRef()

  const { clock, camera } = useThree()

  const deltaRef = useRef(0)

  const ship = useStore(state => state.ship)

  useFrame((state, delta) => {
    deltaRef.current = delta
    if (ship.current) {
      textGroup.current.position.y = ship.current.position.y
    }
  })

  return (
    <group ref={textGroup}>
      <Text fontSize={0.2} position={[0, 2.7, 0]} color="white" anchorX="center" anchorY="middle">
        Left: {mutation.leftSpeed.toFixed(3)} | Right: {mutation.rightSpeed.toFixed(3)}
      </Text>
      <Text fontSize={0.2} position={[0, 3, 0]} color="white" anchorX="center" anchorY="middle">
        {mutation.gameSpeed} - {JSON.stringify(controls)}
      </Text>
      <Text fontSize={0.2} position={[0, 3.3, 0]} color="white" anchorX="center" anchorY="middle">
        {clock.getElapsedTime().toFixed(3)} - {deltaRef.current.toPrecision(3)}
      </Text>
    </group>
  )
}