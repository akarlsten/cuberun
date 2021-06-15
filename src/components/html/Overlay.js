import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

import cubeRunLogo from '../../textures/cuberun-logo.png'

import '../../styles/gameMenu.css'

import { useStore, mutation } from '../../state/useStore'

const Overlay = () => {
  const [shown, setShown] = useState(true)
  const { active } = useProgress()

  const gameStarted = useStore(s => s.gameStarted)
  const gameOver = useStore(s => s.gameOver)
  const setGameStarted = useStore(s => s.setGameStarted)
  const music = useStore(s => s.music)
  const toggleMusic = useStore(s => s.toggleMusic)

  useEffect(() => {
    console.log('active', active)
    console.log('started', gameStarted)
    console.log('over', gameOver)

    if (active || gameStarted || gameOver) {
      setShown(false)
    } else if (!gameStarted) {
      setShown(true)
    }
  }, [gameStarted, active])

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleMusic = () => {
    toggleMusic()
  }

  return shown ? (
    <div className="game__container" style={{ opacity: shown ? 1 : 0 }}>
      <div className="game__menu">
        <img className="game__logo" src={cubeRunLogo} alt="Cuberun Logo" />
        <button onClick={handleStart} className="game__menu-button">START</button>
        <button onClick={handleMusic} className="game__menu-button">MUSIC {music ? 'OFF' : 'ON'}</button>
      </div>
    </div>
  ) : null
}

export default Overlay