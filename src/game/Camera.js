// Camera: follows a target point, stays inside the world, and smooths its motion.
// Knows nothing about the player; it only receives a point to follow.

const SMOOTHING = 8 // higher = snappier

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function createCamera() {
  const camera = {
    // Top-left corner of the view, in world coordinates.
    x: 0,
    y: 0,
    hasSnapped: false,

    update(dt, targetX, targetY, viewport, world) {
      // Target is the centre of the view. Keep the view inside the world.
      // If the world is smaller than the viewport on an axis, centre it on that axis.
      const maxX = world.width - viewport.width
      const maxY = world.height - viewport.height
      const desiredX = maxX >= 0 ? clamp(targetX - viewport.width / 2, 0, maxX) : maxX / 2
      const desiredY = maxY >= 0 ? clamp(targetY - viewport.height / 2, 0, maxY) : maxY / 2

      if (!camera.hasSnapped) {
        camera.x = desiredX
        camera.y = desiredY
        camera.hasSnapped = true
        return
      }

      // Frame-rate independent exponential smoothing.
      const t = 1 - Math.exp(-SMOOTHING * dt)
      camera.x += (desiredX - camera.x) * t
      camera.y += (desiredY - camera.y) * t
    },

    // Call inside ctx.save()/restore(). Rounding avoids sub-pixel blur on sprites.
    apply(ctx) {
      ctx.translate(-Math.round(camera.x), -Math.round(camera.y))
    },
  }

  return camera
}
