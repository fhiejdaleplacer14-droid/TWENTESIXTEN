// Generates a tileable grass texture in code.
//
// TEMPORARY: none of the sheets in public/assets contain a plain grass tile. When a grass
// asset arrives, set TERRAIN.mode to 'tiles' in data/terrain.js and point it at the artwork;
// nothing else needs to change.
//
// Pure pixel maths, so the game and the map preview tool produce exactly the same ground.

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]

// Smooth low-frequency patches, wrapped so the tile repeats cleanly.
function patchField(size, cells, rnd) {
  const grid = []
  for (let i = 0; i < cells * cells; i++) grid.push(rnd() * 2 - 1)
  const at = (cx, cy) => grid[(((cy % cells) + cells) % cells) * cells + (((cx % cells) + cells) % cells)]
  const smooth = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const gx = (x / size) * cells
    const gy = (y / size) * cells
    const x0 = Math.floor(gx)
    const y0 = Math.floor(gy)
    const tx = smooth(gx - x0)
    const ty = smooth(gy - y0)
    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx
    return top * (1 - ty) + bottom * ty
  }
}

// Returns RGBA bytes for a size x size tile that repeats seamlessly.
export function generateGrassPixels(size, { base, shades, bladeCount, seed = 2016 }) {
  const rnd = mulberry32(seed)
  const data = new Uint8ClampedArray(size * size * 4)
  const [br, bg, bb] = hexToRgb(base)
  const patches = patchField(size, 4, rnd)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const patch = patches(x, y) * 9
      const grain = (rnd() - 0.5) * 10
      const shift = patch + grain
      data[i] = br + shift
      data[i + 1] = bg + shift * 1.2
      data[i + 2] = bb + shift * 0.6
      data[i + 3] = 255
    }
  }

  // Short blades. They wrap around the edges, so the tile still repeats cleanly.
  const bladeColors = shades.map(hexToRgb)
  for (let n = 0; n < bladeCount; n++) {
    const x = Math.floor(rnd() * size)
    const y = Math.floor(rnd() * size)
    const height = 2 + Math.floor(rnd() * 3)
    const lean = rnd() < 0.5 ? 0 : rnd() < 0.5 ? -1 : 1
    const [r, g, b] = bladeColors[Math.floor(rnd() * bladeColors.length)]
    for (let j = 0; j < height; j++) {
      const px = (((x + (j === height - 1 ? lean : 0)) % size) + size) % size
      const py = (((y - j) % size) + size) % size
      const i = (py * size + px) * 4
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = 255
    }
  }

  return data
}
