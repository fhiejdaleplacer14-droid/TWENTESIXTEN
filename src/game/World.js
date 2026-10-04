// World: size, the ground layer, ground decals, and the y-sorted object list.
// The ground is drawn in world coordinates, so the caller must apply the camera first.

import { NEIGHBORHOOD_LAYOUT } from '../data/neighborhoodLayout.js'
import { GROUND, WORLD } from '../data/temporaryMap.js'
import { createEnvironmentObject } from './EnvironmentObject.js'

export function createWorld() {
  const placed = NEIGHBORHOOD_LAYOUT.placements.map(createEnvironmentObject)

  // Flat decals (e.g. court surface) are drawn under everything else.
  const groundDecals = placed.filter((object) => object.layer === 'ground')

  // Everything else is sorted once by base y. The player is slotted in during render.
  const objects = placed
    .filter((object) => object.layer !== 'ground')
    .sort((a, b) => a.y - b.y)

  const solids = placed.filter((object) => object.solid).map((object) => object.solid)

  // Zones the player can reach. insideZones tracks which ones the feet are in,
  // so entering a zone reports once rather than every frame.
  const zones = NEIGHBORHOOD_LAYOUT.zones
  const insideZones = new Set()

  return {
    width: WORLD.width,
    height: WORLD.height,
    objects,
    solids,

    // Returns the ids of zones the player has just entered this step.
    updateZones(player) {
      const entered = []
      for (const zone of zones) {
        const inside =
          player.x >= zone.x && player.x <= zone.x + zone.w && player.y >= zone.y && player.y <= zone.y + zone.h
        if (inside && !insideZones.has(zone.id)) {
          insideZones.add(zone.id)
          entered.push(zone.id)
        } else if (!inside) {
          insideZones.delete(zone.id)
        }
      }
      return entered
    },

    // Tiled ground plus roads, drawing only tiles inside the view.
    drawGround(ctx, camera, viewport) {
      const size = GROUND.tileSize
      ctx.fillStyle = GROUND.base
      ctx.fillRect(0, 0, WORLD.width, WORLD.height)

      ctx.fillStyle = GROUND.alternate
      const firstCol = Math.max(0, Math.floor(camera.x / size))
      const lastCol = Math.min(Math.ceil(WORLD.width / size), Math.ceil((camera.x + viewport.width) / size))
      const firstRow = Math.max(0, Math.floor(camera.y / size))
      const lastRow = Math.min(Math.ceil(WORLD.height / size), Math.ceil((camera.y + viewport.height) / size))

      for (let row = firstRow; row < lastRow; row++) {
        for (let col = firstCol; col < lastCol; col++) {
          if ((row + col) % 2 === 1) {
            ctx.fillRect(col * size, row * size, size, size)
          }
        }
      }

      for (const road of NEIGHBORHOOD_LAYOUT.roads) {
        ctx.fillStyle = road.color
        ctx.fillRect(road.x, road.y, road.w, road.h)
      }
    },

    drawGroundDecals(ctx, assets) {
      for (const decal of groundDecals) {
        decal.render(ctx, assets)
      }
    },

    // Adds renderable objects (e.g. NPCs) to the y-sorted list.
    addObjects(newObjects) {
      objects.push(...newObjects)
      objects.sort((a, b) => a.y - b.y)
    },

    // Replaces the collision list. Used when story gating changes which solids are present.
    replaceSolids(newSolids) {
      solids.length = 0
      solids.push(...newSolids)
    },
  }
}
