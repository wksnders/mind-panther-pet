export function createScene({ layers, canvasWidth, canvasHeight }) {
  const state = layers.map(layer => ({
    image: layer.image,
    speed: layer.speed,
    x: 0,
    foreground: !!layer.foreground,
  }))

  let direction = 0
  let parallaxEnabled = true

  function setDirection(dir) {
    direction = Math.sign(dir)
  }

  function setParallaxEnabled(enabled) {
    parallaxEnabled = !!enabled
  }

  function update(delta) {
    if (!parallaxEnabled || direction === 0) return

    // scene scrolls opposite to movement
    const scrollDir = -direction

    state.forEach(layer => {
      const width = layer.image.width

      layer.x =
        (layer.x + layer.speed * delta * scrollDir) % width

      // keep x in a stable negative range (avoids large floats)
      if (layer.x > 0) layer.x -= width
    })
  }

  function drawLayer(ctx, layer) {
    const img = layer.image
    const width = img.width

    // draw 3 copies to guarantee coverage in both directions
    ctx.drawImage(img, layer.x - width, 0, width, canvasHeight)
    ctx.drawImage(img, layer.x, 0, width, canvasHeight)
    ctx.drawImage(img, layer.x + width, 0, width, canvasHeight)
  }

  function drawBackground(ctx) {
    state
      .filter(l => !l.foreground)
      .slice()
      .reverse()
      .forEach(layer => drawLayer(ctx, layer))
  }

  function drawForeground(ctx) {
    state
      .filter(l => l.foreground)
      .slice()
      .reverse()
      .forEach(layer => drawLayer(ctx, layer))
  }

  return {
    update,
    drawBackground,
    drawForeground,
    setDirection,
    setParallaxEnabled,
  }
}
