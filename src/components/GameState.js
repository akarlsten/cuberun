import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

import { useStore, mutation } from '../state/useStore'
import { INITIAL_GAME_SPEED } from '../constants'

// this is supposedly a performance improvement
const shipSelector = s => s.ship
const scoreSelector = s => s.score
const setScoreSelector = s => s.setScore
const setCurrentSpeedSelector = s => s.setCurrentSpeed
const gameStartedSelector = s => s.gameStarted
const setIsSpeedingUpSelector = s => s.setIsSpeedingUp
const setGameOverSelector = s => s.setGameOver

export default function GameState() {
  const ship = useStore(shipSelector)
  const score = useStore(scoreSelector)
  const setScore = useStore(setScoreSelector)
  const setCurrentSpeed = useStore(setCurrentSpeedSelector)
  const gameStarted = useStore(gameStartedSelector)
  const setIsSpeedingUp = useStore(setIsSpeedingUpSelector)
  const setGameOver = useStore(setGameOverSelector)

  useEffect(() => {
    if (gameStarted) {
      mutation.desiredSpeed = INITIAL_GAME_SPEED
    }
  }, [gameStarted])

  useFrame((state, delta) => {
    const accelDelta = 1 * delta * 0.25

    if (!mutation.gameOver) {
      if (mutation.gameSpeed < mutation.desiredSpeed) {
        setIsSpeedingUp(true)
        if (mutation.gameSpeed + accelDelta > mutation.desiredSpeed) {
          mutation.gameSpeed = mutation.desiredSpeed
        } else {
          mutation.gameSpeed += accelDelta
        }

        setCurrentSpeed(mutation.gameSpeed)
      } else {
        setIsSpeedingUp(false)
      }
    }

    if (ship.current) {
      if (Math.abs(ship.current.position.z) - score > 13) {
        setScore(Math.abs(ship.current.position.z) - 10)
      }
    }

    if (gameStarted && mutation.gameOver) {
      setGameOver(true)
    }
  })

  return null
}