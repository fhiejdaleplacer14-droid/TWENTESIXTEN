// Settings for the black-fill lift (see game/spriteTouchup.js).
//
// Several of the house sprites paint shaded interiors as pure black, which reads as a
// hole in the grass. This lifts those fills to a dark tone once, when the sheet loads.
//
// Set `enabled: false` to see the sheets exactly as drawn. The files in public/assets/
// are never modified either way.

export const SPRITE_TOUCHUP = {
  enabled: true,

  // Sheet keys from ENVIRONMENT_SHEET_URLS, plus 'player'. Only these are processed.
  sheets: ['houses', 'store', 'street', 'environment', 'court'],

  // A pixel is shadow when its luminance is at or below this (0-255).
  maxLuminance: 16,

  // A shadow pixel is fill when every pixel within this many pixels is also shadow.
  // 1 checks a 3x3 square, which excludes one and two pixel outlines.
  fillRadius: 1,

  // What the fill becomes: a dark warm brown rather than black.
  tone: { r: 38, g: 29, b: 23 },

  // 0 leaves the pixel alone, 1 replaces it with `tone`.
  strength: 1,
}
