import * as THREE from 'three'
import { useRef, useMemo, forwardRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import { mutation } from '../state/useStore'

const EngineSparks = forwardRef((_, mesh) => {
  const { clock } = useThree()

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const sparks = useMemo(() => {
    // Setup initial cube positions
    const temp = []
    for (let i = 0; i < 50; i++) {
      const speedFactor = Math.random() * (2 - 1.3) + 1.3
      const x = (Math.random() * 2 - 1) / 100
      const y = (Math.random() * 2 - 1) / 30
      const z = -34 + Math.random() * 30

      temp.push({ x, y, z, speedFactor })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    sparks.forEach((spark, i) => {
      spark.z -= delta * spark.speedFactor * 10 // * 1 + mutation.gameSpeed

      if (spark.z < -10) {
        spark.z = -2
        spark.x = (Math.random() * 2 - 1) / 100
        spark.y = (Math.random() * 2 - 1) / 30
      }

      dummy.scale.set(0.1, 0.1, 5)

      spark.x += Math.sin(clock.getElapsedTime() * spark.speedFactor * 10) / 100
      spark.y -= Math.sin(clock.getElapsedTime() * spark.speedFactor * 10) / 100

      dummy.position.set(
        spark.x,
        spark.y,
        spark.z
      )

      // apply changes to dummy and to the instanced matrix
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })

    // Tells THREE to draw the updated matrix, I guess?
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, 50]}>
      <sphereBufferGeometry args={[0.2]} />
      <meshBasicMaterial color="tomato" />
    </instancedMesh>
  )
})

export default EngineSparks