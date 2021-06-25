import { PLANE_SIZE, CUBE_SIZE, WALL_RADIUS } from '../constants/index'

const segments = (PLANE_SIZE - WALL_RADIUS / 2) / CUBE_SIZE
const negativeBound = -(PLANE_SIZE / 2) + WALL_RADIUS / 2

function makeWall(hasGap = true, gapSize = 3) {
  const wallCoordinates = [...Array(segments)].map((cube, index) => {
    return {
      x: negativeBound + index * CUBE_SIZE, // -500, -480, -460, etc
      y: CUBE_SIZE / 2,
      z: index <= segments / 2 ? -(index * CUBE_SIZE) : -(segments * CUBE_SIZE) + index * CUBE_SIZE, // pyramid formation
    }
  })

  if (hasGap) {
    wallCoordinates.splice(segments / 2 - Math.floor(gapSize / 2), gapSize) // TODO: rethink this math when not tired
  }

  return wallCoordinates
}

function makeTunnel(tunnelLength = 10, gapSize = 3) {

  const tunnelCoordinates = [...Array(tunnelLength * 2)].map((cube, index) => {
    return {
      x: index % 2 === 0 ? CUBE_SIZE * 2 : -CUBE_SIZE * 2,
      y: CUBE_SIZE / 2,
      z: -(((segments / 2 - 2) * CUBE_SIZE) + (index * CUBE_SIZE * 0.8))
    }
  })

  return tunnelCoordinates
}

export default function generateCubeTunnel() {
  const initialWall = makeWall()
  const tunnel = makeTunnel()

  return [...initialWall, ...tunnel]
}