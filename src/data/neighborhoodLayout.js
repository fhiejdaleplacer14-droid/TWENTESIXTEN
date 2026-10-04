// TEMPORARY NEIGHBORHOOD LAYOUT — a small test section, not the final map.
// Edit this file to move things around; no engine code needs to change.
//
// Placement fields:
//   sprite  name from ENVIRONMENT_SPRITES
//   x, y    bottom-centre of the sprite (its base point) in world coordinates
//   scale   draw scale (default 1)
//   solid   optional { w, h } collision box, flush with the sprite's base
//   layer   'ground' for flat decals drawn under the player, otherwise sorted by y

// Zones: areas that emit a 'reached' event when the player's feet enter them.
// Interactable placements carry an `interact` block: { id, name, dialogueId?, interactionRange? }.
export const NEIGHBORHOOD_LAYOUT = {
  roads: [{ x: 0, y: 760, w: 2400, h: 160, color: '#8b7d6b' }],

  zones: [{ id: 'basketball-court', x: 1500, y: 1000, w: 300, h: 400 }],

  placements: [
    // Houses north of the road
    {
      sprite: 'house.stilt',
      x: 360,
      y: 600,
      scale: 1.6,
      solid: { w: 150, h: 40 },
      // The letter: appears only after the camera is found, and goes once read.
      interact: {
        id: 'stilt-letter',
        name: 'Letter',
        dialogueId: 'letter.read',
        focus: true,
        requires: ['foundCamera'],
        hideWhen: ['foundLetter'],
      },
    },
    { sprite: 'store.sariSari', x: 1020, y: 700, scale: 0.45, solid: { w: 240, h: 50 } },
    { sprite: 'house.redroof', x: 1350, y: 600, scale: 1.5, solid: { w: 170, h: 40 } },
    { sprite: 'house.flagHouse', x: 1720, y: 600, scale: 1.5, solid: { w: 160, h: 40 } },
    { sprite: 'house.brown2', x: 2080, y: 600, scale: 1.5, solid: { w: 170, h: 40 } },

    // Trees and plants
    { sprite: 'tree.palmCluster', x: 620, y: 640, scale: 1.3, solid: { w: 60, h: 24 } },
    { sprite: 'tree.palmCluster', x: 2250, y: 500, scale: 1.4, solid: { w: 50, h: 24 } },
    { sprite: 'tree.banana', x: 2300, y: 880, scale: 1.3 },
    { sprite: 'plant.pot', x: 1600, y: 740, scale: 1.2 },

    // Houses south of the road
    { sprite: 'house.greenTrees', x: 420, y: 1180, scale: 1.5, solid: { w: 200, h: 40 } },
    { sprite: 'house.thatched', x: 850, y: 1160, scale: 1.4, solid: { w: 160, h: 36 } },
    { sprite: 'house.wooden', x: 1180, y: 1160, scale: 1.4, solid: { w: 190, h: 36 } },
    { sprite: 'building.concreteA', x: 2220, y: 1200, scale: 1.3, solid: { w: 130, h: 40 } },

    // Basketball court
    { sprite: 'court.top', x: 1650, y: 1223, scale: 1.1, layer: 'ground' },
    { sprite: 'court.bottom', x: 1650, y: 1400, scale: 1.1, layer: 'ground' },
    { sprite: 'court.dirt', x: 1950, y: 1280, layer: 'ground' },
    { sprite: 'court.shelter', x: 1650, y: 1000, scale: 1.2, solid: { w: 250, h: 30 } },
    { sprite: 'court.hoop', x: 1790, y: 1090, solid: { w: 20, h: 20 } },
    { sprite: 'court.chairWhite', x: 1560, y: 1260 },
    { sprite: 'court.chairGreen', x: 1610, y: 1260 },
    { sprite: 'court.bench', x: 1700, y: 1300 },
    { sprite: 'court.rocks', x: 1480, y: 1380 },
    { sprite: 'court.plant', x: 1820, y: 1300, scale: 1.1, solid: { w: 30, h: 16 } },
    { sprite: 'court.sign', x: 1650, y: 1450 },

    // Street objects and vehicles
    { sprite: 'clothesline', x: 560, y: 740, scale: 0.8 },
    {
      sprite: 'stall.thatchBench',
      x: 1500,
      y: 740,
      scale: 1.2,
      solid: { w: 70, h: 30 },
      // The camera: found once, then gone.
      interact: {
        id: 'stall-camera',
        name: 'Old Camera',
        dialogueId: 'camera.found',
        focus: true,
        hideWhen: ['foundCamera'],
      },
    },
    { sprite: 'pole.utility', x: 1250, y: 760, solid: { w: 10, h: 10 } },
    { sprite: 'jeepney.provincial', x: 1900, y: 860, scale: 0.5, solid: { w: 160, h: 40 } },
    { sprite: 'tricycle.motor', x: 700, y: 900, scale: 0.55, solid: { w: 100, h: 30 } },
    { sprite: 'sign.iceTubig', x: 620, y: 960, scale: 0.8 },
    {
      sprite: 'bench.wood',
      x: 960,
      y: 960,
      scale: 0.9,
      interact: { id: 'old-bench', name: 'Old Bench', dialogueId: 'bench.inspect' },
    },
    { sprite: 'drum.blue', x: 1450, y: 960, scale: 0.8, solid: { w: 60, h: 22 } },
    { sprite: 'blocks.cinder', x: 2000, y: 960, scale: 0.9, solid: { w: 140, h: 40 } },
    { sprite: 'dog.sleeping', x: 2120, y: 1010, scale: 0.8 },
    { sprite: 'barrel.orange', x: 2350, y: 1100, scale: 1.2, solid: { w: 44, h: 22 } },

    // Perimeter wall
    { sprite: 'wall.stoneGate', x: 1000, y: 1490, scale: 1.3, solid: { w: 200, h: 40 } },
  ],
}
