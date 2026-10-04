// Dev tool: checks every rectangle in data/environmentSprites.js against the artwork
// actually on the sheet. Not part of the game build.
//
//   node tools/check-sprites.mjs
//
// It reports two things:
//   clipped   opaque pixels of the sprite fall outside its rectangle, so the artwork is
//             cut off (this is how the jeepney lost its wing mirror)
//   black     how much of the sprite is solid black fill, which reads as a hole in the
//             grass unless the touch-up lifts it (see data/spriteTouchup.js)
//
// A few sprites are expected to report as clipped and are listed in EXPECTED below:
// sprites that touch each other on the sheet, and the two halves of the court.

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PROJECT = path.resolve(HERE, '..')
const dataUrl = (file) => pathToFileURL(path.join(PROJECT, 'src', 'data', file)).href

// Sprites whose rectangle is deliberately not the measured bounding box.
const EXPECTED = new Map([
  ['tree.palmCluster', 'touches the banana plant on the sheet; trimmed to the palms'],
  ['tree.banana', 'touches the palms on the sheet; trimmed to the banana plant'],
  ['court.top', 'the upper half of one court image'],
  ['court.bottom', 'the lower half of one court image'],
  ['tricycle.motor', 'overlaps a second tricycle on the sheet; trimmed to the yellow one'],
])

const ALPHA = 12 // below this, a pixel counts as transparent

function decodePng(file) {
  const buf = fs.readFileSync(file)
  const W = buf.readUInt32BE(16)
  const H = buf.readUInt32BE(20)
  let p = 8
  const idat = []
  while (p < buf.length) {
    const len = buf.readUInt32BE(p)
    if (buf.toString('ascii', p + 4, p + 8) === 'IDAT') idat.push(buf.subarray(p + 8, p + 8 + len))
    p += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const stride = W * 4
  const out = Buffer.alloc(H * stride)
  for (let y = 0; y < H; y++) {
    const f = raw[y * (stride + 1)]
    const src = y * (stride + 1) + 1
    const dst = y * stride
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? out[dst + x - 4] : 0
      const b = y > 0 ? out[dst - stride + x] : 0
      const c = x >= 4 && y > 0 ? out[dst - stride + x - 4] : 0
      let v = raw[src + x]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) {
        const pp = a + b - c
        const pa = Math.abs(pp - a)
        const pb = Math.abs(pp - b)
        const pc = Math.abs(pp - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      out[dst + x] = v & 255
    }
  }
  return { width: W, height: H, data: out }
}

// Flood-fills the opaque shape the rectangle sits on, so we see the artwork's real
// extent even where it reaches outside the rectangle.
function blobBounds(img, rect) {
  const { width: W, height: H, data } = img
  const seen = new Uint8Array(W * H)
  const stack = []
  for (let y = rect.y; y < rect.y + rect.h; y++) {
    for (let x = rect.x; x < rect.x + rect.w; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue
      if (data[(y * W + x) * 4 + 3] >= ALPHA && !seen[y * W + x]) {
        seen[y * W + x] = 1
        stack.push(x, y)
      }
    }
  }
  let minX = Infinity
  let minY = Infinity
  let maxX = -1
  let maxY = -1
  while (stack.length) {
    const y = stack.pop()
    const x = stack.pop()
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny * W + nx]) continue
        if (data[(ny * W + nx) * 4 + 3] < ALPHA) continue
        seen[ny * W + nx] = 1
        stack.push(nx, ny)
      }
    }
  }
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

// Share of the sprite that is near-black, and the largest single black area.
function blackness(img, rect) {
  const dark = new Uint8Array(rect.w * rect.h)
  let opaque = 0
  let count = 0
  for (let y = 0; y < rect.h; y++) {
    for (let x = 0; x < rect.w; x++) {
      const i = ((rect.y + y) * img.width + rect.x + x) * 4
      if (img.data[i + 3] < 128) continue
      opaque++
      const lum = 0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2]
      if (lum <= 16) {
        dark[y * rect.w + x] = 1
        count++
      }
    }
  }
  const seen = new Uint8Array(rect.w * rect.h)
  let biggest = 0
  for (let p = 0; p < dark.length; p++) {
    if (!dark[p] || seen[p]) continue
    let n = 0
    const stack = [p]
    seen[p] = 1
    while (stack.length) {
      const q = stack.pop()
      n++
      const qx = q % rect.w
      const qy = (q / rect.w) | 0
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = qx + dx
        const ny = qy + dy
        if (nx < 0 || ny < 0 || nx >= rect.w || ny >= rect.h) continue
        const r = ny * rect.w + nx
        if (dark[r] && !seen[r]) {
          seen[r] = 1
          stack.push(r)
        }
      }
    }
    if (n > biggest) biggest = n
  }
  return { opaque, count, biggest }
}

const { ENVIRONMENT_SPRITES, ENVIRONMENT_SHEET_URLS } = await import(dataUrl('environmentSprites.js'))
const { SPRITE_TOUCHUP } = await import(dataUrl('spriteTouchup.js'))
const sheets = {}
for (const [key, url] of Object.entries(ENVIRONMENT_SHEET_URLS)) {
  sheets[key] = decodePng(path.join(PROJECT, 'public' + url))
}

const clipped = []
const black = []
for (const [name, s] of Object.entries(ENVIRONMENT_SPRITES)) {
  const img = sheets[s.sheet]
  if (s.x < 0 || s.y < 0 || s.x + s.w > img.width || s.y + s.h > img.height) {
    clipped.push({ name, note: `rectangle is outside the ${s.sheet} sheet (${img.width}x${img.height})` })
    continue
  }
  const b = blobBounds(img, s)
  const over = [
    ['left', s.x - b.x],
    ['top', s.y - b.y],
    ['right', b.x + b.w - (s.x + s.w)],
    ['bottom', b.y + b.h - (s.y + s.h)],
  ].filter(([, v]) => v > 0)
  if (over.length && !EXPECTED.has(name)) {
    clipped.push({
      name,
      note: over.map(([k, v]) => `${k} +${v}px`).join(' '),
      fix: `sprite('${s.sheet}', ${b.x}, ${b.y}, ${b.w}, ${b.h})`,
    })
  }
  const k = blackness(img, s)
  if (k.biggest >= 150) black.push({ name, sheet: s.sheet, ...k })
}

console.log(`${Object.keys(ENVIRONMENT_SPRITES).length} sprites across ${Object.keys(sheets).length} sheets\n`)

if (clipped.length) {
  console.log(`${clipped.length} sprite(s) cut off by their rectangle:`)
  for (const c of clipped) {
    console.log(`  ${c.name}  ${c.note}`)
    if (c.fix) console.log(`    use ${c.fix}`)
  }
} else {
  console.log('No sprite is cut off by its rectangle.')
}
for (const [name, why] of EXPECTED) console.log(`  (${name} is not checked: ${why})`)

console.log('\nSolid black in the artwork. "lifted" means the sheet is in SPRITE_TOUCHUP.sheets,')
console.log('so the fill is raised to a dark tone at load time (data/spriteTouchup.js):')
if (!black.length) console.log('  none worth mentioning')
for (const b of black.sort((x, y) => y.biggest - x.biggest)) {
  const state = SPRITE_TOUCHUP.enabled && SPRITE_TOUCHUP.sheets.includes(b.sheet) ? 'lifted  ' : 'as drawn'
  console.log(
    `  ${state}  ${b.name.padEnd(22)} ${((b.count / b.opaque) * 100).toFixed(1)}% of the sprite, largest area ${b.biggest}px`,
  )
}

process.exit(clipped.length ? 1 : 0)
