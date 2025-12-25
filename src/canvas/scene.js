export function createScene({ layers, canvasWidth, canvasHeight }) {
  const state = layers.map(layer => ({
    image: layer.image,
    speed: layer.speed,
    x: 0,
  }))

  function update(delta) {
    state.forEach(layer => {
      layer.x -= layer.speed * delta

      const width = layer.image.width
      if (layer.x <= -width) {
        layer.x += width
      }
    })
  }

  function draw(ctx) {
  // draw back → front
  for (let i = state.length - 1; i >= 0; i--) {
    const layer = state[i]
    const img = layer.image
    const width = img.width

    ctx.drawImage(img, layer.x, 0, width, canvasHeight)
    ctx.drawImage(img, layer.x + width, 0, width, canvasHeight)
  }
}


  return {
    update,
    draw,
  }
}
