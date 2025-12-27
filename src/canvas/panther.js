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
    frameDuration: 95,
    columns,
  })

  const x = canvasWidth / 2 - (frameWidth * scale) / 2
  const y = canvasHeight - frameHeight * scale - 20

  // 1 = facing right, -1 = facing left
  let facing = -1 // start facing left if sprite sheet is left-facing
  let moving = false

  function update(delta) {
    if (moving) {
      sprite.update(delta)
    }
  }

  function draw(ctx) {
    const width = frameWidth * scale

    ctx.save()

    if (facing === 1) {
      // flip horizontally around sprite center
      ctx.translate(x + width, 0)
      ctx.scale(-1, 1)
      sprite.draw(ctx, 0, y, scale)
    } else {
      sprite.draw(ctx, x, y, scale)
    }

    ctx.restore()
  }

  function setFacing(dir) {
    if (dir === 0) return
    facing = dir > 0 ? 1 : -1
    moving = true
  }

  function stop() {
    moving = false
    sprite.reset?.() // optional if your sprite supports it
  }

  return {
    update,
    draw,
    setFacing,
    stop,
  }
}
