import { createSprite } from './sprite.js'

export function createPanther({
  image,
  canvasWidth,
  canvasHeight,
  frameWidth,
  frameHeight,
  frameCount,
  columns = 3, // <-- important for multi-row sprite sheets
  scale = 1,
}) {
  const sprite = createSprite({
    image,
    frameWidth,
    frameHeight,
    frameCount,
    frameDuration: 120,
    columns,
  })

  // Center horizontally, sit on "ground"
  let x = canvasWidth / 2 - (frameWidth * scale) / 2
  let y = canvasHeight - frameHeight * scale - 20

  function update(delta) {
    sprite.update(delta)
  }

  function draw(ctx) {
    ctx.save()
    ctx.scale(-1, 1)
    sprite.draw(ctx, -((canvasWidth+x)/2), y,scale )
    ctx.restore()
    
  }

  return {
    update,
    draw,
  }
}
