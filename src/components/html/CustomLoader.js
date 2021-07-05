import * as React from 'react'

const defaultDataInterpolation = (p) => `Loading: ${p.toFixed(0)}%`

export default function CustomLoader({ active, progress, dataInterpolation = defaultDataInterpolation }) {
  const progressRef = React.useRef(0)
  const rafRef = React.useRef(0)
  const progressSpanRef = React.useRef(null)

  const updateProgress = React.useCallback(() => {
    if (!progressSpanRef.current) return
    progressRef.current += (progress - progressRef.current) / 2
    if (progressRef.current > 0.95 * progress || progress === 100) progressRef.current = progress
    progressSpanRef.current.innerText = dataInterpolation(progressRef.current)
    if (progressRef.current < progress) rafRef.current = requestAnimationFrame(updateProgress)
  }, [dataInterpolation, progress])

  React.useEffect(() => {
    updateProgress()
    return () => cancelAnimationFrame(rafRef.current)
  }, [updateProgress])

  return (
    <div style={{ ...styles.container, opacity: active ? 1 : 0 }}>
      <div>
        <div style={{ ...styles.inner }}>
          <div style={{ ...styles.bar, transform: `scaleX(${progress / 100})` }}></div>
          <div style={{ marginTop: '1.5rem' }}>
            <span ref={progressSpanRef} style={{ ...styles.data }} />
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 300ms ease',
    zIndex: 1000,
  },
  inner: {
    width: 206,
    height: 26,
    textAlign: 'center',
    borderRadius: '5px',
    boxShadow: '0 0 20px 0px #fe2079',
    border: '3px solid #fe2079'
  },
  bar: {
    height: 20,
    width: '100%',
    background: '#fe2079',
    transition: 'transform 200ms',
    transformOrigin: 'left center',
    boxShadow: '0 0 20px 0px #fe2079'
  },
  data: {
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
    marginTop: '2rem',
    color: '#f0f0f0',
    fontSize: '2em',
    fontFamily: `'Commando', mono, monospace, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Helvetica Neue", Helvetica, Arial, Roboto, Ubuntu, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    whiteSpace: 'nowrap',
    textShadow: '0 0 20px #fe2079'
  },
}
