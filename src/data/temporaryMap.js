// TEMPORARY MAP SETTINGS — world size, backdrop colour and start point.
// The neighborhood itself is laid out in neighborhoodLayout.js, and the base terrain in terrain.js.

export const WORLD = {
  width: 2400,
  height: 1415,
}

// Shown outside the world, if the view is ever larger than it.
export const GROUND = {
  backdrop: '#1d2b1f',
}

// On the main road, just north of the basketball court.
export const PLAYER_START = { x: 1230, y: 755 }
