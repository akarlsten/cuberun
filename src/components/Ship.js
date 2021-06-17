import React, { useRef, useLayoutEffect, useEffect, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

import EngineSparks from './EngineSparks'

import shipModel from '../models/spaceship.gltf'


import { useStore, mutation } from '../state/useStore'

const v = new THREE.Vector3()

function ShipModel(props, { children }) {
  const { nodes, materials } = useGLTF(shipModel)

  // tie ship and camera ref to store to allow getting at them elsewhere
  const ship = useStore((s) => s.ship)
  const camera = useStore((s) => s.camera)

  const pointLight = useRef()

  const outerExhaust = useRef()
  const innerExhaust = useRef()
  const engineSparks = useRef()

  const leftWingTrail = useRef()
  const rightWingTrail = useRef()

  const { clock } = useThree()

  // subscribe to controller updates on mount
  const controlsRef = useRef(useStore.getState().controls)
  useEffect(() => useStore.subscribe(
    controls => (controlsRef.current = controls),
    state => state.controls
  ), [])

  useLayoutEffect(() => {
    camera.current.rotation.set(0, Math.PI, 0)
    camera.current.position.set(0, 4, -9) // 0, 1.5, -8
    camera.current.lookAt(v.set(ship.current.position.x, ship.current.position.y, ship.current.position.z + 10)) // modify the camera tracking to look above the center of the ship

    camera.current.rotation.z = Math.PI
    ship.current.rotation.y = Math.PI
  }, [])

  useFrame((state, delta) => {
    const accelDelta = 1 * delta * 1.5

    const time = clock.getElapsedTime()

    const slowSine = Math.sin(time * 5)
    const medSine = Math.sin(time * 10)
    const fastSine = Math.sin(time * 15)

    const { left, right } = controlsRef.current

    rightWingTrail.current.scale.x = fastSine / 100
    rightWingTrail.current.scale.y = medSine / 100
    leftWingTrail.current.scale.x = fastSine / 100
    leftWingTrail.current.scale.y = medSine / 100

    // Forward Movement
    ship.current.position.z -= mutation.gameSpeed * delta * 165


    // Lateral Movement
    if (mutation.gameOver) {
      mutation.horizontalVelocity = 0
    }
    ship.current.position.x += mutation.horizontalVelocity * delta * 165

    // Curving during turns
    ship.current.rotation.z = mutation.horizontalVelocity * 1.5
    ship.current.rotation.y = Math.PI - mutation.horizontalVelocity * 0.4
    ship.current.rotation.x = Math.abs(mutation.horizontalVelocity) / 10 // max/min velocity is -0.5/0.5, divide by ten to get our desired max rotation of 0.05

    // Ship Jitter - small incidental movements
    ship.current.position.y -= slowSine / 200
    ship.current.rotation.x += slowSine / 100
    ship.current.rotation.z += Math.sin(time * 4) / 100

    // pointLight follow along 
    pointLight.current.position.z = ship.current.position.z + 1
    pointLight.current.position.x = ship.current.position.x
    pointLight.current.position.y -= slowSine / 80

    // uncomment to unlock camera
    camera.current.position.z = ship.current.position.z + 13.5 // + 13.5
    camera.current.position.y = ship.current.position.y + 5 // 5
    camera.current.position.x = ship.current.position.x

    camera.current.rotation.y = Math.PI

    if ((left && right) || (!left && !right)) {
      if (mutation.horizontalVelocity < 0) {
        if (mutation.horizontalVelocity + accelDelta > 0) {
          mutation.horizontalVelocity = 0
        } else {
          mutation.horizontalVelocity += accelDelta
        }
      }

      if (mutation.horizontalVelocity > 0) {
        if (mutation.horizontalVelocity - accelDelta < 0) {
          mutation.horizontalVelocity = 0
        } else {
          mutation.horizontalVelocity -= accelDelta
        }
      }
    }

    if (!mutation.gameOver && mutation.gameSpeed > 0) {
      if ((left && !right)) {
        mutation.horizontalVelocity = Math.max(-0.5, mutation.horizontalVelocity - accelDelta)

        // wing trail
        rightWingTrail.current.scale.x = fastSine / 30
        rightWingTrail.current.scale.y = slowSine / 30
        leftWingTrail.current.scale.x = fastSine / 200
        leftWingTrail.current.scale.y = slowSine / 200
      }

      if ((!left && right)) {
        mutation.horizontalVelocity = Math.min(0.5, mutation.horizontalVelocity + accelDelta)

        // wing trail
        leftWingTrail.current.scale.x = fastSine / 30
        leftWingTrail.current.scale.y = slowSine / 30
        rightWingTrail.current.scale.x = fastSine / 200
        rightWingTrail.current.scale.y = slowSine / 200
      }
    }

    pointLight.current.intensity = 10 + (fastSine * 5)
    outerExhaust.current.scale.x = 0.15 + fastSine / 15
    outerExhaust.current.scale.y = 0.30 + slowSine / 10
    innerExhaust.current.scale.x = 0.10 + fastSine / 15
    innerExhaust.current.scale.y = 0.25 + slowSine / 10
  })

  return (
    <>
      <pointLight ref={pointLight} color="tomato" decay={10} distance={40} intensity={5} position={[0, 3, -5]} />
      <PerspectiveCamera makeDefault ref={camera} fov={75} rotation={[0, Math.PI, 0]} position={[0, 10, -10]} />
      <group castShadow receiveShadow ref={ship} position={[0, 3, -10]} {...props} dispose={null}>
        {children}
        <mesh geometry={nodes.Ship_Body.geometry}>
          <meshStandardMaterial attach="material" color="lightblue" metalness={0.8} reflectivity={1} clearcoat={1} roughness={0} />
        </mesh>
        <mesh receiveShadow castShadow geometry={nodes.Ship_Body_1.geometry} material={materials.Chassis} />
        <mesh geometry={nodes.Ship_Body_2.geometry}>
          <meshBasicMaterial attach="material" color="orange" />
        </mesh>
        <mesh receiveShadow castShadow geometry={nodes.Ship_Body_3.geometry} material={materials['Gray Metal']} />
        <mesh geometry={nodes.Ship_Body_4.geometry}>
          <meshBasicMaterial attach="material" color="white" />
        </mesh>
        <mesh ref={leftWingTrail} scale={[0.1, 0.05, 2]} position={[1.4, 0.2, -7]}>
          <dodecahedronBufferGeometry args={[1.5, 3]} />
          <meshBasicMaterial transparent opacity={0.8} color="white" />
        </mesh>
        <mesh ref={rightWingTrail} scale={[0.1, 0.05, 2]} position={[-1.4, 0.2, -7]}>
          <dodecahedronBufferGeometry args={[1.5, 3]} />
          <meshBasicMaterial transparent opacity={0.8} color="white" />
        </mesh>
        <mesh ref={outerExhaust} scale={[0.1, 0.05, 2]} position={[0, -0.3, -4]}>
          <dodecahedronBufferGeometry args={[1.5, 3]} />
          <MeshDistortMaterial speed={2} distort={0.2} radius={1} transparent opacity={0.6} color="red" />
        </mesh>
        <mesh ref={innerExhaust} scale={[0.1, 0.05, 2]} position={[0, -0.3, -4]}>
          <dodecahedronBufferGeometry args={[1.5, 3]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <EngineSparks position={[0, -2, -4]} ref={engineSparks} />
      </group>
    </>
  )
}


useGLTF.preload(shipModel)

function Loading() {
  return (
    <mesh visible position={[0, 0.87, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="black"
        transparent
        opacity={1}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}


export default function Ship({ children }) {

  return (
    <Suspense fallback={<Loading />}>
      <ShipModel>
        {children}
      </ShipModel>
    </Suspense>
  )
}