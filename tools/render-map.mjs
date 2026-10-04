// Dev tool: renders the map (or the sprite catalogue) to a PNG, so the layout can be
// checked without opening a browser. Not part of the game build.
//
//   node tools/render-map.mjs            -> tools/map-preview.png
//   node tools/render-map.mjs 0.75       -> same, at 0.75 scale
//   node tools/render-map.mjs atlas      -> tools/sprite-atlas.png (every sprite, numbered)
//
// It reads the same data files the game uses, so what it draws is what the game places.

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PROJECT = path.resolve(HERE, '..')
const dataUrl = (file) => pathToFileURL(path.join(PROJECT, 'src', 'data', file)).href

// ---------- PNG decode / encode ----------
function decodePng(file) {
  const buf = fs.readFileSync(file)
  const W = buf.readUInt32BE(16)
  const H = buf.readUInt32BE(20)
  let p = 8
  const idat = []
  while (p < buf.length) {
    const len = buf.readUInt32BE(p)
    const type = buf.toString('ascii', p + 4, p + 8)
    if (type === 'IDAT') idat.push(buf.subarray(p + 8, p + 8 + len))
    p += 12 + len
  }
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const bpp = 4
  const stride = W * bpp
  const out = Buffer.alloc(H * stride)
  for (let y = 0; y < H; y++) {
    const f = raw[y * (stride + 1)]
    const src = y * (stride + 1) + 1
    const dst = y * stride
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[dst + x - bpp] : 0
      const b = y > 0 ? out[dst - stride + x] : 0
      const c = x >= bpp && y > 0 ? out[dst - stride + x - bpp] : 0
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

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
const crc32 = (b) => {
  let c = 0xffffffff
  for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function encodePng(img, file) {
  const stride = img.width * 4
  const raw = Buffer.alloc(img.height * (stride + 1))
  for (let y = 0; y < img.height; y++) {
    raw[y * (stride + 1)] = 0
    img.data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(img.width, 0)
  ihdr.writeUInt32BE(img.height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  fs.writeFileSync(
    file,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  )
}

// ---------- tiny canvas ----------
function createCanvas(w, h, fill = [20, 24, 18]) {
  const data = Buffer.alloc(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    data[i * 4] = fill[0]
    data[i * 4 + 1] = fill[1]
    data[i * 4 + 2] = fill[2]
    data[i * 4 + 3] = 255
  }
  return { width: w, height: h, data }
}
function blend(dst, i, r, g, b, a) {
  if (a <= 0) return
  if (a >= 255) {
    dst[i] = r
    dst[i + 1] = g
    dst[i + 2] = b
    dst[i + 3] = 255
    return
  }
  const t = a / 255
  dst[i] = Math.round(dst[i] * (1 - t) + r * t)
  dst[i + 1] = Math.round(dst[i + 1] * (1 - t) + g * t)
  dst[i + 2] = Math.round(dst[i + 2] * (1 - t) + b * t)
  dst[i + 3] = 255
}
function fillRect(cv, x, y, w, h, [r, g, b], alpha = 255) {
  const x0 = Math.max(0, Math.round(x))
  const y0 = Math.max(0, Math.round(y))
  const x1 = Math.min(cv.width, Math.round(x + w))
  const y1 = Math.min(cv.height, Math.round(y + h))
  for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) blend(cv.data, (yy * cv.width + xx) * 4, r, g, b, alpha)
}
// Nearest-neighbour blit of a source rectangle. The clamps are absolute sheet
// coordinates: clamping to the rectangle's size instead samples the wrong pixels.
function drawImage(cv, img, sx, sy, sw, sh, dx, dy, dw, dh) {
  const x0 = Math.max(0, Math.round(dx))
  const y0 = Math.max(0, Math.round(dy))
  const x1 = Math.min(cv.width, Math.round(dx + dw))
  const y1 = Math.min(cv.height, Math.round(dy + dh))
  for (let yy = y0; yy < y1; yy++) {
    const v = (yy + 0.5 - dy) / dh
    const srcY = Math.min(sy + sh - 1, Math.max(sy, Math.floor(sy + v * sh)))
    for (let xx = x0; xx < x1; xx++) {
      const u = (xx + 0.5 - dx) / dw
      const srcX = Math.min(sx + sw - 1, Math.max(sx, Math.floor(sx + u * sw)))
      const si = (srcY * img.width + srcX) * 4
      blend(cv.data, (yy * cv.width + xx) * 4, img.data[si], img.data[si + 1], img.data[si + 2], img.data[si + 3])
    }
  }
}
const DIGITS = {
  0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  2: ['111', '001', '111', '100', '111'], 3: ['111', '001', '111', '001', '111'],
  4: ['101', '101', '111', '001', '001'], 5: ['111', '100', '111', '001', '111'],
  6: ['111', '100', '111', '101', '111'], 7: ['111', '001', '010', '010', '010'],
  8: ['111', '101', '111', '101', '111'], 9: ['111', '101', '111', '001', '111'],
}
function drawNumber(cv, n, x, y, px = 3) {
  String(n).split('').forEach((ch, i) => {
    DIGITS[ch].forEach((row, ry) => {
      row.split('').forEach((bit, rx) => {
        if (bit === '1') fillRect(cv, x + i * 4 * px + rx * px, y + ry * px, px, px, [255, 240, 120])
      })
    })
  })
}

// ---------- game data ----------
const { ENVIRONMENT_SPRITES, ENVIRONMENT_SHEET_URLS } = await import(dataUrl('environmentSprites.js'))
const { SPRITE_TOUCHUP } = await import(dataUrl('spriteTouchup.js'))
const { liftBlackFills } = await import(pathToFileURL(path.join(PROJECT, 'src', 'game', 'spriteTouchup.js')).href)

// Sheets are loaded and touched up exactly as the game does it, using the same
// function, so this preview cannot drift away from what is drawn in the browser.
const sheets = {}
for (const [key, url] of Object.entries(ENVIRONMENT_SHEET_URLS)) {
  const sheet = decodePng(path.join(PROJECT, 'public' + url))
  if (SPRITE_TOUCHUP.enabled && SPRITE_TOUCHUP.sheets.includes(key)) {
    liftBlackFills(sheet.data, sheet.width, sheet.height, SPRITE_TOUCHUP)
  }
  sheets[key] = sheet
}

const mode = process.argv[2] === 'atlas' ? 'atlas' : 'map'

if (mode === 'atlas') {
  const names = Object.keys(ENVIRONMENT_SPRITES)
  const COLS = 7
  const CELL = 150
  const cv = createCanvas(COLS * CELL, Math.ceil(names.length / COLS) * CELL, [30, 30, 36])
  names.forEach((name, i) => {
    const s = ENVIRONMENT_SPRITES[name]
    const cx = (i % COLS) * CELL
    const cy = Math.floor(i / COLS) * CELL
    fillRect(cv, cx + 1, cy + 1, CELL - 2, CELL - 2, [45, 45, 52])
    const fit = Math.min((CELL - 30) / s.w, (CELL - 30) / s.h)
    drawImage(cv, sheets[s.sheet], s.x, s.y, s.w, s.h, cx + (CELL - s.w * fit) / 2, cy + 20 + (CELL - 30 - s.h * fit) / 2, s.w * fit, s.h * fit)
    drawNumber(cv, i, cx + 6, cy + 5)
  })
  encodePng(cv, path.join(HERE, 'sprite-atlas.png'))
  console.log(names.map((n, i) => `${i}:${n}`).join('  '))
  console.log('wrote tools/sprite-atlas.png')
} else {
  const { NEIGHBORHOOD_LAYOUT } = await import(dataUrl('neighborhoodLayout.js'))
  const { WORLD, PLAYER_START } = await import(dataUrl('temporaryMap.js'))
  const { NPC_DEFINITIONS } = await import(dataUrl('npcs.js'))
  const { TERRAIN } = await import(dataUrl('terrain.js'))

  const SCALE = Number(process.argv[2] || 0.5)
  const cv = createCanvas(Math.round(WORLD.width * SCALE), Math.round(WORLD.height * SCALE))
  const S = (v) => v * SCALE
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

  // terrain: same rules as the game
  if (TERRAIN.mode === 'grass') {
    const { generateGrassPixels } = await import(pathToFileURL(path.join(PROJECT, 'src', 'game', 'grassTexture.js')).href)
    const size = TERRAIN.grass.tileSize
    const px = generateGrassPixels(size, TERRAIN.grass)
    const tile = { width: size, height: size, data: Buffer.from(px.buffer, px.byteOffset, px.length) }
    for (let row = 0; row * size < WORLD.height; row++) {
      for (let col = 0; col * size < WORLD.width; col++) {
        drawImage(cv, tile, 0, 0, size, size, S(col * size), S(row * size), S(size), S(size))
      }
    }
  } else {
    const sheet = sheets[TERRAIN.sheet]
    const size = TERRAIN.tiles[0].w
    const noise = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n) }
    for (let row = 0; row * size < WORLD.height; row++) {
      for (let col = 0; col * size < WORLD.width; col++) {
        const t = TERRAIN.tiles[Math.floor(noise(col % TERRAIN.blockTiles, row % TERRAIN.blockTiles) * TERRAIN.tiles.length) % TERRAIN.tiles.length]
        drawImage(cv, sheet, t.x, t.y, t.w, t.h, S(col * size), S(row * size), S(size), S(size))
      }
    }
  }

  for (const road of NEIGHBORHOOD_LAYOUT.roads) fillRect(cv, S(road.x), S(road.y), S(road.w), S(road.h), hex(road.color))

  const draw = (p) => {
    const s = ENVIRONMENT_SPRITES[p.sprite]
    const w = s.w * (p.scale ?? 1)
    const h = s.h * (p.scale ?? 1)
    drawImage(cv, sheets[s.sheet], s.x, s.y, s.w, s.h, S(p.x - w / 2), S(p.y - h), S(w), S(h))
  }
  for (const p of NEIGHBORHOOD_LAYOUT.placements.filter((o) => o.layer === 'ground')) draw(p)

  for (const z of NEIGHBORHOOD_LAYOUT.zones) {
    fillRect(cv, S(z.x), S(z.y), S(z.w), 2, [255, 230, 120], 120)
    fillRect(cv, S(z.x), S(z.y + z.h), S(z.w), 2, [255, 230, 120], 120)
    fillRect(cv, S(z.x), S(z.y), 2, S(z.h), [255, 230, 120], 120)
    fillRect(cv, S(z.x + z.w), S(z.y), 2, S(z.h), [255, 230, 120], 120)
  }

  const items = [
    ...NEIGHBORHOOD_LAYOUT.placements.filter((o) => o.layer !== 'ground').map((p) => ({ y: p.y, kind: 'object', p })),
    ...NPC_DEFINITIONS.map((n) => ({ y: n.y, kind: 'npc', p: n })),
    { y: PLAYER_START.y, kind: 'player', p: PLAYER_START },
  ].sort((a, b) => a.y - b.y)

  for (const it of items) {
    if (it.kind === 'object') draw(it.p)
    else if (it.kind === 'npc') {
      const n = it.p
      fillRect(cv, S(n.x - 8), S(n.y - 24), S(16), S(18), hex(n.appearance.shirt))
      fillRect(cv, S(n.x - 7), S(n.y - 6), S(14), S(6), hex(n.appearance.pants))
      fillRect(cv, S(n.x - 7), S(n.y - 37), S(14), S(14), hex(n.appearance.skin))
    } else {
      fillRect(cv, S(it.p.x - 12), S(it.p.y - 40), S(24), S(40), [230, 60, 60])
    }
  }

  encodePng(cv, path.join(HERE, 'map-preview.png'))
  console.log(`wrote tools/map-preview.png ${cv.width}x${cv.height} (${NEIGHBORHOOD_LAYOUT.placements.length} placements)`)
}
