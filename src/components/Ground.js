import * as THREE from 'three'
import React, { useRef, useState, Suspense, useMemo, useLayoutEffect, useCallback } from 'react'
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useStore, mutation } from '../state/useStore'

import { PLANE_SIZE, GAME_SPEED_MULTIPLIER } from '../constants'

import gridRed from '../textures/grid-red.png'
import gridOrange from '../textures/grid-orange.png'
import gridGreen from '../textures/grid-green.png'
import gridBlue from '../textures/grid-blue.png'
import gridPurple from '../textures/grid-purple.png'
import gridPink from '../textures/grid-pink.png'
import gridRainbow from '../textures/grid-rainbow.png'
import gridWhite from '../textures/grid-white.png'

const TEXTURE_SIZE = PLANE_SIZE * 0.075
const MOVE_DISTANCE = PLANE_SIZE * 2

const color = new THREE.Color(0x000000)

function Ground() {
  const ground = useRef()
  const groundTwo = useRef()

  const plane = useRef()
  const planeTwo = useRef()

  const textures = useTexture([gridRed, gridOrange, gridGreen, gridBlue, gridPurple, gridPink, gridRainbow, gridWhite])

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
  const { clock } = useThree()
  useFrame((state, delta) => {
    // const mySine = Math.sin(clock.getElapsedTime())

    // plane.current.material.emissiveIntensity = (mySine + 1) / 2

    if (ship.current) {
      // Alternates moving the two ground planes when we've just passed over onto a new plane, with logic to make sure it only happens once per pass
      // Checks if weve moved 10 meters into the new plane (-10) (so the old plane is no longer visible)
      if (Math.round(ship.current.position.z) + PLANE_SIZE * moveCounter.current + 10 < -10) {

        // Ensures we only move the plane once per pass
        if (moveCounter.current === 1 || Math.abs(ship.current.position.z) - Math.abs(lastMove.current) <= 10) {

          // change the level every 4 moves or 4000 meters
          if (moveCounter.current % 4 === 0) {
            mutation.level++
            mutation.desiredSpeed += GAME_SPEED_MULTIPLIER

            if (mutation.level >= textures.length) {
              mutation.level = 0
            }
          }

          if (moveCounter.current % 2 === 0) {
            groundTwo.current.position.z -= MOVE_DISTANCE
            lastMove.current = groundTwo.current.position.z
            planeTwo.current.material.map = textures[mutation.level]
          } else {
            ground.current.position.z -= MOVE_DISTANCE
            lastMove.current = ground.current.position.z
            plane.current.material.map = textures[mutation.level]
          }
        }

        moveCounter.current++
      }
    }

    if (mutation.level > 0) {
      if (plane.current.material.map.uuid !== planeTwo.current.material.map.uuid) {
        if (plane.current.material.emissiveIntensity < 1) {
          if (plane.current.material.emissiveIntensity + delta * mutation.gameSpeed > 1) {
            plane.current.material.emissiveIntensity = 1
          } else {
            plane.current.material.emissiveIntensity += delta * mutation.gameSpeed
            // plane.current.material.color.addScalar(-(delta / (4 - mutation.gameSpeed)))
          }
        } else {
          plane.current.material.map = textures[mutation.level]
          if (mutation.level === textures.length - 1) {
            plane.current.material.emissiveMap = textures[0]
          } else {
            plane.current.material.emissiveMap = textures[mutation.level + 1]
          }
          plane.current.material.emissiveIntensity = 0
          // plane.current.material.color.set(0xFFFFFF)
        }
      }
    }
  })


  return (
    <>
      <group ref={ground} position={[0, 0, -(PLANE_SIZE / 2)]}>
        <mesh
          ref={plane}
          receiveShadow
          visible
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, PLANE_SIZE, 1, 1]} />
          <meshStandardMaterial
            receiveShadow
            color={color.set(0xFFFFFF)}
            emissiveMap={textures[1]}
            emissive={color.set(0xFFFFFF)}
            emissiveIntensity={0}
            attach="material"
            map={textures[0]}
            roughness={1}
            metalness={0}
          />
        </mesh>
      </group>
      <group ref={groundTwo} position={[0, 0, -PLANE_SIZE - (PLANE_SIZE / 2)]}>
        <mesh
          ref={planeTwo}
          receiveShadow
          visible
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeBufferGeometry attach="geometry" args={[PLANE_SIZE, PLANE_SIZE, 1, 1]} />
          <meshStandardMaterial
            receiveShadow
            emissiveMap={textures[1]}
            attach="material"
            map={textures[0]}
            roughness={1}
            metalness={0}
          />
        </mesh>
      </group>
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

export default function CompleteGround() {

  return (
    <Suspense fallback={<LoadingGround />}>
      <Ground />
    </Suspense>
  )
}