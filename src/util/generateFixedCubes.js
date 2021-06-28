import { PLANE_SIZE, CUBE_SIZE, WALL_RADIUS } from '../constants/index'

const segments = (PLANE_SIZE - WALL_RADIUS / 2) / CUBE_SIZE
const negativeBound = -(PLANE_SIZE / 2) + WALL_RADIUS / 2

export function makeWall(hasGap = true, gapSize = 3) {
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
      z: -(((segments / 2 - 2) * CUBE_SIZE) + (index * CUBE_SIZE * 0.7))
    }
  })

  return tunnelCoordinates
}

function makeDiamond(size = 21, tunnelLength = 10) {
  const wallEndOffset = -((segments / 2 - 2) * CUBE_SIZE)
  const tunnelEndOffset = tunnelLength * CUBE_SIZE * 0.7

  const outerLeftWall = [...Array(size)].map((cube, index) => {
    return {
      x: index <= size / 2 ? -CUBE_SIZE * 3 - index * CUBE_SIZE : (-CUBE_SIZE * 3 - size * CUBE_SIZE) + index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - index * CUBE_SIZE * 1.75
    }
  })

  const outerRightWall = [...Array(size)].map((cube, index) => {
    return {
      x: index <= size / 2 ? CUBE_SIZE * 3 + index * CUBE_SIZE : (CUBE_SIZE * 3 + size * CUBE_SIZE) - index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - index * CUBE_SIZE * 1.75
    }
  })

  const innerSize = Math.floor(size / 2) - 2 // TODO: maybe remove -2

  const innerLeftWall = [...Array(innerSize)].map((cube, index) => {
    return {
      x: index < innerSize / 2 ? (-CUBE_SIZE / 2) - index * CUBE_SIZE : (-CUBE_SIZE / 2) - (innerSize * CUBE_SIZE) + index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - (Math.floor(size / 1.5) * CUBE_SIZE) - index * CUBE_SIZE * 1.75
    }
  })

  const innerRightWall = [...Array(innerSize)].map((cube, index) => {
    return {
      x: index < innerSize / 2 ? (CUBE_SIZE / 2) + index * CUBE_SIZE : (CUBE_SIZE / 2) + (innerSize * CUBE_SIZE) - index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - (Math.floor(size / 1.5) * CUBE_SIZE) - index * CUBE_SIZE * 1.75
    }
  })

  const firstDiamond = [...outerLeftWall, ...outerRightWall, ...innerLeftWall, ...innerRightWall]
  const secondDiamond = firstDiamond.map(coordinates => ({ ...coordinates, z: coordinates.z - (size * CUBE_SIZE * 1.75) }))

  return [...firstDiamond, ...secondDiamond]
}

export function generateDiamond() {
  const initialWall = makeWall()
  const tunnel = makeTunnel()
  const diamond = makeDiamond()

  return [...initialWall, ...tunnel, ...diamond]
}

export function generateCubeTunnel() {
  const initialWall = makeWall()
  const tunnel = makeTunnel()

  return [...initialWall, ...tunnel]
}