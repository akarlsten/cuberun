import * as THREE from 'three'
import React, { useRef, useState, Suspense, useMemo, useLayoutEffect, useCallback } from 'react'
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useStore, mutation } from '../state/useStore'

import { PLANE_SIZE, GAME_SPEED_MULTIPLIER } from '../constants'

import { CrossFadeMaterial } from '../shaders/CrossFadeMaterial'

const TEXTURE_SIZE = PLANE_SIZE * 0.075
const MOVE_DISTANCE = PLANE_SIZE * 2

const onBeforeCompile = shader => {
  shader.uniforms = {
    ...shader.uniforms,
    mixFactor: { type: 'f', value: 0.5 },
    map2: { value: new THREE.Texture() }
  }
  shader.fragmentShader = shader.fragmentShader.replace(`#include <map_pars_fragment>`,
    `
              #ifdef USE_MAP
                uniform sampler2D map;
                uniform sampler2D map2;
                uniform float mixFactor;
              #endif
              `)
  shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`,
    `
              #ifdef USE_MAP
                vec4 _texture = texture2D( map, vUv );
                vec4 _texture2 = texture2D( map2, vUv);
                vec4 texelColor = mix(_texture, _texture2, mixFactor);
                texelColor = mapTexelToLinear( texelColor );
                diffuseColor *= texelColor;
              #endif
              `)
}


function Ground({ groundColor }) {
  const ground = useRef()
  const groundTwo = useRef()

  const plane = useRef()
  const planeTwo = useRef()

  const textures = useTexture(['textures/grid-red.png', 'textures/grid-orange.png', 'textures/grid-green.png', 'textures/grid-blue.png', 'textures/grid-purple.png', 'textures/grid-pink.png', 'textures/grid-rainbow.png'])

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
    // plane.current.material.mixFactor = Math.sin(clock.getElapsedTime())
    plane.current.material.contrast = 1 + Math.sin(clock.getElapsedTime())
    if (ship.current) {
      // Alternates moving the two ground planes when we've just passed over onto a new plane, with logic to make sure it only happens once per pass
      // Checks if weve moved 10 meters into the new plane (-10) (so the old plane is no longer visible)
      if (Math.round(ship.current.position.z) + PLANE_SIZE * moveCounter.current + 10 < -10) {

        // Ensures we only move the plane once per pass
        if (moveCounter.current === 1 || Math.abs(ship.current.position.z) - Math.abs(lastMove.current) <= 10) {

          // change the grid color every 4 moves or 4000 meters
          if (moveCounter.current % 4 === 0) {
            mutation.level++
            mutation.gameSpeed += GAME_SPEED_MULTIPLIER
            if (mutation.level > textures.length) {
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
  })

  const oBC = useCallback(onBeforeCompile)

  const uniforms = useMemo(() => ({
    map2: { value: textures[1] },
    mixFactor: { value: 0.5 }
  }), [])

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
          <crossFadeMaterial
            texture1={textures[0]}
            texture2={textures[1]}
            repeats={80}
            mixFactor={0.0}
            brightness={0.0}
            contrast={1.2}
            receiveShadow
            attach="material"
            metalness={0}
            roughness={1}
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
            attach="material"
            map={textures[0]}
            roughness={1}
            metalness={0}
            roughness={1}
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

export default function CompleteGround({ groundColor }) {

  return (
    <Suspense fallback={<LoadingGround />}>
      <Ground />
    </Suspense>
  )
}