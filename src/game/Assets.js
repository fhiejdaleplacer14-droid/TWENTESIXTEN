// Loads an image from a URL (files in public/ are served from the site root).

import { SPRITE_TOUCHUP } from '../data/spriteTouchup.js'
import { liftBlackFills } from './spriteTouchup.js'

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    image.src = src
  })
}

// Loads a sheet and lifts its solid black fills if that is switched on for this sheet
// (see data/spriteTouchup.js). Returns the image itself when nothing is done to it,
// otherwise an offscreen canvas, which drawImage accepts in exactly the same way.
// The file in public/assets/ is only read; the lift happens on this copy.
export async function loadSheet(key, src) {
  const image = await loadImage(src)
  if (!SPRITE_TOUCHUP.enabled || !SPRITE_TOUCHUP.sheets.includes(key)) return image

  try {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || image.width
    canvas.height = image.naturalHeight || image.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(image, 0, 0)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    liftBlackFills(pixels.data, canvas.width, canvas.height, SPRITE_TOUCHUP)
    ctx.putImageData(pixels, 0, 0)
    return canvas
  } catch (error) {
    // Reading pixels back can fail; the untouched sheet still draws fine.
    console.warn(`Sprite touch-up skipped for ${key}:`, error)
    return image
  }
}
