import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

import Loader from './CustomLoader'
import Author from './Author'

import '../../styles/gameMenu.css'

import { useStore } from '../../state/useStore'

const Overlay = () => {
  const [shown, setShown] = useState(true)
  const [opaque, setOpaque] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const { active, progress } = useProgress()

  const gameStarted = useStore(s => s.gameStarted)
  const gameOver = useStore(s => s.gameOver)
  const setGameStarted = useStore(s => s.setGameStarted)
  const musicEnabled = useStore(s => s.musicEnabled)
  const enableMusic = useStore(s => s.enableMusic)
  const setHasInteracted = useStore(s => s.setHasInteracted)

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

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled))
  }, [musicEnabled])

  useEffect(() => {
    if (progress >= 100) {
      setHasLoaded(true)
    }
  }, [progress])

  const handleStart = () => {
    setGameStarted(true)
  }

  const handleMusic = () => {
    enableMusic(!musicEnabled)
  }

  return shown ? (
    <div onClick={() => setHasInteracted()} className={`game__container`} style={{ opacity: shown ? 1 : 0, background: opaque ? '#141622FF' : '#141622CC' }}>
      <div className="game__menu">
        <img className="game__logo" src="cuberun-logo.png" alt="Cuberun Logo" />
        <div className="game__subcontainer">
          {active && !hasLoaded ? (
            <Loader active={active} progress={progress} />
          ) : (
            <>
              <button onClick={handleStart} className="game__menu-button">{'STA>RT'}</button>
              <div className="game__menu-options">
                <button onClick={handleMusic} className="game__menu-button game__menu-button-music">{`TURN MUSIC ${musicEnabled ? 'OF>F' : 'O<N'}`}</button>
                <span className="game__menu-controls">
                  <p>Controls</p>
                  ⬅ a / d ➡
                </span>
                <span className="game__menu-warning">Photosensitivity warning - Game contains flashing lights</span>
                <Author />
              </div>
            </>
          )}
        </div>
      </div>
    </div >
  ) : null
}

export default Overlay