// Player: movement, collision, facing and drawing.
// x/y is the feet position in world coordinates. The collision body is the feet area,
// so the player can stand behind or in front of tall objects.

import { PLAYER_DRAW_SCALE } from '../data/playerSprites.js'
import { moveBody } from './Collision.js'
import { createPlayerAnimation } from './PlayerAnimation.js'

const SPEED = 180 // world pixels per second

// Feet collision box.
const BODY_WIDTH = 28
const BODY_HEIGHT = 14

const KEYS = {
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  up: ['KeyW', 'ArrowUp'],
  down: ['KeyS', 'ArrowDown'],
}

function anyDown(input, codes) {
  return codes.some((code) => input.isDown(code))
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function createPlayer(x, y) {
  const animation = createPlayerAnimation()

  return {
    x,
    y,
    width: BODY_WIDTH,
    height: BODY_HEIGHT,

    // locked: true ignores movement input (used while dialogue is open).
    update(dt, input, world, locked = false) {
      let dx = 0
      let dy = 0
      if (!locked) {
        if (anyDown(input, KEYS.left)) dx -= 1
        if (anyDown(input, KEYS.right)) dx += 1
        if (anyDown(input, KEYS.up)) dy -= 1
        if (anyDown(input, KEYS.down)) dy += 1
      }

      const moving = dx !== 0 || dy !== 0

      if (moving) {
        // Normalise diagonal movement so it is not faster than straight movement.
        const length = Math.hypot(dx, dy)
        moveBody(this, (dx / length) * SPEED * dt, (dy / length) * SPEED * dt, world.solids)
      }

      // Keep the feet box inside the world.
      this.x = clamp(this.x, this.width / 2, world.width - this.width / 2)
      this.y = clamp(this.y, this.height, world.height)

      // Horizontal input takes priority when moving diagonally.
      let direction = 'down'
      if (dx < 0) direction = 'left'
      else if (dx > 0) direction = 'right'
      else if (dy < 0) direction = 'up'

      animation.update(dt, moving ? 'walk' : 'idle', direction)
    },

    render(ctx, assets) {
      const sheet = assets.sheets.player
      if (!sheet) return

      const { rect, flip } = animation.frame()
      const width = rect.w * PLAYER_DRAW_SCALE
      const height = rect.h * PLAYER_DRAW_SCALE

      ctx.save()
      ctx.translate(this.x, this.y)
      if (flip) ctx.scale(-1, 1)
      // Anchor the sprite's bottom centre at the feet position.
      ctx.drawImage(sheet, rect.x, rect.y, rect.w, rect.h, -width / 2, -height, width, height)
      ctx.restore()
    },
  }
}
