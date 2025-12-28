<script setup>
import { ref, watch, onMounted, onUnmounted, inject } from 'vue'
import { createEngine } from '@/canvas/engine.js'
import { createScene } from '@/canvas/scene.js'
import { createPanther } from '@/canvas/panther.js'

const { state: pantherState } = inject('panther')

const canvasRef = ref(null)
const engine = ref(null)
const pantherRef = ref(null)
const sceneRef = ref(null)

// Props for parent-controlled direction & reduced motion
const props = defineProps({
  initialDirection: { type: Number, default: 0 },
  initialReducedMotion: { type: Boolean, default: false }
})

// Reactive local copies
const direction = ref(props.initialDirection)
const parallaxEnabled = ref(!props.initialReducedMotion)

// Watch for prop changes from parent
watch(() => props.initialDirection, val => {
  direction.value = val
  if (engine.value) engine.value.setDirection(val)
  if (pantherRef.value?.setDirection) pantherRef.value.setDirection(val)
})

watch(() => props.initialReducedMotion, val => {
  parallaxEnabled.value = !val
  if (engine.value) engine.value.setParallaxEnabled(!val)
  if (pantherRef.value?.setReducedMotion) pantherRef.value.setReducedMotion(val)
})

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

async function initCanvas() {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight
    if (sceneRef.value) {
      sceneRef.value.width = canvas.width
      sceneRef.value.height = canvas.height
    }
    if (pantherRef.value) {
      pantherRef.value.canvasWidth = canvas.width
      pantherRef.value.canvasHeight = canvas.height
    }
  }

  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()

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
      { image: backgroundImages[0], speed: 0.1, foreground: true },
      { image: backgroundImages[1], speed: 0.08 },
      { image: backgroundImages[2], speed: 0.04 },
      { image: backgroundImages[3], speed: 0.02 },
      { image: backgroundImages[4], speed: 0.01 },
    ],
  })
  sceneRef.value = scene

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

  engine.value = createEngine({ ctx, scene, panther })
  engine.value.setDirection(direction.value)
  engine.value.setParallaxEnabled(parallaxEnabled.value)
  engine.value.start()

  onUnmounted(() => {
    engine.value?.stop()
    window.removeEventListener('resize', resizeCanvas)
  })
}

onMounted(initCanvas)

// Expose refs for parent to manipulate if needed
defineExpose({ engine, pantherRef })
</script>

<template>
  <div class="panther-canvas-wrapper">
    <canvas ref="canvasRef" />
    <!-- Slot for parent controls -->
    <slot />
  </div>
</template>

<style scoped>
.panther-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 400px; /* default height, scalable via parent container */
  border-radius: 12px;
  overflow: hidden;
  background: black;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
  image-rendering: pixelated;
}
</style>
