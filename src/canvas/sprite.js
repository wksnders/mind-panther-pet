export function createSprite({
  image,
  frameWidth,
  frameHeight,
  frameCount,
  frameDuration, // ms per frame
  columns,
}) {
  let currentFrame = 0
  let elapsed = 0

  function update(delta) {
    elapsed += delta

    if (elapsed >= frameDuration) {
      currentFrame = (currentFrame + 1) % frameCount
      elapsed = 0
    }
  }

  function draw(ctx, x, y, scale = 1) {
    const col = currentFrame % columns
    const row = Math.floor(currentFrame / columns)

    const sx = col * frameWidth
    const sy = row * frameHeight

    ctx.drawImage(
      image,
      sx,
      sy,
      frameWidth,
      frameHeight,
      x,
      y,
      frameWidth * scale,
      frameHeight * scale
    )
  }

  return {
    update,
    draw,
  }
}
