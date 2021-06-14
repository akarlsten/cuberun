import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

export const CrossFadeMaterial = shaderMaterial({
  texture1: new THREE.Texture(),
  texture2: new THREE.Texture(),
  mixFactor: 0.0,
  repeats: 1,
  contrast: 1,
  brightness: 0.5
},
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `,
  `
  varying vec2 vUv;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float brightness;
  uniform float contrast;
  uniform float mixFactor;
  uniform float repeats;

  void main() {
    vec2 uv = vUv;
    uv *= repeats;

    vec3 _color = texture2D(texture1, uv).rgb;
    vec3 colorContrasted = (_color) * contrast;
    vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);
    
    vec3 _color2 = texture2D(texture2, uv).rgb;
    vec3 colorContrasted2 = (_color2) * contrast;
    vec3 bright2 = colorContrasted2 + vec3(brightness,brightness,brightness);

    vec4 _texture = vec4(bright, 1.);
    vec4 _texture2 = vec4(bright2, 1.);
    vec4 finalTexture = mix(_texture, _texture2, mixFactor);
    gl_FragColor = finalTexture;
  }
  `
)

extend({ CrossFadeMaterial })