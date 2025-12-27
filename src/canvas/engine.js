export function createEngine({ ctx, scene, panther = null }) {
  let lastTime = 0
  let running = false
  let direction = 0

  function loop(timestamp) {
    if (!running) return

    const delta = timestamp - lastTime
    lastTime = timestamp

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    scene.update(delta)
    scene.drawBackground(ctx)

    if (panther) {
      panther.update(delta)
      panther.draw(ctx)
    }

    scene.drawForeground(ctx)

    requestAnimationFrame(loop)
  }

  return {
    start() {
      if (running) return
      running = true
      lastTime = performance.now()
      requestAnimationFrame(loop)
    },

    stop() {
      running = false
    },

    setDirection(dir) {
      direction = dir
      scene.setDirection(dir)

      if (panther && panther.setFacing) {
        panther.setFacing(dir)
      }
    },

    setParallaxEnabled(enabled) {
      scene.setParallaxEnabled(enabled)
    },
  }
}
