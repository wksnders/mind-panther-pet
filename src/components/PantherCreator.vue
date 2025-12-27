<script setup>
import { inject, ref, onMounted, onUnmounted, watch } from 'vue'
import { createEngine } from '@/canvas/engine.js'
import { createScene } from '@/canvas/scene.js'

const pantherStore = inject('panther')
const { createPanther, PANTHER_TYPES, state } = pantherStore

// Form
const name = ref(state.panther.name)
const pronouns = ref(state.panther.pronouns)
const lore = ref(state.panther.lore)
const type = ref(state.panther.type ?? 'mind')
const reduceMotion = ref(state.reduceMotion)

function submit() {
  createPanther({ name: name.value, pronouns: pronouns.value, lore: lore.value, type: type.value })
  state.reduceMotion = reduceMotion.value
}

// Canvas setup
const canvasRef = ref(null)
let engine = null
let scene = null

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
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const backgroundImages = await Promise.all([
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_1.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_2.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_3.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_4.png', import.meta.url)),
    loadImage(new URL('@/assets/backgrounds/Jungle_Layer_5.png', import.meta.url)),
  ])

  scene = createScene({
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    layers: backgroundImages.map((img, i) => ({ image: img, speed: 0.02 / (i + 1), foreground: i === 0 }))
  })

  scene.setDirection(1)
  engine = createEngine({ ctx, scene, panther: null })
  engine.setParallaxEnabled(!reduceMotion.value)
  engine.start()

  const resizeHandler = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', resizeHandler)
  onUnmounted(() => { engine.stop(); window.removeEventListener('resize', resizeHandler) })
})

watch(reduceMotion, val => scene?.setParallaxEnabled(!val))
</script>

<template>
  <div class="creator-wrapper">
    <canvas ref="canvasRef" class="background-canvas"/>
    <section class="creator">
      <label class="reduce-motion">
        <input type="checkbox" v-model="reduceMotion"/>
        <span>Stop Scroll</span>
      </label>

      <h1>Create Your Mind Panther</h1>

      <label>
        <span>Name</span>
        <input v-model="name"/>
      </label>

      <label>
        <span>Pronouns</span>
        <input v-model="pronouns" placeholder="they/them"/>
      </label>

      <label>
        <span>Lore</span>
        <textarea v-model="lore" rows="4"/>
      </label>

      <label>
        <span>Type</span>
        <select v-model="type">
          <option v-for="t in PANTHER_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </label>

      <button :disabled="!name" @click="submit">Begin Bond</button>
    </section>
  </div>
</template>

<style scoped>
.creator-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  image-rendering: pixelated;
  background: black;
}

.creator {
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: rgba(28, 28, 28, 0.85);
  border-radius: 12px;
  color: #f5f5f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.creator h1 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 0.95rem;
}

label span {
  margin-bottom: 0.3rem;
}

input,
textarea,
select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #444;
  background-color: #2c2c2c;
  color: #f5f5f5;
  font-size: 0.95rem;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #6b63ff;
  box-shadow: 0 0 5px rgba(107, 99, 255, 0.5);
}

button {
  margin-top: 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background-color: #6b63ff;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #574fd1;
}

.reduce-motion {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
