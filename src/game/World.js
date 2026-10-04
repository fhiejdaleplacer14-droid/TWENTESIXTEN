// World: size, the ground layer, ground decals, and the y-sorted object list.
// The ground is drawn in world coordinates, so the caller must apply the camera first.

import { NEIGHBORHOOD_LAYOUT } from '../data/neighborhoodLayout.js'
import { WORLD } from '../data/temporaryMap.js'
import { createEnvironmentObject } from './EnvironmentObject.js'
import { createTerrain } from './Terrain.js'

export function createWorld() {
  const terrain = createTerrain()
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

    // Base terrain, then roads on top. `sheet` is the loaded terrain source image.
    drawGround(ctx, sheet) {
      terrain.draw(ctx, sheet, WORLD)

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
