import * as THREE from 'three'

export const PLANE_SIZE = 1000

export const CUBE_AMOUNT = 100

export const STARTING_GAME_SPEED = 0.3

export const COLORS = {
  red: {
    hex: '#ff0000',
    three: new THREE.Color(0xff0000)
  },
  orange: {
    hex: '#FFA500',
    three: new THREE.Color(0xFFA500)
  },
  pink: {
    hex: '#ff69b4',
    three: new THREE.Color(0xff69b4)
  },
  green: {
    hex: '#3cff00',
    three: new THREE.Color(0x3cff00)
  },
  blue: {
    hex: '#0066ff',
    three: new THREE.Color(0x0066ff)
  },
  purple: {
    hex: '#9370D8',
    three: new THREE.Color(0x9370D8)
  }
}