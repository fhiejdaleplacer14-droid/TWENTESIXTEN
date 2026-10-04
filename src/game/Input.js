// Keyboard input manager.
// Uses KeyboardEvent.code (physical key position), so WASD, arrows and E
// work the same regardless of keyboard layout.

const PREVENT_DEFAULT_CODES = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Space',
  'Enter', // stops a focused button from being activated while advancing dialogue
])

export function createInput(target = window) {
  const held = new Set()
  const pressedThisFrame = new Set()

  function handleKeyDown(event) {
    if (PREVENT_DEFAULT_CODES.has(event.code)) event.preventDefault()
    if (!event.repeat) pressedThisFrame.add(event.code)
    held.add(event.code)
  }

  function handleKeyUp(event) {
    held.delete(event.code)
  }

  // Releasing focus can swallow the keyup event, so clear held keys on blur.
  function handleBlur() {
    held.clear()
    pressedThisFrame.clear()
  }

  target.addEventListener('keydown', handleKeyDown)
  target.addEventListener('keyup', handleKeyUp)
  target.addEventListener('blur', handleBlur)

  return {
    // True while the key is held down.
    isDown(code) {
      return held.has(code)
    },
    // True only on the frame the key was first pressed.
    wasPressed(code) {
      return pressedThisFrame.has(code)
    },
    // Marks a press as handled, so another update step in the same frame cannot see it.
    consume(code) {
      pressedThisFrame.delete(code)
    },
    // Called once per rendered frame, after updates have run.
    endFrame() {
      pressedThisFrame.clear()
    },
    destroy() {
      target.removeEventListener('keydown', handleKeyDown)
      target.removeEventListener('keyup', handleKeyUp)
      target.removeEventListener('blur', handleBlur)
      held.clear()
      pressedThisFrame.clear()
    },
  }
}
