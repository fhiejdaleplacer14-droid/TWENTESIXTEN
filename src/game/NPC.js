// NPC: a stationary character built from a definition in data/npcs.js.
// Drawn with simple placeholder shapes until real NPC sprites exist.
// x/y is the feet position, the same convention as the player and environment objects.

const BODY_WIDTH = 28 // collision box, matches the player's feet box
const BODY_HEIGHT = 14
const BOB_HEIGHT = 0.8 // idle breathing motion, in pixels
const BOB_SPEED = 2.2

// Where the facing dot sits on the head, relative to the head centre.
const FACING_DOT = {
  down: [0, 3],
  left: [-4, 1],
  right: [4, 1],
  up: null, // back of the head: nothing to show
}

export function createNpc(definition) {
  const { x, y } = definition
  const solid = definition.solid
    ? { x: x - BODY_WIDTH / 2, y: y - BODY_HEIGHT, w: BODY_WIDTH, h: BODY_HEIGHT }
    : null

  return {
    kind: 'npc',
    id: definition.id,
    name: definition.name,
    x,
    y,
    direction: definition.direction ?? 'down',
    interactionRange: definition.interactionRange ?? 56,
    appearance: definition.appearance,
    dialogueId: definition.dialogueId ?? null,
    metadata: definition.metadata ?? {},
    solid,
    isTarget: false, // set by the interaction system when this NPC is the one in range
    time: 0,
    focus: definition.focus ?? false,
    // Story gating: an NPC is hidden, not solid and not interactable until its gate opens.
    requires: definition.requires ?? [],
    hideWhen: definition.hideWhen ?? [],
    active: true,

    update(dt) {
      this.time += dt
    },

    render(ctx) {
      if (!this.active) return
      const bob = Math.sin(this.time * BOB_SPEED) * BOB_HEIGHT
      const { appearance } = this

      // Highlight ring under the NPC the player can interact with.
      if (this.isTarget) {
        ctx.strokeStyle = '#ffd166'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, 20, 8, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
      ctx.beginPath()
      ctx.ellipse(this.x, this.y, 10, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = appearance.pants
      ctx.fillRect(this.x - 7, this.y - 6, 14, 6)

      ctx.fillStyle = appearance.shirt
      ctx.fillRect(this.x - 8, this.y - 24 + bob, 16, 18)

      ctx.fillStyle = appearance.skin
      ctx.beginPath()
      ctx.arc(this.x, this.y - 30 + bob, 7, 0, Math.PI * 2)
      ctx.fill()

      // Hair: top half of a circle over the head.
      ctx.fillStyle = appearance.hair
      ctx.beginPath()
      ctx.arc(this.x, this.y - 31 + bob, 7.5, Math.PI, 0)
      ctx.fill()

      const dot = FACING_DOT[this.direction]
      if (dot) {
        ctx.fillStyle = '#222'
        ctx.beginPath()
        ctx.arc(this.x + dot[0], this.y - 30 + bob + dot[1], 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    },
  }
}
