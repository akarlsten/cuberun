import { forwardRef, useMemo, useEffect } from 'react'
import { EffectComposer, Bloom, GodRays, SMAA } from '@react-three/postprocessing'
import { useThree } from '@react-three/fiber'
import { Resizer, KernelSize, BlendFunction, Effect } from 'postprocessing'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { UnrealBloom } from '../shaders/unrealBloom'

import useStore from '../hooks/useStore'







export default function Effects() {
  const sun = useStore((s) => s.sun)
  const { size } = useThree()
  useEffect(() => { }, [sun.current])

  return (
    <EffectComposer multisampling={4}>
      {sun.current && (
        <GodRays
          sun={sun.current}
          blendFunction={BlendFunction.SCREEN} // The blend function of this effect.
          samples={30} // The number of samples per pixel.
          density={0.97} // The density of the light rays.
          decay={0.97} // An illumination decay factor.
          weight={0.2} // A light ray weight factor.
          exposure={0.4} // A constant attenuation coefficient.
          clampMax={1} // An upper bound for the saturation of the overall effect.
          width={Resizer.AUTO_SIZE} // Render width.
          height={Resizer.AUTO_SIZE} // Render height.
          kernelSize={KernelSize.SMALL} // The blur kernel size. Has no effect if blur is disabled.
          blur={true} // Whether the god rays should be blurred to reduce artifacts.
        />
      )}
      <UnrealBloom resolution={size.width} />
      {/* <Bloom
        blendFunction={BlendFunction.ADD}
        intensity={0.3} // The bloom intensity.
        blurPass={undefined} // A blur pass.
        width={Resizer.AUTO_SIZE} // render width
        height={Resizer.AUTO_SIZE} // render height
        kernelSize={KernelSize.LARGE} // blur kernel size
        luminanceThreshold={0.4} // luminance threshold. Raise this value to mask out darker elements in the scene.
        luminanceSmoothing={0.3} // smoothness of the luminance threshold. Range is [0, 1]
      /> */}
    </EffectComposer>
  )
}