import * as THREE from 'three'
import { useRef, useEffect, useState, Suspense } from 'react'
import { useLoader, useFrame, useThree } from '@react-three/fiber'

import { useStore, mutation } from '../state/useStore'

import introSong from '../audio/intro.mp3'
import mainSong from '../audio/main.mp3'

function Music() {
  const sound = useRef()
  const soundOrigin = useRef()


  const musicEnabled = useStore(s => s.musicEnabled)
  const gameStarted = useStore(s => s.gameStarted)
  const gameOver = useStore(s => s.gameOver)
  const camera = useStore(s => s.camera)

  const [listener] = useState(() => new THREE.AudioListener())

  const introTheme = useLoader(THREE.AudioLoader, introSong)
  const mainTheme = useLoader(THREE.AudioLoader, mainSong)

  useEffect(() => {
    if (gameOver) {
      if (sound.current.isPlaying) {
        sound.current.stop()
      }

      sound.current.setBuffer(introTheme)
    }

    if (gameStarted && !gameOver) {
      if (sound.current.isPlaying) {
        sound.current.stop()
      }
      sound.current.setBuffer(mainTheme)
    } else {
      sound.current.setBuffer(introTheme)
      sound.current.setVolume(0)
    }

    if (musicEnabled && !gameOver) {
      if (!sound.current.isPlaying) {
        sound.current.play()
        sound.current.setVolume(0)
      }
    } else {
      sound.current.stop()
    }

    sound.current.setLoop(true)
    camera.current.add(listener)
    return () => camera.current.remove(listener)
  }, [musicEnabled, introTheme, mainTheme, gameStarted, gameOver])

  useFrame((state, delta) => {
    // slowly increase volume
    const currentVolume = sound.current.getVolume()
    if (currentVolume < 1) {
      sound.current.setVolume(currentVolume + delta * 0.5)
    }

    // change playback rate with level
    if (mutation.gameSpeed > 2) { // TODO: Maybe just set it every 2 levels, dont interpolate - also potentially add crash and speedup sounds
      if (sound.current.getPlaybackRate() < 1 + (mutation.gameSpeed * 0.1)) {
        sound.current.setPlaybackRate(1 + (mutation.gameSpeed * 0.05))
      }
    } else {
      sound.current.setPlaybackRate(1)
    }
  })

  return (
    <group ref={soundOrigin}>
      <audio ref={sound} args={[listener]} />
    </group>
  )
}

export default function SuspenseMusic() {

  return (
    <Suspense fallback={null}>
      <Music />
    </Suspense>
  )
}