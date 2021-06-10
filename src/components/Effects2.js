import { EffectComposer, Bloom, GodRays, SMAA } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'

import useStore from '../hooks/useStore'

export default function Effects() {

  return (
    <EffectComposer>
      <Bloom />
      <GodRays />
      <SMAA />
    </EffectComposer>
  )
}