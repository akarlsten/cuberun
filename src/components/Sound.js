import { AudioListener, AudioLoader } from 'three'
import { useRef, useEffect, useState, Suspense } from 'react'
import { useLoader } from '@react-three/fiber'

import { useStore } from '../state/useStore'

import speedUp from '../audio/speedup.mp3'

function Sound() {
  const sound = useRef()
  const soundOrigin = useRef()


  const camera = useStore(s => s.camera)
  const musicEnabled = useStore(s => s.musicEnabled)
  const level = useStore(s => s.level)
  const gameStarted = useStore(s => s.gameStarted)

  const [listener] = useState(() => new AudioListener())

  const speedUpSound = useLoader(AudioLoader, speedUp)


  useEffect(() => {
    sound.current.setBuffer(speedUpSound)

    if (musicEnabled) {
      sound.current.setVolume(0.5)
    } else {
      sound.current.setVolume(0)
    }

    if (camera.current) {
      camera.current.add(listener)
      return () => camera.current.remove(listener)
    }
  }, [speedUpSound, musicEnabled, camera, listener])

  useEffect(() => {
    if (gameStarted && level > 0) {
      sound.current.setBuffer(speedUpSound)
      sound.current.play()
    }
  }, [gameStarted, level, speedUpSound])

  return (
    <group ref={soundOrigin}>
      <audio ref={sound} args={[listener]} />
    </group>
  )
}

export default function SuspenseSound() {

  return (
    <Suspense fallback={null}>
      <Sound />
    </Suspense>
  )
}