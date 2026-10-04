// Base terrain settings.
//
// mode 'grass'  the ground is generated in code (see game/grassTexture.js). Used because
//               none of the sheets contain a plain grass tile.
// mode 'tiles'  the ground is cut from a sheet at runtime. Switch to this when a grass
//               asset exists: set mode and point `tiles` at the artwork. The dirt tiles
//               from basketball_court.png are already listed as an example.
//
// Original assets are only read, never modified.

export const TERRAIN = {
  mode: 'grass',

  grass: {
    tileSize: 128,
    base: '#7aa94f',
    shades: ['#5f8a3c', '#8cba5c', '#6d9a45'],
    bladeCount: 1100,
  },

  // Used when mode is 'tiles'. These are the dirt-with-grass ground tiles; each crop must
  // stay inside one tile, because the sheet has transparent gutters between them.
  sheet: 'court',
  tiles: [
    { x: 390, y: 254, w: 54, h: 55 },
    { x: 447, y: 254, w: 55, h: 55 },
    { x: 390, y: 312, w: 54, h: 55 },
    { x: 447, y: 312, w: 55, h: 55 },
  ],
  blockTiles: 6,

  // Shown for the moment before the sheet has loaded, and if it fails to load.
  fallbackColor: '#7aa94f',
}
