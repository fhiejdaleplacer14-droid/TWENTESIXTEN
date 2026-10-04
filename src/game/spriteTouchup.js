// Some of the sheet artwork paints shaded interiors — the space under a stilt house,
// open doorways, window openings — as pure black. On the bright grass those read as
// holes punched through the map rather than as shadow.
//
// This lifts those black fills to a dark tone. It is pure pixel maths over an RGBA
// buffer so the game and tools/render-map.mjs can share it and cannot drift apart.
// The files in public/assets/ are only ever read; the lift happens on a copy in memory.
//
// Only solid areas are lifted, never outlines: a pixel counts as fill when every pixel
// within `fillRadius` is also dark, which a one or two pixel outline can never satisfy.
// The outline therefore survives and still frames the lifted area.

const luminance = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

// data: Uint8ClampedArray | Buffer of RGBA, modified in place. Returns the number of
// pixels lifted, which is useful for checking the settings are doing something.
export function liftBlackFills(data, width, height, options) {
  const { maxLuminance, fillRadius, tone, strength } = options
  const size = width * height

  // Pass 1: which opaque pixels are dark enough to be shadow.
  const dark = new Uint8Array(size)
  for (let i = 0; i < size; i++) {
    const p = i * 4
    if (data[p + 3] < 128) continue
    if (luminance(data[p], data[p + 1], data[p + 2]) <= maxLuminance) dark[i] = 1
  }

  // Pass 2: erode, so only the inside of a dark area survives.
  const fill = new Uint8Array(size)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (!dark[i]) continue
      let solid = true
      for (let dy = -fillRadius; dy <= fillRadius && solid; dy++) {
        for (let dx = -fillRadius; dx <= fillRadius && solid; dx++) {
          const nx = x + dx
          const ny = y + dy
          // Off the edge counts as dark: a fill running to the sprite's border is
          // still a fill, not an outline.
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          if (!dark[ny * width + nx]) solid = false
        }
      }
      if (solid) fill[i] = 1
    }
  }

  // Pass 3: lift.
  let lifted = 0
  for (let i = 0; i < size; i++) {
    if (!fill[i]) continue
    const p = i * 4
    data[p] += (tone.r - data[p]) * strength
    data[p + 1] += (tone.g - data[p + 1]) * strength
    data[p + 2] += (tone.b - data[p + 2]) * strength
    lifted++
  }
  return lifted
}
