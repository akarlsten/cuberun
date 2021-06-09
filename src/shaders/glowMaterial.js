import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const vertexShader = `
uniform vec3 viewVector;
uniform float intensityScale;
varying float intensity;
void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
    vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
    intensity = pow( dot(normalize(viewVector), actual_normal), intensityScale );
}
`

const fragmentShader = `
varying float intensity;
void main() {
  vec3 glow = vec3(1, 30, 0) * 30.0;
    gl_FragColor = vec4( glow, 3.0 );
}
`
export const GlowMaterial = shaderMaterial({ viewVector: { type: 'v3', value: new THREE.Vector3(0, 0, 0) }, intensityScale: { type: 'f', value: 6.0 } }, vertexShader, fragmentShader) // TODO: value should be camera.position