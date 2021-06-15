import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import { CUBE_AMOUNT, PLANE_SIZE } from '../constants'
import { useStore, mutation } from '../state/useStore'

import randomInRange from '../util/randomInRange'
import distance2D from '../util/distance2D'

const halfPlane = PLANE_SIZE / 2

export default function InstancedCubes() {
  const mesh = useRef()

  const ship = useStore((s) => s.ship)
  const { clock } = useThree()

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cubes = useMemo(() => {
    // Setup initial cube positions
    const temp = []
    for (let i = 0; i < CUBE_AMOUNT; i++) {
      const x = randomInRange(-halfPlane, halfPlane)
      const y = 10
      const z = -800 + randomInRange(-400, 400)

      temp.push({ x, y, z })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    cubes.forEach((cube, i) => {
      if (ship.current) {
        if (distance2D(ship.current.position.x, ship.current.position.z, cube.x, cube.z) < 12) {
          mutation.gameSpeed = 0
          mutation.gameOver = true
        }

        if (cube.z - ship.current.position.z > 15) {
          cube.z = ship.current.position.z - 800 // + randomInRange(-400, 400)
          cube.x = randomInRange(-halfPlane, halfPlane)
        }
      }



      dummy.position.set(
        cube.x,
        cube.y,
        cube.z
      )

      // apply changes to dummy and to the instanced matrix
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })

    // Tells THREE to draw the updated matrix, I guess?
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, CUBE_AMOUNT]}>
      <boxBufferGeometry args={[20, 20, 20]} />
      <meshBasicMaterial color="orange" />
    </instancedMesh>
  )
}