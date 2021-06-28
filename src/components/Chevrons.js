import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Cone } from '@react-three/drei'


import { PLANE_SIZE, COLORS, LEVEL_SIZE } from '../constants'
import { useStore, mutation } from '../state/useStore'

import { makeWall } from '../util/generateFixedCubes'


export default function Chevrons() {
  const mesh = useRef()
  const material = useRef()

  const ship = useStore(s => s.ship)
  const level = useStore(s => s.level)

  const { clock } = useThree()

  const wallCoords = useMemo(() => {
    if (PLANE_SIZE === 1000) {
      const coords = [
        {
          x: -440,
          z: -40
        },
        {
          x: -360,
          z: -120
        },
        {
          x: -280,
          z: -200
        },
        {
          x: -200,
          z: -280
        },
        {
          x: -120,
          z: -360
        },
        {
          x: 120,
          z: -360
        },
        {
          x: 200,
          z: -280
        },
        {
          x: 280,
          z: -200
        },
        {
          x: 360,
          z: -120
        },
        {
          x: 440,
          z: -40
        }
      ]

      return coords
    }

    const wall = makeWall()
    const culled = wall.filter((_, index) => {
      return (index + 1) % 2
    })

    return culled
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cones = useMemo(() => {
    // Setup initial cube positions
    const temp = []
    for (let i = 0; i < wallCoords.length; i++) {
      const x = wallCoords[i]?.x || 0
      const y = 50
      const z = 300 + wallCoords[i]?.z || 10

      const rotX = 0
      const rotY = 0
      const rotZ = Math.PI / 2

      temp.push({ x, y, z, rotX, rotY, rotZ })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    cones.forEach((cone, i) => {
      if (ship.current) {

        if (ship.current.position.z < -PLANE_SIZE && ship.current.position.z < -(level * PLANE_SIZE * LEVEL_SIZE)) { // 4
          cone.z = -(level * PLANE_SIZE * LEVEL_SIZE) - PLANE_SIZE * (LEVEL_SIZE - 2) + wallCoords[i].z
        }


        cone.y = 50 + Math.sin(clock.getElapsedTime() * 2) * 2

        if (i < cones.length / 2) {
          cone.rotY = Math.PI
          cone.x += Math.sin(clock.getElapsedTime() * 10) / 10
        } else {
          cone.rotY = Math.PI * 2
          cone.x -= Math.sin(clock.getElapsedTime() * 10) / 10
        }
      }

      material.current.color = mutation.globalColor

      dummy.position.set(
        cone.x,
        cone.y,
        cone.z
      )

      dummy.rotation.set(
        cone.rotX,
        cone.rotY,
        cone.rotZ
      )

      // apply changes to dummy and to the instanced matrix
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })

    // Tells THREE to draw the updated matrix, I guess?
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, wallCoords.length]}>
      <coneBufferGeometry args={[15, 35, 3]} />
      <meshBasicMaterial fog={false} ref={material} color={COLORS[0].three} />
    </instancedMesh>
  )
}