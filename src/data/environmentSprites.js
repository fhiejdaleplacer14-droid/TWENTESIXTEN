// Environment sprite catalogue. Each entry is a source rectangle inside one of the
// sheets in public/assets/. Each rectangle is the artwork's exact opaque bounding box,
// measured from the sheet, so nothing is cut off and no neighbouring sprite bleeds in.
// The original files are never modified.
//
// Several house sprites paint their shaded interiors as pure black; that is lifted to a
// dark tone when the sheet loads (see data/spriteTouchup.js), not changed here.
//
// Run `node tools/render-map.mjs atlas` to see every sprite with its name, which is the
// quickest way to check a name matches the artwork before using it in a layout.

export const ENVIRONMENT_SHEET_URLS = {
  houses: '/assets/house_choices.png',
  environment: '/assets/environment_sheet.png',
  store: '/assets/sari-sari.png',
  street: '/assets/street.png',
  court: '/assets/basketball_court.png',
  vehicles: '/assets/tryce.png',
}

const sprite = (sheet, x, y, w, h) => ({ sheet, x, y, w, h })

export const ENVIRONMENT_SPRITES = {
  // Houses (house_choices.png)
  'house.stilt': sprite('houses', 37, 2, 113, 126),
  'house.redroof': sprite('houses', 201, 6, 128, 122),
  'house.flagHouse': sprite('houses', 530, 2, 120, 127),
  'house.brown2': sprite('houses', 364, 9, 127, 118),
  'house.greenTrees': sprite('houses', 186, 136, 159, 103),
  'house.thatched': sprite('houses', 523, 137, 128, 94),
  'house.wooden': sprite('houses', 188, 250, 154, 109),

  // Sari-sari store (sari-sari.png)
  'store.sariSari': sprite('store', 43, 41, 596, 298),

  // Trees, plants, walls, street objects (environment_sheet.png)
  // The palms and the banana plant touch on the sheet, so these two are trimmed to the
  // plant itself rather than to a measured bounding box: a wider crop drags in a leaf
  // from the neighbour, which then floats beside the tree in the world.
  'tree.palmCluster': sprite('environment', 206, 6, 137, 133),
  'tree.banana': sprite('environment', 361, 34, 77, 97),
  'plant.bush': sprite('environment', 444, 81, 44, 44),
  'pole.utility': sprite('environment', 492, 23, 50, 155),
  'stall.thatchBench': sprite('environment', 498, 268, 79, 88),
  'barrel.orange': sprite('environment', 586, 272, 44, 47),
  'building.concreteA': sprite('environment', 156, 250, 113, 107),
  'building.concreteB': sprite('environment', 287, 255, 113, 101),
  'building.concreteC': sprite('environment', 16, 256, 117, 100),
  'wall.stoneGate': sprite('environment', 268, 186, 157, 51),

  // Street props (street.png)
  'sign.iceTubig': sprite('street', 357, 33, 106, 142),
  'bench.wood': sprite('street', 487, 78, 167, 76),
  'drum.blue': sprite('street', 555, 195, 90, 146),
  'blocks.cinder': sprite('street', 79, 205, 174, 125),
  'dog.sleeping': sprite('street', 320, 230, 194, 101),
  clothesline: sprite('street', 30, 21, 290, 155),

  // Basketball court (basketball_court.png). The court is one 271x368 image, split into
  // two halves so the layout can place it as a pair. The halves must stay contiguous
  // (203 + 165 = 368) or the join shows as a seam across the middle of the court.
  'court.top': sprite('court', 0, 0, 271, 203),
  'court.bottom': sprite('court', 0, 203, 271, 165),
  'court.shelter': sprite('court', 385, 5, 243, 143),
  'court.hoop': sprite('court', 281, 10, 92, 148),
  'court.chairWhite': sprite('court', 391, 167, 40, 65),
  'court.chairGreen': sprite('court', 441, 167, 40, 65),
  'court.bench': sprite('court', 588, 196, 83, 34),
  'court.rocks': sprite('court', 315, 233, 48, 43),
  'court.sign': sprite('court', 596, 318, 70, 38),
  'court.dirt': sprite('court', 389, 253, 114, 115),
  'court.chairStack': sprite('court', 538, 161, 41, 73),

  // Vehicles (tryce.png)
  'jeepney.provincial': sprite('vehicles', 287, 78, 361, 234),
  // tryce.png draws two tricycles overlapping on a diagonal, so neither can be cropped
  // free of the other. This is the yellow one; a fragment of the other one's rear wheel
  // still sits above its windscreen. Separating the two on the sheet would fix it.
  'tricycle.motor': sprite('vehicles', 72, 176, 139, 116),
}
