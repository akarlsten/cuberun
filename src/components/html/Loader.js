import { Loader } from '@react-three/drei'

export default function CustomLoader() {
  const loaderProps = {
    dataInterpolation: (p) => `Loading: ${p.toFixed(0)}%`,
    containerStyles: styles.container,
    innerStyles: styles.inner,
    dataStyles: styles.data,
    barStyles: styles.bar
  }

  return <Loader {...loaderProps} />
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#171717',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 300ms ease',
    zIndex: 1000,
  },
  inner: {
    width: 200,
    height: 20,
    background: 'white',
    textAlign: 'center',
  },
  bar: {
    height: 20,
    width: '100%',
    background: 'hotpink',
    transition: 'transform 200ms',
    transformOrigin: 'left center',
  },
  data: {
    textAlign: 'center',
    position: 'relative',
    fontVariantNumeric: 'tabular-nums',
    marginTop: '0.8em',
    color: '#f0f0f0',
    fontSize: '2em',
    fontFamily: `Inconsolata, mono, monospace, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Helvetica Neue", Helvetica, Arial, Roboto, Ubuntu, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    whiteSpace: 'nowrap',
  },
}