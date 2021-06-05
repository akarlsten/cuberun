import { Text } from '@react-three/drei'
import { useEffect, useRef } from 'react'

import useStore from '../hooks/useStore'

export default function TextBox({ input }) {
  const groundPosition = useStore(state => state.groundPosition)
  const speed = useStore(state => state.speedFactor)

  return (
    <Text fontSize={0.2} position={[-2, 2, 0]} color="white" anchorX="center" anchorY="middle">
      {groundPosition} - {speed}
    </Text>
  )
}