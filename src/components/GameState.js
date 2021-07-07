import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

import { useStore, mutation } from '../state/useStore'
import { INITIAL_GAME_SPEED, PLANE_SIZE, LEVEL_SIZE } from '../constants'

// this is supposedly a performance improvement
const shipSelector = s => s.ship
const setScoreSelector = s => s.setScore
const gameStartedSelector = s => s.gameStarted
const setGameOverSelector = s => s.setGameOver

export default function GameState() {
  const ship = useStore(shipSelector)
  const setScore = useStore(setScoreSelector)
  const gameStarted = useStore(gameStartedSelector)
  const setGameOver = useStore(setGameOverSelector)

  const level = useStore(s => s.level)

  useEffect(() => {
    mutation.currentLevelLength = -(level * PLANE_SIZE * LEVEL_SIZE)
  }, [level])

  useEffect(() => {
    if (gameStarted) {
      mutation.desiredSpeed = INITIAL_GAME_SPEED
    }
  }, [gameStarted])



  useFrame((state, delta) => {

    // acceleration logic
    const accelDelta = 1 * delta * 0.25
    if (!mutation.gameOver) {
      if (mutation.gameSpeed < mutation.desiredSpeed) {
        mutation.isSpeedingUp = true
        if (mutation.gameSpeed + accelDelta > mutation.desiredSpeed) {
          mutation.gameSpeed = mutation.desiredSpeed
        } else {
          mutation.gameSpeed += accelDelta
        }
      } else {
        mutation.isSpeedingUp = false
      }
    }

    if (ship.current) {
      // sets the score counter in the hud
      mutation.score = Math.abs(ship.current.position.z) - 10

      // optimization, instead of calculating this for all elements we do it once per frame here
      mutation.shouldShiftItems = ship.current.position.z < -400 && ship.current.position.z < mutation.currentLevelLength - 400 && ship.current.position.z > mutation.currentLevelLength - 1000
    }

    if (gameStarted && mutation.gameOver) {
      setScore(Math.abs(ship.current.position.z) - 10)
      setGameOver(true)
    }
  })

  return null
}