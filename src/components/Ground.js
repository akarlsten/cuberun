import * as THREE from 'three'
import { useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useStore, mutation } from '../hooks/useStore'

import { PLANE_SIZE } from '../constants'

const TEXTURE_SIZE = PLANE_SIZE * 0.075
const THRESHOLD = (PLANE_SIZE / 2) - (PLANE_SIZE / 4)
const MOVE_DISTANCE = PLANE_SIZE * 2


function Ground({ groundColor }) {
  const ground = useRef()
  const groundTwo = useRef()

  const textures = useTexture(['texture-5.png', 'texture-2.png', 'texture-3.png', 'texture-4.png', 'texture-6.png'])

  const ship = useStore((s) => s.ship)

  useLayoutEffect(() => {
    textures.forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(TEXTURE_SIZE, TEXTURE_SIZE)
      texture.anisotropy = 16
    })
  }, [])

  const moveCounter = useRef(1)
  const lastMove = useRef(0)
  useFrame((state, delta) => {

    if (ship.current) {
      const diff = (Math.round(ship.current.position.z) + THRESHOLD) % PLANE_SIZE
      if (ship.current.position.z < -PLANE_SIZE - 10) {
        if (diff > -10 && diff <= 0) {
          if (+ship.current.position.z - lastMove.current <= 10) {
            if (moveCounter.current % 2 === 0) {
              groundTwo.current.position.z -= MOVE_DISTANCE
              lastMove.current = groundTwo.current.position.z
              groundTwo.current.material.map = textures[4]
            } else {
              ground.current.position.z -= MOVE_DISTANCE
              lastMove.current = ground.current.position.z
              ground.current.material.map = textures[4]
            }


            moveCounter.current += 1
          }
        }
      }
    }



    if (ground.current.position.z >= 5000) {
      // ground.current.position.z = 0
      mutation.gameSpeed += 0.3
    }

    if (mutation.gameSpeed > 5) {
      mutation.gameSpeed = 0.3
    }
  })



  return (
    <>
      <mesh
        ref={ground}
        receiveShadow
        visible
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, PLANE_SIZE, 1, 1]} />
        <meshStandardMaterial
          map={textures[0]}
          receiveShadow
          attach="material"
          roughness={1}
          metalness={0}
          roughness={1}
        />
      </mesh>
      <mesh
        ref={groundTwo}
        receiveShadow
        visible
        position={[0, 0, -PLANE_SIZE]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, PLANE_SIZE, 1, 1]} />
        <meshStandardMaterial
          receiveShadow
          attach="material"
          map={textures[1]}
          roughness={1}
          metalness={0}
          roughness={1}
        />
      </mesh>
    </>
  )
}

function LoadingGround() {
  return (
    <mesh
      receiveShadow
      visible
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeBufferGeometry attach="geometry" args={[5000, 5000, 1, 1]} />
      <meshStandardMaterial
        receiveShadow
        attach="material"
        color={`black`}
        roughness={1}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

export default function CompleteGround({ groundColor }) {

  return (
    <Suspense fallback={<LoadingGround />}>
      <Ground />
    </Suspense>
  )
}