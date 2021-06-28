import { useEffect, useState, useRef } from 'react'
import { isMobile } from 'react-device-detect'

import { useStore } from '../../state/useStore'

import '../../styles/hud.css'

export default function Hud() {
  const set = useStore((state) => state.set)
  const score = useStore(s => s.score)
  const speed = useStore(s => s.currentSpeed)
  const level = useStore(s => s.level)

  const gameOver = useStore(s => s.gameOver)
  const gameStarted = useStore(s => s.gameStarted)
  const isSpeedingUp = useStore(s => s.isSpeedingUp)

  const [shown, setShown] = useState(false)
  const [showSpeedup, setShowSpeedup] = useState(false)

  const [showControls, setShowControls] = useState(false)
  const [left, setLeftPressed] = useState(false)
  const [right, setRightPressed] = useState(false)

  useEffect(() => {
    if (showControls) {
      window.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  }, [showControls])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setShown(true)
    } else {
      setShown(false)
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (level > 0) {
      if (isSpeedingUp) {
        setShowSpeedup(true)
      } else {
        setShowSpeedup(false)
      }
    }
  }, [isSpeedingUp])

  useEffect(() => {
    if (isMobile) {
      setShowControls(true)
    } else {
      setShowControls(false)
    }
  }, [isMobile])

  useEffect(() => {
    set((state) => ({ ...state, controls: { ...state.controls, left } }))
  }, [left])

  useEffect(() => {
    set((state) => ({ ...state, controls: { ...state.controls, right } }))
  }, [right])

  return shown ? (
    <div className="hud">
      {showSpeedup && (
        <div className="center">
          <h3 className="center__speedup">SPEED UP</h3>
        </div>
      )}
      {showControls && (
        <div className="controls">
          <button onTouchStart={() => setLeftPressed(true)} onTouchEnd={() => setLeftPressed(false)} className={`control control__left ${left ? 'control-active' : ''}`}>🡄</button>
          <button onTouchStart={() => setRightPressed(true)} onTouchEnd={() => setRightPressed(false)} className={`control control__right ${right ? 'control-active' : ''}`}>🡆</button>
        </div>
      )}
      <div className="bottomLeft">
        <div className={`score ${showControls ? 'score__withcontrols' : ''}`}>
          <h3 className="score__title">LEVEL</h3>
          <h1 className="score__number">{level + 1}</h1>
          <h3 className="score__title">KM/H</h3>
          <h1 className="score__number">{(speed * 400).toFixed(0)}</h1>
          <h3 className="score__title">SCORE</h3>
          <h1 className="score__number">{score.toFixed(0)}</h1>
        </div>
      </div>
    </div>
  ) : null
}