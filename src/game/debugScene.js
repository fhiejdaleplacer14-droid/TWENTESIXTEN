// TEMPORARY DEBUG SCENE — remove when the real map and player are built.
// Only confirms that the game loop, rendering, resizing and input all work.

const SPEED = 240 // pixels per second
const SIZE = 48

export function createDebugScene() {
  const box = { x: 100, y: 100 }
  let flashTime = 0

  return {
    update(dt, input, viewport) {
      let dx = 0
      let dy = 0
      if (input.isDown('KeyA') || input.isDown('ArrowLeft')) dx -= 1
      if (input.isDown('KeyD') || input.isDown('ArrowRight')) dx += 1
      if (input.isDown('KeyW') || input.isDown('ArrowUp')) dy -= 1
      if (input.isDown('KeyS') || input.isDown('ArrowDown')) dy += 1

      box.x += dx * SPEED * dt
      box.y += dy * SPEED * dt
      box.x = Math.max(0, Math.min(box.x, viewport.width - SIZE))
      box.y = Math.max(0, Math.min(box.y, viewport.height - SIZE))

      if (input.wasPressed('KeyE')) flashTime = 0.3
      flashTime = Math.max(0, flashTime - dt)
    },

    render(ctx, viewport) {
      ctx.fillStyle = '#1d2b1f'
      ctx.fillRect(0, 0, viewport.width, viewport.height)

      ctx.fillStyle = flashTime > 0 ? '#ffd166' : '#e4572e'
      ctx.fillRect(box.x, box.y, SIZE, SIZE)

      ctx.fillStyle = '#f5f1e8'
      ctx.font = '16px system-ui, sans-serif'
      ctx.fillText('Phase 1 foundation: WASD / arrows to move, E to flash', 16, 28)
    },
  }
}
