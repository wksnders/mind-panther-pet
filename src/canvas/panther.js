import { createSprite } from './sprite.js'

export function createPanther({
  image,
  canvasWidth,
  canvasHeight,
  frameWidth,
  frameHeight,
  frameCount,
  columns = 3,
  scale = 1,
}) {
  const sprite = createSprite({
    image,
    frameWidth,
    frameHeight,
    frameCount,
    frameDuration: 100,
    columns,
  })

  let x = canvasWidth / 2 - (frameWidth * scale) / 2
  let y = canvasHeight - frameHeight * scale - 20

  // 1 = facing right, -1 = facing left
  let facing = -1 // <-- start facing left if your sprite sheet is left-facing

  function update(delta) {
    sprite.update(delta)
  }

  function draw(ctx) {
    const width = frameWidth * scale

    ctx.save()

    if (facing === -1) {
      ctx.translate(x + width, 0)
      ctx.scale(-1, 1)
      sprite.draw(ctx, 0, y, scale)
    } else {
      sprite.draw(ctx, x, y, scale)
    }

    ctx.restore()
  }

  function setFacing(direction) {
    facing = direction >= 0 ? 1 : -1
  }

  return {
    update,
    draw,
    setFacing,
  }
}
