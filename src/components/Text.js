import { Text } from '@react-three/drei'
import { useEffect, useRef } from 'react'

import useStore from '../hooks/useGameState'

export default function TextBox({ input }) {
  const groundPosition = useStore(state => state.groundPosition)
  const speed = useStore(state => state.speedFactor)
  const controls = useStore(state => state.controls)

  return (
    <Text fontSize={0.2} position={[-2, 2, 0]} color="white" anchorX="center" anchorY="middle">
      {groundPosition} - {speed} - {JSON.stringify(controls)}
    </Text>
  )
}