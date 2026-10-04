// Interaction detection. Finds the nearest interactable within its range and reports
// an edge-triggered press of the interact key. Knows nothing about what an interaction does.

export const INTERACT_KEY = 'KeyE'

export function createInteraction() {
  let target = null

  return {
    // Call once per update step.
    // Returns { changed, target, triggered }:
    //   changed    the target changed since the last call (use to update the prompt)
    //   target     the nearest interactable in range, or null
    //   triggered  the target if the interact key was pressed this step, otherwise null
    update(player, interactables, input) {
      let best = null
      let bestDistSq = Infinity

      for (const entity of interactables) {
        const dx = entity.x - player.x
        const dy = entity.y - player.y
        const distSq = dx * dx + dy * dy
        const range = entity.interactionRange
        if (distSq <= range * range && distSq < bestDistSq) {
          best = entity
          bestDistSq = distSq
        }
      }

      const changed = best !== target
      if (changed) {
        if (target) target.isTarget = false
        if (best) best.isTarget = true
        target = best
      }

      let triggered = null
      if (target && input.wasPressed(INTERACT_KEY)) {
        // Consume the press so a second update step in the same frame cannot trigger it again.
        input.consume(INTERACT_KEY)
        triggered = target
      }

      return { changed, target, triggered }
    },

    // Clears the current target, e.g. when a dialogue starts and the prompt must hide.
    reset() {
      if (target) target.isTarget = false
      target = null
    },
  }
}
