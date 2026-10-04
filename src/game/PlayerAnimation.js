// Player animation timing and frame selection. Knows nothing about movement:
// it is told the current state and direction, and picks which frame to show.

import { PLAYER_FRAMES, WALK_FRAMES_PER_SECOND } from '../data/playerSprites.js'

export function createPlayerAnimation() {
  let state = 'idle'
  let direction = 'down'
  let time = 0

  // Reused every frame to avoid allocating an object per render.
  const result = { rect: null, flip: false }

  return {
    update(dt, nextState, nextDirection) {
      if (nextState !== state || nextDirection !== direction) time = 0
      state = nextState
      direction = nextDirection
      time += dt
    },

    // Returns { rect, flip } for the frame to draw right now.
    frame() {
      // Left reuses the right-facing frames, mirrored.
      const flip = direction === 'left'
      const sourceDirection = flip ? 'right' : direction
      const frames = PLAYER_FRAMES[state][sourceDirection]
      const index =
        state === 'walk' ? Math.floor(time * WALK_FRAMES_PER_SECOND) % frames.length : 0

      result.rect = frames[index]
      result.flip = flip
      return result
    },
  }
}
