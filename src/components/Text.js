import { Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

import useStore from '../hooks/useGameState'

export default function TextBox({ input }) {
  const groundPosition = useStore(state => state.groundPosition)
  const speed = useStore(state => state.speedFactor)
  const controls = useStore(state => state.controls)
  const { clock, camera } = useThree()

  const [deltaTime, setDeltaTime] = useState(0)

  useFrame((state, delta) => {
    setDeltaTime(delta)
  })

  return (
    <>
      <Text fontSize={0.2} position={[0, 3, 0]} color="white" anchorX="center" anchorY="middle">
        {groundPosition} - {speed} - {JSON.stringify(controls)}
      </Text>
      <Text fontSize={0.2} position={[0, 3.3, 0]} color="white" anchorX="center" anchorY="middle">
        {clock.getElapsedTime().toFixed(3)} - {deltaTime}
      </Text>
    </>
  )
}