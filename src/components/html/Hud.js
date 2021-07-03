import { useEffect, useState, useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { addEffect } from '@react-three/fiber'

import { useStore, mutation } from '../../state/useStore'

import '../../styles/hud.css'

const getSpeed = () => `${(mutation.gameSpeed * 400).toFixed(0)}`
const getScore = () => `${mutation.score.toFixed(0)}`


export default function Hud() {
  const set = useStore((state) => state.set)
  const score = useStore(s => s.score)
  const speed = useStore(s => s.currentSpeed)
  const level = useStore(s => s.level)

  const gameOver = useStore(s => s.gameOver)
  const gameStarted = useStore(s => s.gameStarted)
  const isSpeedingUp = useStore(s => s.isSpeedingUp)

  const [shown, setShown] = useState(false)

  const [showControls, setShowControls] = useState(false)
  const [left, setLeftPressed] = useState(false)
  const [right, setRightPressed] = useState(false)

  // performance optimization for the rapidly updating speedometer - see https://github.com/pmndrs/racing-game/blob/main/src/ui/Speed/Text.tsx
  const speedRef = useRef()

  let currentSpeed = getSpeed()
  let newSpeed

  useEffect(() => addEffect(() => {
    newSpeed = getSpeed()

    if (speedRef.current) {
      speedRef.current.innerText = newSpeed
      currentSpeed = newSpeed
    }
  }))

  // same here
  const scoreRef = useRef()
  let currentScore = getScore()
  let newScore

  useEffect(() => addEffect(() => {
    currentScore = getScore()
    if (scoreRef.current) {
      scoreRef.current.innerText = currentScore
      currentScore = newScore
    }
  }))

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
      {level > 0 && isSpeedingUp && (
        <div className="center">
          <h3 className="center__speedup">SPEED UP</h3>
        </div>
      )}
      {showControls && (
        <div className="controls">
          <button onTouchStart={() => setLeftPressed(true)} onTouchEnd={() => setLeftPressed(false)} className={`control control__left ${left ? 'control-active' : ''}`}>{'<'}</button>
          <button onTouchStart={() => setRightPressed(true)} onTouchEnd={() => setRightPressed(false)} className={`control control__right ${right ? 'control-active' : ''}`}>{'>'}</button>
        </div>
      )}
      <div className="bottomLeft">
        <div className={`score ${showControls ? 'score__withcontrols' : ''}`}>
          <h3 className="score__title">LEVEL</h3>
          <h1 className="score__number">{level + 1}</h1>
          <h3 className="score__title">KM/H</h3>
          <h1 ref={speedRef} className="score__number">{currentSpeed}</h1>
          <h3 className="score__title">SCORE</h3>
          <h1 ref={scoreRef} className="score__number">{currentScore}</h1>
        </div>
      </div>
    </div>
  ) : null
}