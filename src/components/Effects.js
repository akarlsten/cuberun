import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { BokehShader } from 'three/examples/jsm/shaders/BokehShader'

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass, SSAOPass })

export default function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[size.width, 1, 1, 0.4]} />
      <shaderPass attachArray="passes" args={[FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
    </effectComposer>
  )
}