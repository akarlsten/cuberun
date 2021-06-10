import { Suspense, useRef } from 'react'
import { useThree, extend, useFrame } from '@react-three/fiber'
import { shaderMaterial, useTexture, Stars } from '@react-three/drei'
import * as THREE from 'three'



const SkyboxMaterial = shaderMaterial({
  tex: new THREE.Texture()
},
  `
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 posi = vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * posi;
}`, `
uniform sampler2D text;
varying vec2 vUv;

void main() {
  vec4 text = texture2D(text, vUv);
  gl_FragColor = vec4(text.xyz, text.w);
}
`)

extend({ SkyboxMaterial })

function Sky() {
  const texture = useTexture('wallup-140739.jpg')
  const sky = useRef()
  const stars = useRef()

  useFrame((state, delta) => {
    sky.current.rotation.z += delta / 50
    stars.current.rotation.z += delta / 50
    sky.current.rotation.y -= delta / 50
    sky.current.rotation.y += delta / 50
  })


  return (
    <>
      <Stars ref={stars} radius={400} depth={50} count={20000} factor={20} saturation={1} fade />
      <mesh ref={sky} scale={[-1, 1, 1]} position={[0, 10, -50]} rotation={[0, 0, 10]}>
        <pointLight position={[0, 5000, 0]} intensity={0.9} />
        <pointLight position={[0, -5000, 0]} intensity={0.9} />
        <sphereGeometry attach="geometry" args={[1000, 10, 10]} />
        <meshPhongMaterial fog={false} side={THREE.BackSide} attach="material" map={texture} />
        {/* <skyboxMaterial attach="material" texture={texture} /> */}
      </mesh>
    </>
  )
}

export default function Skybox() {

  return (
    <Suspense fallback={null}>
      <Sky />
    </Suspense>
  )
}