import { PLANE_SIZE, CUBE_SIZE, WALL_RADIUS, LEFT_BOUND } from '../constants/index'

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

  if (LEFT_BOUND < PLANE_SIZE / 2) {
    const spliceFactor = (PLANE_SIZE / 2 + LEFT_BOUND) / CUBE_SIZE - 1
    wallCoordinates.splice(0, spliceFactor)
    wallCoordinates.splice(-spliceFactor, spliceFactor)
  }

  return wallCoordinates
}

function makeTunnel(tunnelLength = 10, gapSize = 3) {

  // const tunnelCoordinates = [...Array(tunnelLength * 2)].map((cube, index) => {
  //   return {
  //     x: index % 2 === 0 ? CUBE_SIZE * 2 : -CUBE_SIZE * 2,
  //     y: CUBE_SIZE / 2,
  //     z: -(((segments / 2 - 2) * CUBE_SIZE) + (index * CUBE_SIZE * 0.7))
  //   }
  // })

  const coords = [
    { x: 40, y: 10, z: -450 },
    { x: -40, y: 10, z: -450 },
    { x: 40, y: 10, z: -478 },
    { x: -40, y: 10, z: -478 },
    { x: 40, y: 10, z: -506 },
    { x: -40, y: 10, z: -506 },
    { x: 40, y: 10, z: -534 },
    { x: -40, y: 10, z: -534 },
    { x: 40, y: 10, z: -562 },
    { x: -40, y: 10, z: -562 },
    { x: 40, y: 10, z: -590 },
    { x: -40, y: 10, z: -590 },
    { x: 40, y: 10, z: -618 },
    { x: -40, y: 10, z: -618 },
    { x: 40, y: 10, z: -646 },
    { x: -40, y: 10, z: -646 },
    { x: 40, y: 10, z: -674 },
    { x: -40, y: 10, z: -674 },
    { x: 40, y: 10, z: -702 },
    { x: -40, y: 10, z: -702 }]

  return coords
}

function makeDiamond(size = 21, tunnelLength = 10) {
  const wallEndOffset = -((segments / 2 - 2) * CUBE_SIZE)
  const tunnelEndOffset = tunnelLength * CUBE_SIZE * 0.7

  const outerLeftWall = [...Array(size)].map((cube, index) => {
    return {
      x: index === 0 ? -70 : index <= size / 2 ? -CUBE_SIZE * 3 - index * CUBE_SIZE : (-CUBE_SIZE * 3 - size * CUBE_SIZE) + index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - index * CUBE_SIZE * 1.75
    }
  })

  const outerRightWall = [...Array(size)].map((cube, index) => {
    return {
      x: index === 0 ? 70 : index <= size / 2 ? CUBE_SIZE * 3 + index * CUBE_SIZE : (CUBE_SIZE * 3 + size * CUBE_SIZE) - index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - index * CUBE_SIZE * 1.75
    }
  })

  const innerSize = Math.floor(size / 2) - 2 // TODO: maybe remove -2

  const innerLeftWall = [...Array(innerSize)].map((cube, index) => {
    return {
      x: index === 1 ? (-CUBE_SIZE / 2) - index * CUBE_SIZE * 1.1 : index < innerSize / 2 ? (-CUBE_SIZE / 2) - index * CUBE_SIZE : (-CUBE_SIZE / 2) - (innerSize * CUBE_SIZE) + index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - (Math.floor(size / 1.5) * CUBE_SIZE) - index * CUBE_SIZE * 1.75
    }
  })

  const innerRightWall = [...Array(innerSize)].map((cube, index) => {
    return {
      x: index === 1 ? (CUBE_SIZE / 2) + index * CUBE_SIZE * 1.1 : index < innerSize / 2 ? (CUBE_SIZE / 2) + index * CUBE_SIZE : (CUBE_SIZE / 2) + (innerSize * CUBE_SIZE) - index * CUBE_SIZE,
      y: CUBE_SIZE / 2,
      z: wallEndOffset - tunnelEndOffset - (Math.floor(size / 1.5) * CUBE_SIZE) - index * CUBE_SIZE * 1.75
    }
  })

  const middlePiece = { x: 0, y: CUBE_SIZE / 2, z: wallEndOffset - tunnelEndOffset - (Math.floor(size / 1.5) * CUBE_SIZE) + CUBE_SIZE }

  const firstDiamond = [...outerLeftWall, ...outerRightWall, middlePiece, ...innerLeftWall, ...innerRightWall]
  const secondDiamond = firstDiamond.map((coordinates, index) => ({ ...coordinates, z: index >= 42 ? coordinates.z - 700 /* 735 */ : coordinates.z - (size * CUBE_SIZE * 1.75) }))

  const finalTunnel = [
    { x: 60, y: 10, z: -2045 },
    { x: -60, y: 10, z: -2045 },
    { x: 40, y: 10, z: -2065 },
    { x: -40, y: 10, z: -2065 },
    { x: 40, y: 10, z: -2085 },
    { x: -40, y: 10, z: -2085 },
    { x: 40, y: 10, z: -2105 },
    { x: -40, y: 10, z: -2105 },
    { x: 40, y: 10, z: -2125 },
    { x: -40, y: 10, z: -2125 },
    { x: 40, y: 10, z: -2145 },
    { x: -40, y: 10, z: -2145 },
    { x: 40, y: 10, z: -2165 },
    { x: -40, y: 10, z: -2165 },
    { x: 40, y: 10, z: -2185 },
    { x: -40, y: 10, z: -2185 },
    { x: 40, y: 10, z: -2205 },
    { x: -40, y: 10, z: -2205 },
    { x: 40, y: 10, z: -2225 },
    { x: -40, y: 10, z: -2225 },
    { x: 40, y: 10, z: -2245 },
    { x: -40, y: 10, z: -2245 },
    { x: 40, y: 10, z: -2265 },
    { x: -40, y: 10, z: -2265 },
  ]

  return [...firstDiamond, ...secondDiamond, ...finalTunnel]
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