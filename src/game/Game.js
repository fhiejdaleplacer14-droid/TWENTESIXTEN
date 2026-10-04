// Game engine entry point. Owns the canvas context and the active scene.
// Contains no React code.

import { createDebugScene } from './debugScene.js'

export function createGame(canvas, input) {
  const ctx = canvas.getContext('2d')
  const viewport = { width: 0, height: 0 }
  // Swap this scene out when the real map exists.
  const scene = createDebugScene()

  return {
    resize(cssWidth, cssHeight, pixelRatio) {
      viewport.width = cssWidth
      viewport.height = cssHeight
      canvas.width = Math.round(cssWidth * pixelRatio)
      canvas.height = Math.round(cssHeight * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    },

    update(dt) {
      scene.update(dt, input, viewport)
    },

    render() {
      scene.render(ctx, viewport)
    },
  }
}
