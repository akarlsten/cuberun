import { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import { useStore, mutation } from '../state/useStore'

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass, SSAOPass, AfterimagePass })




export default function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()

  const bloomFactor = useRef(0)

  const musicEnabled = useStore(s => s.musicEnabled)

  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame((state, delta) => {
    if (musicEnabled) {
      const bloom = composer.current.passes[1]

      // const bloomFactor = mutation.currentMusicLevel
      // console.log(bloomFactor)

      if (mutation.currentMusicLevel > bloomFactor.current) {
        bloomFactor.current = mutation.currentMusicLevel
      } else {
        bloomFactor.current -= delta * 0.5
      }

      bloom.strength = bloomFactor.current > 0.8 ? bloomFactor.current : 0.8
      // bloom.radius = bloomFactor + 0.2 > 1 ? bloomFactor + 0.2 : 1
    }
    composer.current.render()
  }, 1)


  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[undefined, 0.8 /* strength: 1 */, 1, 0.4 /* 0.4 */]} />
      <shaderPass attachArray="passes" args={[FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
    </effectComposer>
  )
}