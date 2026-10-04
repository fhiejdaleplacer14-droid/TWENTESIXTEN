// NEIGHBORHOOD LAYOUT — the town, laid out as a road grid with four blocks.
// Edit this file to move things around; no engine code needs to change.
//
// Placement fields:
//   sprite   name from ENVIRONMENT_SPRITES
//   x, y     bottom-centre of the sprite (its base point) in world coordinates
//   scale    draw scale (chosen so each object has a sensible world width)
//   solid    optional { w, h } collision box, flush with the sprite's base
//   layer    'ground' for flat decals drawn under the player, otherwise sorted by y
//   interact optional { id, name, dialogueId, focus, requires, hideWhen }
//
// Layout guide (world is 2400 x 1415):
//   y 98 / 1400   perimeter wall, north and south
//   y 690..800    main road, running the full width
//   y 350 / 620   the two north house rows
//   y 1020 / 1290 the two south-west house rows
//   x 540 / 1130 / 1720    north lanes (the middle one is a dirt path)
//   x 880 / 1880  south lanes
//   Houses are ~165-185 px wide and sit ~65 px apart, so every gap is walkable.

export const NEIGHBORHOOD_LAYOUT = {
  roads: [
    { x: 60, y: 690, w: 2280, h: 110, color: '#a8a59b' },
    { x: 540, y: 150, w: 90, h: 540, color: '#a8a59b' },
    { x: 1130, y: 150, w: 80, h: 540, color: '#8f6f4e' },
    { x: 1720, y: 150, w: 90, h: 540, color: '#a8a59b' },
    { x: 880, y: 800, w: 90, h: 545, color: '#a8a59b' },
    { x: 1880, y: 800, w: 90, h: 545, color: '#a8a59b' },
  ],

  zones: [{ id: 'basketball-court', x: 1065, y: 837, w: 330, h: 448 }],

  placements: [
    // Perimeter wall, north then south. Each segment is 200 px wide and they meet end to end.
    { sprite: 'wall.stoneGate', x: 100, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 300, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 500, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 700, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 900, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1100, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1300, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1500, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1700, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1900, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 2100, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 2300, y: 98, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 100, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 300, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 500, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 700, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 900, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1100, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1300, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1500, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1700, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 1900, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 2100, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },
    { sprite: 'wall.stoneGate', x: 2300, y: 1400, scale: 1.274, solid: { w: 200, h: 40 } },

    // North back row (y 350).
    { sprite: 'building.concreteA', x: 160, y: 350, scale: 1.486, solid: { w: 140, h: 30 } },
    { sprite: 'building.concreteB', x: 400, y: 350, scale: 1.46, solid: { w: 140, h: 30 } },
    { sprite: 'house.redroof', x: 740, y: 350, scale: 1.378, solid: { w: 150, h: 30 } },
    { sprite: 'house.brown2', x: 1320, y: 350, scale: 1.378, solid: { w: 150, h: 30 } },
    { sprite: 'building.concreteC', x: 1560, y: 350, scale: 1.435, solid: { w: 140, h: 30 } },
    { sprite: 'house.flagHouse', x: 1920, y: 350, scale: 1.429, solid: { w: 145, h: 30 } },
    {
      sprite: 'house.stilt',
      x: 2160,
      y: 350,
      scale: 1.504,
      solid: { w: 145, h: 30 },
      interact: {
        id: 'stilt-letter',
        name: 'Letter',
        dialogueId: 'letter.read',
        focus: true,
        requires: ['foundCamera'],
        hideWhen: ['foundLetter'],
      },
    },

    // North front row (y 620). The block between the dirt path and the east lane is
    // left open as a small park.
    { sprite: 'building.concreteC', x: 160, y: 620, scale: 1.435, solid: { w: 140, h: 30 } },
    { sprite: 'house.wooden', x: 400, y: 620, scale: 1.176, solid: { w: 155, h: 30 } },
    { sprite: 'building.concreteB', x: 740, y: 620, scale: 1.46, solid: { w: 140, h: 30 } },
    { sprite: 'store.sariSari', x: 980, y: 620, scale: 0.336, solid: { w: 175, h: 34 } },
    { sprite: 'building.concreteA', x: 1920, y: 620, scale: 1.486, solid: { w: 140, h: 30 } },
    { sprite: 'house.greenTrees', x: 2160, y: 620, scale: 1.178, solid: { w: 160, h: 30 } },

    // North greenery.
    { sprite: 'tree.palmCluster', x: 900, y: 240, scale: 0.774, solid: { w: 46, h: 18 } },
    { sprite: 'tree.banana', x: 1450, y: 250, scale: 1.059 },
    { sprite: 'tree.palmCluster', x: 2330, y: 290, scale: 0.774, solid: { w: 46, h: 18 } },
    { sprite: 'tree.palmCluster', x: 1290, y: 650, scale: 0.774, solid: { w: 46, h: 18 } },
    { sprite: 'tree.banana', x: 1610, y: 655, scale: 1.059 },
    { sprite: 'plant.bush', x: 1450, y: 670, scale: 1.28 },
    { sprite: 'plant.bush', x: 2300, y: 480, scale: 1.28 },
    { sprite: 'sign.iceTubig', x: 1090, y: 630, scale: 0.6 },

    // Poles along the south edge of the main road.
    { sprite: 'pole.utility', x: 300, y: 825, scale: 0.898, solid: { w: 12, h: 10 } },
    { sprite: 'pole.utility', x: 1010, y: 825, scale: 0.898, solid: { w: 12, h: 10 } },
    { sprite: 'pole.utility', x: 1450, y: 825, scale: 0.898, solid: { w: 12, h: 10 } },
    { sprite: 'pole.utility', x: 2010, y: 825, scale: 0.898, solid: { w: 12, h: 10 } },

    // South-west block: two house rows and a back yard.
    { sprite: 'house.brown2', x: 160, y: 1020, scale: 1.378, solid: { w: 150, h: 30 } },
    { sprite: 'building.concreteB', x: 420, y: 1020, scale: 1.46, solid: { w: 140, h: 30 } },
    { sprite: 'house.wooden', x: 160, y: 1290, scale: 1.176, solid: { w: 155, h: 30 } },
    { sprite: 'building.concreteC', x: 420, y: 1290, scale: 1.435, solid: { w: 140, h: 30 } },
    { sprite: 'house.thatched', x: 680, y: 1290, scale: 1.339, solid: { w: 145, h: 30 } },
    { sprite: 'clothesline', x: 700, y: 980, scale: 0.519 },
    { sprite: 'drum.blue', x: 820, y: 1130, scale: 0.562, solid: { w: 40, h: 16 } },
    { sprite: 'plant.bush', x: 620, y: 1130, scale: 1.28 },
    { sprite: 'blocks.cinder', x: 560, y: 1030, scale: 0.5 },
    { sprite: 'dog.sleeping', x: 790, y: 1240, scale: 0.55 },
    { sprite: 'jeepney.provincial', x: 430, y: 790, scale: 0.6, solid: { w: 190, h: 26 } },

    // Basketball court, in the middle of the south half.
    { sprite: 'court.top', x: 1230, y: 1084, scale: 1.218, layer: 'ground' },
    { sprite: 'court.bottom', x: 1230, y: 1285, scale: 1.218, layer: 'ground' },
    { sprite: 'court.hoop', x: 1230, y: 900, scale: 0.846, solid: { w: 18, h: 16 } },
    { sprite: 'court.bench', x: 1450, y: 950, scale: 1.235 },
    { sprite: 'court.chairStack', x: 1420, y: 890, scale: 1.22, solid: { w: 24, h: 12 } },
    { sprite: 'court.sign', x: 1010, y: 950, scale: 1.2 },

    // Plaza between the court and the east lane: the stall with the camera, and the bench.
    {
      sprite: 'stall.thatchBench',
      x: 1560,
      y: 1150,
      scale: 1.456,
      solid: { w: 70, h: 24 },
      interact: {
        id: 'stall-camera',
        name: 'Old Camera',
        dialogueId: 'camera.found',
        focus: true,
        hideWhen: ['foundCamera'],
      },
    },
    {
      sprite: 'bench.wood',
      x: 1740,
      y: 1230,
      scale: 0.758,
      interact: { id: 'old-bench', name: 'Old Bench', dialogueId: 'bench.inspect' },
    },
    { sprite: 'court.shelter', x: 1680, y: 1000, scale: 0.95, solid: { w: 200, h: 26 } },
    { sprite: 'tree.palmCluster', x: 1840, y: 920, scale: 0.774, solid: { w: 46, h: 18 } },
    { sprite: 'plant.bush', x: 1470, y: 1260, scale: 1.28 },
    { sprite: 'plant.bush', x: 1830, y: 1180, scale: 1.28 },

    // South-east corner: the second store and the tricycle terminal.
    { sprite: 'store.sariSari', x: 2140, y: 960, scale: 0.303, solid: { w: 160, h: 32 } },
    { sprite: 'house.thatched', x: 2310, y: 1140, scale: 1.339, solid: { w: 145, h: 30 } },
    { sprite: 'tricycle.motor', x: 2040, y: 1310, scale: 0.827, solid: { w: 95, h: 24 } },
    { sprite: 'tricycle.motor', x: 2170, y: 1310, scale: 0.827, solid: { w: 95, h: 24 } },
    { sprite: 'tricycle.motor', x: 2300, y: 1310, scale: 0.827, solid: { w: 95, h: 24 } },
    { sprite: 'plant.bush', x: 1990, y: 1010, scale: 1.28 },
  ],
}
