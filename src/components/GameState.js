import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

import { useStore, mutation } from '../state/useStore'
import { INITIAL_GAME_SPEED } from '../constants'

export default function GameState() {
  const ship = useStore(s => s.ship)
  const score = useStore(s => s.score)
  const setScore = useStore(s => s.setScore)
  const setCurrentSpeed = useStore(s => s.setCurrentSpeed)
  const gameStarted = useStore(s => s.gameStarted)
  const setGameStarted = useStore(s => s.setGameStarted)

  const setGameOver = useStore(s => s.setGameOver)

  useEffect(() => {
    if (gameStarted) {
      mutation.desiredSpeed = INITIAL_GAME_SPEED
    }
  }, [gameStarted])

  useFrame((state, delta) => {
    const accelDelta = 1 * delta * 0.25

    if (!mutation.gameOver) {
      if (mutation.gameSpeed < mutation.desiredSpeed) {
        if (mutation.gameSpeed + accelDelta > mutation.desiredSpeed) {
          mutation.gameSpeed = mutation.desiredSpeed
        } else {
          mutation.gameSpeed += accelDelta
        }

        setCurrentSpeed(mutation.gameSpeed)
      }
    }

    if (ship.current) {
      setScore(Math.abs(ship.current.position.z) - 10)
    }

    if (gameStarted && mutation.gameOver) {
      setGameOver(true)
    }
  })

  return null
}