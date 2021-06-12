import { Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useLayoutEffect, forwardRef, createRef } from 'react'

import { mutation, useStore } from '../hooks/useStore'

import { PLANE_SIZE, CUBE_AMOUNT } from '../constants'

const randPosNeg = (from, to) => Math.floor(Math.random() * (to - from + 1)) - to

function distance2D(p1x, p1y, p2x, p2y) {
  const a = p2x - p1x;
  const b = p2y - p1y;

  return Math.sqrt(a * a + b * b);
}

const Cube = forwardRef((_, cube) => {
  // const cube = useRef()
  const cubeOpacityFactor = useRef(0)

  const ship = useStore((s) => s.ship)

  useLayoutEffect(() => {
    cube.current.position.z = -800 + randPosNeg(-300, 300)
    cube.current.position.x = randPosNeg(-(PLANE_SIZE / 2), PLANE_SIZE / 2)
  }, [])

  useFrame((state, delta) => {
    cube.current.position.z += 200 * delta * mutation.gameSpeed
    // cube.current.position.x += Math.min(0.5, mutation.leftSpeed)
    // cube.current.position.x -= Math.min(0.5, mutation.rightSpeed)

    if (ship.current) {
      if (distance2D(ship.current.position.x, ship.current.position.z, cube.current.position.x, cube.current.position.z) < 10) {
        mutation.gameSpeed = 0
        mutation.gameOver = true
      }

      if (cube.current.position.z - ship.current.position.z > 15) {
        cube.current.position.z = ship.current.position.z - 800 + randPosNeg(-300, 300)
        cube.current.position.x = randPosNeg(-(PLANE_SIZE / 2), PLANE_SIZE)
        cube.current.material.opacity = 0
      }

      if (cube.current.position.z - ship.current.position.z < -500) {
        if (cube.current.material.opacity < 1.0) {
          cubeOpacityFactor.current += delta / 5
          cube.current.material.opacity += cubeOpacityFactor.current
        }
      }
    }
  })

  return (
    <Box ref={cube} position={[0, 10, -800]} args={[20, 20, 20]}>
      <meshBasicMaterial transparent opacity={1} attach="material" color="orange" />
    </Box>
  )
})

// function Cube() {
//   const cube = useRef()
//   const cubeOpacityFactor = useRef(0)

//   const ship = useStore((s) => s.ship)

//   useLayoutEffect(() => {
//     cube.current.position.z = -800 + randPosNeg(-300, 300)
//     cube.current.position.x = randPosNeg(-(PLANE_SIZE / 2), PLANE_SIZE / 2)
//   }, [])

//   useFrame((state, delta) => {
//     cube.current.position.z += 200 * delta * mutation.gameSpeed
//     // cube.current.position.x += Math.min(0.5, mutation.leftSpeed)
//     // cube.current.position.x -= Math.min(0.5, mutation.rightSpeed)

//     if (ship.current) {
//       if (cube.current.position.z - ship.current.position.z > 15) {
//         cube.current.position.z = ship.current.position.z - 800 + randPosNeg(-300, 300)
//         cube.current.position.x = randPosNeg(-(PLANE_SIZE / 2), PLANE_SIZE)
//         cube.current.material.opacity = 0
//       }

//       if (cube.current.position.z - ship.current.position.z < -500) {
//         if (cube.current.material.opacity < 1.0) {
//           cubeOpacityFactor.current += delta / 5
//           cube.current.material.opacity += cubeOpacityFactor.current
//         }
//       }
//     }
//   })

//   return (
//     <Box ref={cube} position={[0, 10, -800]} args={[20, 20, 20]}>
//       <meshBasicMaterial transparent opacity={1} attach="material" color="orange" />
//     </Box>
//   )
// }

export default function Cubes() {
  const cubes = useStore((s) => s.cubes)

  return cubes.map((ref, idx) => {
    return <Cube key={idx} ref={ref} />
  })
}