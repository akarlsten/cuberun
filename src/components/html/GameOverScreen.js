import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

import cubeRunLogo from '../../textures/cuberun-logo.png'

import '../../styles/gameMenu.css'

import { useStore, mutation } from '../../state/useStore'

const GameOverScreen = () => {
  const [shown, setShown] = useState(false)
  const [opaque, setOpaque] = useState(false)

  const gameOver = useStore(s => s.gameOver)
  const score = useStore(s => s.score)
  const setGameStarted = useStore(s => s.setGameStarted)

  useEffect(() => {
    let t
    if (gameOver !== opaque) t = setTimeout(() => setOpaque(gameOver), 1000)
    return () => clearTimeout(t)
  }, [gameOver])

  useEffect(() => {
    if (gameOver) {
      setShown(true)
    } else {
      setShown(false)
    }
  }, [gameOver])

  const handleStart = () => {
    setGameStarted(true)
  }

  return shown ? (
    <div className="game__container" style={{ opacity: shown ? 1 : 0, background: opaque ? '#141622FF' : '#141622CC' }}>
      <div className="game__menu">
        <img className="game__logo-small" width="512px" src={cubeRunLogo} alt="Cuberun Logo" />
        <h1 className="game__score-gameover">GAME OVER</h1>
        <h1 className="game__score-title">SCORE</h1>
        <h1 className="game__score">{score.toFixed(0)}</h1>
        <button onClick={handleStart} className="game__menu-button">RESTART</button>
      </div>
    </div>
  ) : null
}

export default GameOverScreen