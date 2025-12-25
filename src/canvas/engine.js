export function createEngine({ ctx, scene, panther }) {
  let lastTime = 0
  let running = false

  function loop(timestamp) {
    if (!running) return

    const delta = timestamp - lastTime
    lastTime = timestamp

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    scene.update(delta)
    scene.draw(ctx)

    panther.update(delta)
    panther.draw(ctx)

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
  }
}
