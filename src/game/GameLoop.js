// requestAnimationFrame loop with a fixed-step update and one render per frame.
// Fixed steps keep movement speed independent of the monitor's refresh rate.

const STEP = 1 / 60 // seconds per update
const MAX_FRAME_TIME = 0.25 // clamp so a backgrounded tab does not replay minutes of updates

export function createGameLoop({ update, render, onFrameEnd }) {
  let frameId = 0
  let lastTime = 0
  let accumulator = 0
  let running = false

  function frame(now) {
    if (!running) return

    const elapsed = Math.min((now - lastTime) / 1000, MAX_FRAME_TIME)
    lastTime = now
    accumulator += elapsed

    while (accumulator >= STEP) {
      update(STEP)
      accumulator -= STEP
    }

    render()
    onFrameEnd?.()

    frameId = requestAnimationFrame(frame)
  }

  return {
    start() {
      if (running) return
      running = true
      lastTime = performance.now()
      accumulator = 0
      frameId = requestAnimationFrame(frame)
    },
    stop() {
      running = false
      cancelAnimationFrame(frameId)
    },
  }
}
