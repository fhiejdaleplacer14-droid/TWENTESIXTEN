// Environment sprite catalogue. Each entry is a source rectangle inside one of the
// sheets in public/assets/. Rectangles were measured from the opaque pixels of each
// sheet, so they are tight around the artwork. The original files are never modified.

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
  'house.stilt': sprite('houses', 37, 2, 113, 125),
  'house.redroof': sprite('houses', 201, 6, 127, 121),
  'house.flagHouse': sprite('houses', 530, 2, 119, 127),
  'house.brown2': sprite('houses', 364, 9, 127, 117),
  'house.greenTrees': sprite('houses', 187, 136, 157, 101),
  'house.thatched': sprite('houses', 523, 137, 127, 93),
  'house.wooden': sprite('houses', 188, 250, 153, 109),

  // Sari-sari store (sari-sari.png)
  'store.sariSari': sprite('store', 43, 41, 595, 297),

  // Trees, plants, walls, street objects (environment_sheet.png)
  'tree.palmCluster': sprite('environment', 206, 7, 155, 129),
  'tree.banana': sprite('environment', 353, 34, 85, 97),
  'plant.pot': sprite('environment', 444, 81, 43, 43),
  'pole.utility': sprite('environment', 492, 23, 49, 155),
  'stall.thatchBench': sprite('environment', 498, 268, 79, 87),
  'barrel.orange': sprite('environment', 586, 272, 43, 47),
  'building.concreteA': sprite('environment', 157, 250, 111, 107),
  'wall.stoneGate': sprite('environment', 268, 186, 157, 51),

  // Street props (street.png)
  'sign.iceTubig': sprite('street', 357, 33, 89, 131),
  'bench.wood': sprite('street', 488, 78, 165, 75),
  'drum.blue': sprite('street', 555, 195, 89, 145),
  'blocks.cinder': sprite('street', 79, 205, 173, 125),
  'dog.sleeping': sprite('street', 320, 230, 193, 101),
  clothesline: sprite('street', 30, 21, 289, 155),

  // Basketball court (basketball_court.png)
  'court.top': sprite('court', 0, 0, 271, 203),
  'court.bottom': sprite('court', 0, 206, 271, 161),
  'court.shelter': sprite('court', 385, 5, 243, 143),
  'court.hoop': sprite('court', 281, 11, 91, 147),
  'court.chairWhite': sprite('court', 391, 167, 39, 65),
  'court.chairGreen': sprite('court', 441, 167, 39, 65),
  'court.bench': sprite('court', 589, 196, 81, 33),
  'court.rocks': sprite('court', 315, 233, 47, 43),
  'court.sign': sprite('court', 596, 318, 69, 37),
  'court.dirt': sprite('court', 389, 253, 113, 115),
  'court.plant': sprite('court', 538, 161, 41, 73),

  // Vehicles (tryce.png)
  'jeepney.provincial': sprite('vehicles', 292, 78, 355, 231),
  'tricycle.motor': sprite('vehicles', 70, 105, 205, 195),
}
