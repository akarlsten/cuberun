import * as THREE from 'three'

export const PLANE_SIZE = 1000

export const CUBE_AMOUNT = 100

export const INITIAL_GAME_SPEED = 0.6

export const GAME_SPEED_MULTIPLIER = 0.3

export const COLORS = [
  {
    name: 'red',
    hex: '#ff0000',
    three: new THREE.Color(0xff0000)
  },
  {
    name: 'orange',
    hex: '#FFA500',
    three: new THREE.Color(0xFFA500)
  },
  {
    name: 'green',
    hex: '#3cff00',
    three: new THREE.Color(0x3cff00)
  },
  {
    name: 'blue',
    hex: '#0066ff',
    three: new THREE.Color(0x0066ff)
  },
  {
    name: 'purple',
    hex: '#9370D8',
    three: new THREE.Color(0x9370D8)
  },
  {
    name: 'pink',
    hex: '#ff69b4',
    three: new THREE.Color(0xff69b4)
  },
  {
    name: 'white',
    hex: '#ffffff',
    three: new THREE.Color(0xffffff)
  }
]
