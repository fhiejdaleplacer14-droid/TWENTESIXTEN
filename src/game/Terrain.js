// Base terrain: fills the whole world with a repeating ground texture.
// Kept separate from environment objects, so the final map can change the ground without
// touching anything placed on top of it.

import { TERRAIN } from '../data/terrain.js'
import { generateGrassPixels } from './grassTexture.js'

// Grass generated in code (no grass asset exists yet).
function buildGrassPattern(ctx) {
  const { tileSize } = TERRAIN.grass
  const tile = document.createElement('canvas')
  tile.width = tileSize
  tile.height = tileSize
  const t = tile.getContext('2d')
  const image = t.createImageData(tileSize, tileSize)
  image.data.set(generateGrassPixels(tileSize, TERRAIN.grass))
  t.putImageData(image, 0, 0)
  return ctx.createPattern(tile, 'repeat')
}

// Ground cut from a sheet. Tiles are mixed and flipped so the repeat is less obvious,
// and mirroring makes neighbouring edges match.
function buildTilePattern(ctx, sheet) {
  const { tiles, blockTiles } = TERRAIN
  const size = tiles[0].w
  const block = document.createElement('canvas')
  block.width = size * blockTiles
  block.height = size * blockTiles
  const b = block.getContext('2d')
  const noise = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
    return n - Math.floor(n)
  }

  for (let row = 0; row < blockTiles; row++) {
    for (let col = 0; col < blockTiles; col++) {
      const tile = tiles[Math.floor(noise(col, row) * tiles.length) % tiles.length]
      const flipX = noise(col + 7, row) > 0.5
      const flipY = noise(col, row + 13) > 0.5
      b.save()
      b.translate(col * size + (flipX ? size : 0), row * size + (flipY ? size : 0))
      b.scale(flipX ? -1 : 1, flipY ? -1 : 1)
      b.drawImage(sheet, tile.x, tile.y, tile.w, tile.h, 0, 0, size, size)
      b.restore()
    }
  }
  return ctx.createPattern(block, 'repeat')
}

export function createTerrain() {
  let pattern = null

  return {
    // Fills the world rectangle. Call with the camera transform already applied, so the
    // pattern stays anchored to world coordinates.
    draw(ctx, sheet, world) {
      if (!pattern) {
        if (TERRAIN.mode === 'grass') pattern = buildGrassPattern(ctx)
        else if (sheet) pattern = buildTilePattern(ctx, sheet)
      }
      ctx.fillStyle = pattern ?? TERRAIN.fallbackColor
      ctx.fillRect(0, 0, world.width, world.height)
    },
  }
}
