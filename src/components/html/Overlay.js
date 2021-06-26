import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

import Loader from './CustomLoader'
import Author from './Author'

import cubeRunLogo from '../../textures/cuberun-logo.png'

import '../../styles/gameMenu.css'

import { useStore, mutation } from '../../state/useStore'

const Overlay = () => {
  const [shown, setShown] = useState(true)
  const [opaque, setOpaque] = useState(true)
  const { active, progress } = useProgress()

  const gameStarted = useStore(s => s.gameStarted)
  const gameOver = useStore(s => s.gameOver)
  const setGameStarted = useStore(s => s.setGameStarted)
  const musicEnabled = useStore(s => s.musicEnabled)
  const toggleMusic = useStore(s => s.toggleMusic)

  useEffect(() => {
    if (gameStarted || gameOver) {
      setShown(false)
    } else if (!gameStarted) {
      setShown(true)
    }
  }, [gameStarted, active, gameOver])

  useEffect(() => {
    let t
    if (active !== opaque) t = setTimeout(() => setOpaque(active), 300)
    return () => clearTimeout(t)
  }, [active, opaque])

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleMusic = () => {
    toggleMusic()
  }

  return shown ? (
    <div className={`game__container`} style={{ opacity: shown ? 1 : 0, background: opaque ? '#141622FF' : '#141622CC' }}>
      <div className="game__menu">
        <img className="game__logo" src={cubeRunLogo} alt="Cuberun Logo" />
        <div className="game__subcontainer">
          {active ? (
            <Loader active={active} progress={progress} />
          ) : (
            <>
              <button onClick={handleStart} className="game__menu-button">START</button>
              <button onClick={handleMusic} className="game__menu-button">MUSIC {musicEnabled ? 'OFF' : 'ON'}</button>
              <Author />
            </>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default Overlay