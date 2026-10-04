// Sprite layout for public/assets/player_sheet.png (1408 x 768).
//
// Each frame rectangle is the sprite's measured opaque bounds on the sheet.
// The sheet has no grid, so frames are not uniform in size.
//
// ASSUMPTION: the sheet is not labeled, so rows were matched to directions by eye:
//   - idle down / up / right come from the first sprites of the top row
//   - walk down comes from the first four sprites of the middle row
//   - walk right comes from the last four sprites of the middle row
//   - walk up has no back-facing walk frames, so it holds the idle-up frame
//   - left is the right-facing frames flipped horizontally at draw time
// Verify these against the artwork and edit the rectangles here if needed.

export const PLAYER_SHEET_URL = '/assets/player_sheet.png'

// Scale applied when drawing the sprite. Tune to match the world's tile scale.
export const PLAYER_DRAW_SCALE = 0.42

export const WALK_FRAMES_PER_SECOND = 8

const frame = (x, y, w, h) => ({ x, y, w, h })

export const PLAYER_FRAMES = {
  idle: {
    down: [frame(51, 45, 111, 223)],
    up: [frame(209, 45, 111, 221)],
    right: [frame(370, 45, 113, 221)],
  },
  walk: {
    down: [
      frame(50, 298, 109, 209),
      frame(209, 298, 109, 207),
      frame(368, 298, 107, 207),
      frame(530, 298, 109, 209),
    ],
    up: [frame(209, 45, 111, 221)],
    right: [
      frame(749, 298, 115, 207),
      frame(910, 298, 111, 207),
      frame(1078, 298, 111, 207),
      frame(1240, 298, 111, 209),
    ],
  },
}
