import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

import { PLANE_SIZE, COLORS, LEVEL_SIZE, CUBE_SIZE } from '../constants'
import { useStore, mutation } from '../state/useStore'

import distance2D from '../util/distance2D'
import { generateCubeTunnel, generateDiamond } from '../util/generateFixedCubes'


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
      const y = 0
      const z = 300 + tunnelCoords[i]?.z || 10

      temp.push({ x, y, z })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    cubes.forEach((cube, i) => {
      if (ship.current) {
        if (cube.z - ship.current.position.z > -15) {
          if (cube.x - ship.current.position.x > -15 || cube.x - ship.current.position.x < 15) {
            const distanceToShip = distance2D(ship.current.position.x, ship.current.position.z, cube.x, cube.z)

            if (distanceToShip < 12) {
              mutation.gameSpeed = 0
              mutation.gameOver = true
            }
          }
        }

        if (ship.current.position.z < -PLANE_SIZE && ship.current.position.z < -(level * PLANE_SIZE * LEVEL_SIZE) - 250) { // 4
          cube.x = diamondCoords[i].x
          cube.y = 0
          cube.z = -(level * PLANE_SIZE * LEVEL_SIZE) - PLANE_SIZE * (LEVEL_SIZE - 2) + diamondCoords[i].z
        }

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
      <boxBufferGeometry args={[20, 40, 20]} />
      <meshBasicMaterial ref={material} color={COLORS[0].three} />
    </instancedMesh>
  )
}