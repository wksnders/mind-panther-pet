export function createSprite({
  image,
  frameWidth,
  frameHeight,
  frameCount,
  frameDuration, // ms per frame
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
    ctx.drawImage(
      image,
      currentFrame * frameWidth,
      0,
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
