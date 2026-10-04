// Rectangle collision for moving bodies against static solid boxes.
//
// A body has a feet position (x = centre, y = bottom) and a width and height.
// A solid is { x, y, w, h } with x/y as its top-left corner.

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

function bodyBox(body, x, y) {
  return { x: x - body.width / 2, y: y - body.height, w: body.width, h: body.height }
}

function firstHit(body, x, y, solids) {
  const box = bodyBox(body, x, y)
  for (const solid of solids) {
    if (overlaps(box, solid)) return solid
  }
  return null
}

// Moves the body by (dx, dy). Each axis is tested separately, so a body that runs
// into a wall on one axis still slides along it. On a hit, the body is placed flush
// against the solid's edge, which avoids jitter from re-testing a blocked move.
export function moveBody(body, dx, dy, solids) {
  if (dx !== 0) {
    const hit = firstHit(body, body.x + dx, body.y, solids)
    if (!hit) body.x += dx
    else body.x = dx > 0 ? hit.x - body.width / 2 : hit.x + hit.w + body.width / 2
  }

  if (dy !== 0) {
    const hit = firstHit(body, body.x, body.y + dy, solids)
    if (!hit) body.y += dy
    else body.y = dy > 0 ? hit.y : hit.y + hit.h + body.height
  }
}
