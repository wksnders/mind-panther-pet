<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import { createEngine } from '@/canvas/engine.js'
import { createScene } from '@/canvas/scene.js'
import { createPanther } from '@/canvas/panther.js'

const canvasRef = ref(null)

let engine = null

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

onMounted(async () => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // Fixed canvas size for now (easy to make responsive later)
  canvas.width = 800
  canvas.height = 400

  // --- Load background layers ---
  const backgroundImages = await Promise.all([
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_1.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_2.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_3.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_4.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_5.png', import.meta.url)),
  ])
  const dizzyBackroundLayers = [
      { image: backgroundImages[0], speed: 0.02 },
      { image: backgroundImages[1], speed: 0.04 },
      { image: backgroundImages[2], speed: 0.08 },
      { image: backgroundImages[3], speed: 0.12 },
      { image: backgroundImages[4], speed: 0.18 },
    ]
  const scene = createScene({
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    layers: [
      { image: backgroundImages[0], speed: 0.10 },
      { image: backgroundImages[1], speed: 0.08 },
      { image: backgroundImages[2], speed: 0.04 },
      { image: backgroundImages[3], speed: 0.02 },
      { image: backgroundImages[4], speed: 0.01 },
    ],
  })

  // --- Load panther sprite ---
  const pantherImage = await loadImage(
    new URL('@/assets/sprites/panther_walk.png', import.meta.url)
  )

  const panther = createPanther({
    image: pantherImage,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    frameWidth: 128,   // <-- adjust to your sprite sheet
    frameHeight: 128,  // <-- adjust to your sprite sheet
    frameCount: 6,     // <-- adjust to your sprite sheet
  })

  // --- Create & start engine ---
  engine = createEngine({
    ctx,
    scene,
    panther,
  })

  engine.start()
})

onUnmounted(() => {
  if (engine) {
    engine.stop()
  }
})
</script>

<template>
  <div class="panther-canvas-wrapper">
    <canvas ref="canvasRef" />
  </div>
</template>

<style scoped>
.panther-canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0e0e0e;
  padding: 1rem;
}

canvas {
  border-radius: 12px;
  border: 1px solid #333;
  background: black;
  image-rendering: pixelated;
}
</style>
