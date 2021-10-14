import React, { useRef, useLayoutEffect, useEffect, Suspense, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, useTexture } from '@react-three/drei'
import { MirroredRepeatWrapping, Vector2, Vector3 } from 'three'

import shipModel from '../models/spaceship.gltf'

import noiseTexture from '../textures/noise.png'
import engineTexture from '../textures/enginetextureflip.png'


import { useStore, mutation } from '../state/useStore'

const v = new Vector3()

function ShipModel(props, { children }) {
  const { nodes, materials } = useGLTF(shipModel, "https://www.gstatic.com/draco/versioned/decoders/1.4.0/")
  // tie ship and camera ref to store to allow getting at them elsewhere
  const ship = useStore((s) => s.ship)
  const camera = useStore((s) => s.camera)

  const pointLight = useRef()

  const innerConeExhaust = useRef()
  const coneExhaust = useRef()
  const outerConeExhaust = useRef()

  const noise = useTexture(noiseTexture)
  const exhaust = useTexture(engineTexture)

  const leftWingTrail = useRef()
  const rightWingTrail = useRef()

  const bodyDetail = useRef()

  const { clock } = useThree()

  const gameStarted = useStore(s => s.gameStarted)
  const gameOver = useStore(s => s.gameOver)

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
  }, [ship, camera])

  // turn off movement related parts when we arent moving
  useLayoutEffect(() => {
    if (!gameStarted || gameOver) {
      innerConeExhaust.current.material.visible = false
      coneExhaust.current.material.visible = false
      outerConeExhaust.current.material.visible = false
      leftWingTrail.current.material.visible = false
      rightWingTrail.current.material.visible = false
      pointLight.current.visible = false
    } else {
      innerConeExhaust.current.material.visible = true
      coneExhaust.current.material.visible = true
      outerConeExhaust.current.material.visible = true
      leftWingTrail.current.material.visible = true
      rightWingTrail.current.material.visible = true
      pointLight.current.visible = true
    }
  }, [gameStarted, gameOver])

  useLayoutEffect(() => {
    noise.wrapS = noise.wrapT = MirroredRepeatWrapping
    noise.repeat.set(1, 1)
    noise.anisotropy = 16

    exhaust.wrapS = exhaust.wrapT = MirroredRepeatWrapping
    exhaust.repeat.set(1, 1)
    exhaust.anisotropy = 16
  }, [noise, exhaust])

  const [innerLathe] = useState(() => {
    const points = [
      new Vector2(0.2, 0.8),
      new Vector2(0.1, 0),
      new Vector2(0.3, 1.5),
      new Vector2(0.4, 1.9),
      new Vector2(0.01, 7)]

    return points
  })

  const [mediumLathe] = useState(() => {
    const points = [
      new Vector2(0.2, 0),
      new Vector2(0.5, 2),
      new Vector2(0.01, 8)]

    return points
  })

  const [lathe] = useState(() => {
    const points = [
      new Vector2(0.01, 0),
      new Vector2(0.3, 0.8),
      new Vector2(0.4, 1.5),
      new Vector2(0.5, 1.9),
      new Vector2(0.01, 9)]

    return points
  })

  const innerConeScaleFactor = useRef(0.7)

  useFrame((state, delta) => {
    const accelDelta = 1 * delta * 2 // 1.5

    const time = clock.getElapsedTime()

    const slowSine = Math.sin(time * 5)
    const medSine = Math.sin(time * 10)
    const fastSine = Math.sin(time * 15)

    const { left, right } = controlsRef.current

    rightWingTrail.current.scale.x = fastSine / 50
    rightWingTrail.current.scale.y = medSine / 50
    leftWingTrail.current.scale.x = fastSine / 50
    leftWingTrail.current.scale.y = medSine / 50

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
    ship.current.rotation.x = -Math.abs(mutation.horizontalVelocity) / 10 // max/min velocity is -0.5/0.5, divide by ten to get our desired max rotation of 0.05

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
        mutation.horizontalVelocity = Math.max(-0.7 /* -0.5 */, mutation.horizontalVelocity - accelDelta)

        // wing trail
        rightWingTrail.current.scale.x = fastSine / 30
        rightWingTrail.current.scale.y = slowSine / 30
        leftWingTrail.current.scale.x = fastSine / 200
        leftWingTrail.current.scale.y = slowSine / 200
      }

      if ((!left && right)) {
        mutation.horizontalVelocity = Math.min(0.7 /* 0.7 */, mutation.horizontalVelocity + accelDelta)

        // wing trail
        leftWingTrail.current.scale.x = fastSine / 30
        leftWingTrail.current.scale.y = slowSine / 30
        rightWingTrail.current.scale.x = fastSine / 200
        rightWingTrail.current.scale.y = slowSine / 200
      }
    }

    pointLight.current.intensity = 20 - (fastSine / 15)

    outerConeExhaust.current.material.map.offset.y += 0.01 * (0.4 + mutation.gameSpeed) * delta * 165
    coneExhaust.current.material.map.offset.y -= 0.01 * (0.4 + mutation.gameSpeed) * delta * 165

    if (mutation.desiredSpeed > mutation.gameSpeed) {
      pointLight.current.intensity = 30 - (fastSine / 15)

      if (innerConeScaleFactor.current < 0.95) {
        if (innerConeScaleFactor.current + 0.005 * delta * 165 > 0.95) {
          innerConeScaleFactor.current = 0.95
        } else {
          innerConeScaleFactor.current += 0.005 * delta * 165
        }
      }
    } else {
      if (innerConeScaleFactor.current > 0.7) {
        if (innerConeScaleFactor.current - 0.005 * delta * 165 < 0.7) {
          innerConeScaleFactor.current = 0.7
        } else {
          innerConeScaleFactor.current -= 0.005 * delta * 165
        }
      }
    }


    const scaleFactor = mutation.currentMusicLevel > 0.8 ? mutation.currentMusicLevel + 0.2 : 1

    innerConeExhaust.current.scale.z = (fastSine / 15)
    innerConeExhaust.current.scale.x = (innerConeScaleFactor.current + fastSine / 15) * scaleFactor
    coneExhaust.current.scale.z = (fastSine / 15)
    coneExhaust.current.scale.x = (0.85 + fastSine / 15) * scaleFactor
    outerConeExhaust.current.scale.z = (0.9 + fastSine / 15)
    outerConeExhaust.current.scale.x = (0.9 + fastSine / 15) * scaleFactor

    bodyDetail.current.material.color = mutation.globalColor
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
        <mesh ref={bodyDetail} geometry={nodes.Ship_Body_4.geometry}>
          <meshLambertMaterial attach="material" color="white" />
        </mesh>
        <mesh ref={leftWingTrail} scale={[0.1, 0.05, 2]} position={[1.4, 0.2, -7]}>
          <dodecahedronBufferGeometry args={[1.5, 3]} />
          <meshBasicMaterial transparent opacity={0.8} color="white" />
        </mesh>
        <mesh ref={rightWingTrail} scale={[0.1, 0.05, 2]} position={[-1.4, 0.2, -7]}>
          <dodecahedronBufferGeometry args={[1.5, 3]} />
          <meshBasicMaterial transparent opacity={0.8} color="white" />
        </mesh>
        <mesh visible={true} ref={innerConeExhaust} position={[0, -0.3, 0.3]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <latheBufferGeometry args={[innerLathe, 20]} />
          <meshLambertMaterial transparent opacity={1} color="white" />
        </mesh>
        <mesh visible={true} ref={coneExhaust} position={[0, -0.3, 0.25]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <latheBufferGeometry args={[mediumLathe, 30]} />
          <meshLambertMaterial transparent opacity={0.8} map={noise} color={0xAAAAAA} emissive="red" emissiveIntensity={1} />
        </mesh>
        <mesh visible={true} ref={outerConeExhaust} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <latheBufferGeometry args={[lathe, 50]} />
          <meshLambertMaterial transparent alphaMap={exhaust} map={exhaust} color="hotpink" />
        </mesh>
      </group>
    </>
  )
}


useGLTF.preload(shipModel, "https://www.gstatic.com/draco/versioned/decoders/1.4.0/")

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