import { createSprite } from './sprite.js'

export function createPanther({
  image,
  canvasWidth,
  canvasHeight,
  frameWidth,
  frameHeight,
  frameCount,
}) {
  const sprite = createSprite({
    image,
    frameWidth,
    frameHeight,
    frameCount,
    frameDuration: 120,
  })

  const x = canvasWidth / 2 - frameWidth / 2
  const y = canvasHeight - frameHeight - 20

  function update(delta) {
    sprite.update(delta)
  }

  function draw(ctx) {
    sprite.draw(ctx, x, y, 1)
  }

  return {
    update,
    draw,
  }
}
