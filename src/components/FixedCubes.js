import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import { CUBE_AMOUNT, PLANE_SIZE, COLORS, WALL_RADIUS } from '../constants'
import { useStore, mutation } from '../state/useStore'

import randomInRange from '../util/randomInRange'
import distance2D from '../util/distance2D'
import { generateCubeTunnel, generateDiamond } from '../util/generateFixedCubes'

const negativeBound = -(PLANE_SIZE / 2) + WALL_RADIUS / 2
const positiveBound = (PLANE_SIZE / 2) - WALL_RADIUS / 2

export default function InstancedCubes() {
  const mesh = useRef()
  const material = useRef()

  const ship = useStore(s => s.ship)
  const level = useStore(s => s.level)

  const tunnelCoords = useMemo(() => generateCubeTunnel(), [])
  const diamondCoords = useMemo(() => generateDiamond(), [])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cubes = useMemo(() => {
    // Setup initial cube positions
    const temp = []
    for (let i = 0; i < diamondCoords.length; i++) {
      const x = tunnelCoords[i]?.x || 0
      const y = tunnelCoords[i]?.y || 0
      const z = 300 + tunnelCoords[i]?.z || 10

      temp.push({ x, y, z })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    cubes.forEach((cube, i) => {
      if (ship.current) {
        const distanceToShip = distance2D(ship.current.position.x, ship.current.position.z, cube.x, cube.z)

        if (distanceToShip < 12) {
          mutation.gameSpeed = 0
          mutation.gameOver = true
        }

        if (ship.current.position.z < -PLANE_SIZE && ship.current.position.z < -(level * PLANE_SIZE * 4)) {
          cube.x = diamondCoords[i].x
          cube.y = diamondCoords[i].y
          cube.z = -(level * PLANE_SIZE * 4) - 2000 + diamondCoords[i].z
        }
        // if (cube.z - ship.current.position.z > 15) {
        //   cube.z = ship.current.position.z - 800 // + randomInRange(-400, 400)
        //   cube.x = randomInRange(negativeBound, positiveBound)
        // }
      }

      material.current.color = mutation.globalColor

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
    <instancedMesh ref={mesh} args={[null, null, diamondCoords.length]}>
      <boxBufferGeometry args={[20, 20, 20]} />
      <meshBasicMaterial ref={material} color={COLORS[0].three} />
    </instancedMesh>
  )
}