<script setup>
import { ref, watch, onMounted, onUnmounted, inject } from 'vue'
import { createEngine } from '@/canvas/engine.js'
import { createScene } from '@/canvas/scene.js'
import { createPanther } from '@/canvas/panther.js'

const { state: pantherState } = inject('panther')

const canvasRef = ref(null)
const engine = ref(null)
const pantherRef = ref(null)

// Initialize direction and parallax from panther object
const direction = ref(pantherState.direction ?? 0)
const parallaxEnabled = ref(!(pantherState.reduceMotion ?? false))

function toggleDirection(dir) {
  direction.value = direction.value === dir ? 0 : dir
  if (engine.value) engine.value.setDirection(direction.value)
  if (pantherRef.value?.setDirection) pantherRef.value.setDirection(direction.value)
  pantherState.direction = direction.value
}

function toggleParallax() {
  parallaxEnabled.value = !parallaxEnabled.value
  if (engine.value) engine.value.setParallaxEnabled(parallaxEnabled.value)
  if (pantherRef.value?.setReducedMotion) pantherRef.value.setReducedMotion(!parallaxEnabled.value)
  pantherState.reduceMotion = !parallaxEnabled.value
}

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

  const scene = createScene({
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    layers: [
      { image: backgroundImages[0], speed: 0.10, foreground: true },
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
    frameWidth: pantherImage.width / 3,
    frameHeight: pantherImage.height / 6,
    frameCount: 17,
    columns: 3,
    scale: 3,
    initialDirection: direction.value,
    reducedMotion: !parallaxEnabled.value
  })

  pantherRef.value = panther

  engine.value = createEngine({
    ctx,
    scene,
    panther,
  })

  engine.value.setDirection(direction.value)
  engine.value.setParallaxEnabled(parallaxEnabled.value)
  engine.value.start()
})

onUnmounted(() => {
  engine.value?.stop()
})

// Watch reactive states so UI and engine stay in sync
watch(direction, (val) => {
  if (engine.value) engine.value.setDirection(val)
  if (pantherRef.value?.setDirection) pantherRef.value.setDirection(val)
  pantherState.direction = val
})

watch(parallaxEnabled, (val) => {
  if (engine.value) engine.value.setParallaxEnabled(val)
  if (pantherRef.value?.setReducedMotion) pantherRef.value.setReducedMotion(!val)
  pantherState.reduceMotion = !val
})
</script>

<template>
  <div class="panther-canvas-wrapper">
    <canvas ref="canvasRef" />

    <div class="controls">
      <button
        :class="{ active: direction === -1 }"
        @click="toggleDirection(-1)"
      >
        ◀
      </button>

      <button
        :class="{ active: direction === 1 }"
        @click="toggleDirection(1)"
      >
        ▶
      </button>

      <label class="toggle">
        <input
          type="checkbox"
          :checked="!parallaxEnabled"
          @change="toggleParallax"
        />
        Reduce motion
      </label>
    </div>
  </div>
</template>

<style scoped>
.panther-canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0e0e0e;
  padding: 1rem;
  gap: 0.75rem;
}

canvas {
  border-radius: 12px;
  border: 1px solid #333;
  background: black;
  image-rendering: pixelated;
}

.controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.controls button {
  padding: 0.4rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #eee;
  cursor: pointer;
}

.controls button.active {
  background: #444;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #ccc;
}
</style>
