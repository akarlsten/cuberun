import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

import useStore from '../hooks/useStore'

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
      <Text fontSize={0.2} position={[0, 3, 0]} color="white" anchorX="center" anchorY="middle">
        {groundPosition.toFixed(1)} - {speed} - {JSON.stringify(controls)}
      </Text>
      <Text fontSize={0.2} position={[0, 3.3, 0]} color="white" anchorX="center" anchorY="middle">
        {clock.getElapsedTime().toFixed(3)} - {deltaRef.current.toPrecision(3)}
      </Text>
    </group>
  )
}