import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import { useStore, mutation } from '../state/useStore'
import { PLANE_SIZE, COLORS, LEVEL_SIZE } from '../constants'

export default function Arch() {
  const ship = useStore((s) => s.ship)
  const level = useStore(s => s.level)

  const arches = useRef()

  const arch1 = useRef()
  const arch2 = useRef()
  const arch3 = useRef()
  const arch4 = useRef()
  const arch5 = useRef()
  const arch6 = useRef()

  // latter arches
  const arch7 = useRef()
  const arch8 = useRef()
  const arch9 = useRef()
  const arch10 = useRef()

  const levelColor = (base) => {
    return (base + level) % LEVEL_SIZE
  }

  useFrame((state, delta) => {
    if (ship.current) {
      if (mutation.shouldShiftItems) {
        arches.current.position.z = mutation.currentLevelLength - PLANE_SIZE * (LEVEL_SIZE - 2) - 300
        arch7.current.visible = true
        arch8.current.visible = true
        arch9.current.visible = true
        arch10.current.visible = true
      }
    }


    // TODO: maybe set arches to globalcolor always
    if (mutation.colorLevel === 6) {
      arch1.current.material.color = mutation.globalColor
      arch2.current.material.color = mutation.globalColor
      arch3.current.material.color = mutation.globalColor
      arch4.current.material.color = mutation.globalColor
      arch5.current.material.color = mutation.globalColor
      arch6.current.material.color = mutation.globalColor
      arch7.current.material.color = mutation.globalColor
      arch8.current.material.color = mutation.globalColor
      arch9.current.material.color = mutation.globalColor
      arch10.current.material.color = mutation.globalColor
    } else {
      arch1.current.material.color = COLORS[levelColor(0)].three
      arch2.current.material.color = COLORS[levelColor(1)].three
      arch3.current.material.color = COLORS[levelColor(2)].three
      arch4.current.material.color = COLORS[levelColor(3)].three
      arch5.current.material.color = COLORS[levelColor(4)].three
      arch6.current.material.color = COLORS[levelColor(5)].three

      arch7.current.material.color = COLORS[levelColor(0)].three
      arch8.current.material.color = COLORS[levelColor(0)].three
      arch9.current.material.color = COLORS[levelColor(0)].three
      arch10.current.material.color = COLORS[levelColor(0)].three
    }


    const scaleFactor = mutation.currentMusicLevel

    if (scaleFactor > 0.8 && arches.current.scale.x > 0.95) {
      arches.current.scale.x -= scaleFactor * delta * 1
      arches.current.scale.y -= scaleFactor * delta * 1
    } else if (arches.current.scale.x < 1) {
      arches.current.scale.x += scaleFactor * delta * 0.5
      arches.current.scale.y += scaleFactor * delta * 0.5
    }
  })

  return (
    <group ref={arches}>
      <mesh ref={arch1} position={[0, 0, -150]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[100, 20, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[0].three} />
      </mesh>
      <mesh ref={arch2} position={[0, 0, -200]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[90, 16, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[1].three} />
      </mesh>
      <mesh ref={arch3} position={[0, 0, -250]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[80, 12, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[2].three} />
      </mesh>
      <mesh ref={arch4} position={[0, 0, -300]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[70, 10, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[3].three} />
      </mesh>
      <mesh ref={arch5} position={[0, 0, -350]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[60, 8, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[4].three} />
      </mesh>
      <mesh ref={arch6} position={[0, 0, -400]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[50, 6, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[5].three} />
      </mesh>
      <mesh visible={false} ref={arch7} position={[0, 0, -1980]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[50, 10, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[0].three} />
      </mesh>
      <mesh visible={false} ref={arch8} position={[0, 0, -1920]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[50, 10, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[0].three} />
      </mesh>
      <mesh visible={false} ref={arch9} position={[0, 0, -1880]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[50, 10, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[0].three} />
      </mesh>
      <mesh visible={false} ref={arch10} position={[0, 0, -1820]} rotation={[0, 0, Math.PI]}>
        <torusBufferGeometry args={[50, 10, 3, 30]} />
        <meshBasicMaterial fog={false} attach="material" color={COLORS[0].three} />
      </mesh>
    </group>
  )
}