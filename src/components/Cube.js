import { Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useLayoutEffect } from 'react'

import { mutation } from '../hooks/useStore'

const randPosNeg = (from, to) => Math.floor(Math.random() * (to - from + 1)) - to

export default function Cube() {
  const cube = useRef()
  const cubeOpacityFactor = useRef(0)

  useLayoutEffect(() => {
    cube.current.position.z = -800 + randPosNeg(-300, 300)
    cube.current.position.x = randPosNeg(-1000, 1000)
  }, [])

  useFrame((state, delta) => {
    cube.current.position.z += 200 * delta * mutation.gameSpeed
    cube.current.position.x += Math.min(0.5, mutation.leftSpeed)
    cube.current.position.x -= Math.min(0.5, mutation.rightSpeed)

    if (cube.current.position.z > 15) {
      cube.current.position.z = -800 + randPosNeg(-300, 300)
      cube.current.position.x = randPosNeg(-1000, 1000)
      cube.current.material.opacity = 0
    }

    if (cube.current.position.z < -500) {
      if (cube.current.material.opacity < 1.0) {
        cubeOpacityFactor.current += delta / 5
        cube.current.material.opacity += cubeOpacityFactor.current
      }
    }
  })

  return (
    <Box ref={cube} position={[0, 0, -800]} args={[10, 10, 10]}>
      <meshBasicMaterial transparent opacity={1} attach="material" color="orange" />
    </Box>
  )
}