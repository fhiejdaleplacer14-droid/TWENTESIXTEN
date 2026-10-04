// A placed environment object: one sprite from a sheet, positioned by its base point,
// with an optional solid footprint. Built from a placement in neighborhoodLayout.js.

import { ENVIRONMENT_SPRITES } from '../data/environmentSprites.js'

export function createEnvironmentObject(placement) {
  const sprite = ENVIRONMENT_SPRITES[placement.sprite]
  if (!sprite) throw new Error(`Unknown environment sprite: ${placement.sprite}`)

  const scale = placement.scale ?? 1
  const width = sprite.w * scale
  const height = sprite.h * scale

  // Solid box sits on the base point, so the object's base is what blocks movement.
  const solid = placement.solid
    ? {
        x: placement.x - placement.solid.w / 2,
        y: placement.y - placement.solid.h,
        w: placement.solid.w,
        h: placement.solid.h,
      }
    : null

  // Optional interaction, same shape as an NPC so the interaction system can treat both alike.
  const interact = placement.interact ?? null

  return {
    kind: 'object',
    // Base point. y is used for depth sorting against the player.
    x: placement.x,
    y: placement.y,
    layer: placement.layer ?? 'object',
    solid,

    id: interact?.id ?? null,
    name: interact?.name ?? null,
    dialogueId: interact?.dialogueId ?? null,
    interactionRange: interact?.interactionRange ?? 56,
    focus: interact?.focus ?? false,
    isInteractable: interact !== null,
    isTarget: false,

    // Story gating only affects whether this object can be interacted with.
    // Its drawing and collision never change, so a house stays solid after its letter is gone.
    requires: interact?.requires ?? [],
    hideWhen: interact?.hideWhen ?? [],
    interactActive: true,

    render(ctx, assets) {
      if (this.isTarget) {
        ctx.strokeStyle = '#ffd166'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, 20, 8, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      const image = assets.sheets[sprite.sheet]
      if (!image) return
      ctx.drawImage(
        image,
        sprite.x,
        sprite.y,
        sprite.w,
        sprite.h,
        this.x - width / 2,
        this.y - height,
        width,
        height,
      )
    },
  }
}
