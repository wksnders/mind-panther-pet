<script setup>
import { inject, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PantherCanvas from './PantherCanvas.vue'

const pantherStore = inject('panther')

const otherPantherName = ref('')
const now = ref(Date.now())
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const pantherTypeLabel = computed(() => {
  return (
    pantherStore.PANTHER_TYPES.find(t => t.value === pantherStore.state.panther.type)?.label ??
    'Mind Panther'
  )
})

const ageText = computed(() => {
  now.value
  return pantherStore.getAge()
})

const lastFedText = computed(() => {
  now.value
  return pantherStore.timeAgo(pantherStore.state.panther.lastFedAt)
})

function play() {
  pantherStore.playWith(otherPantherName.value)
  otherPantherName.value = ''
}

function goBackToCreator() {
  const confirmed = window.confirm(
    'Going back will overwrite your current Mind Panther. Are you sure?'
  )
  if (confirmed) {
    pantherStore.state.isCreated = false
  }
}


// Local reactive copies for direction and reduce motion
const direction = ref(pantherStore.state.direction)
const reduceMotion = ref(pantherStore.state.reduceMotion)

// Keep local copies synced with store
watch(() => pantherStore.state.direction, val => direction.value = val)
watch(() => pantherStore.state.reduceMotion, val => reduceMotion.value = val)
</script>

<template>
  <section class="panther-game">
      
      <button @click="goBackToCreator">Back to Creator</button>
    <header>
      <h1>{{ pantherStore.state.panther.name }}</h1>
      <p class="type">{{ pantherTypeLabel }}</p>
    </header>

    <PantherCanvas
      :direction="direction"
      :reduce-motion="reduceMotion"
    />

    <div class="stats">
      <p>{{ pantherStore.state.panther.name }} has existed for {{ ageText }}.</p>
      <p>Last fed: {{ lastFedText }}</p>
      <p>Mood: {{ pantherStore.state.panther.mood }}</p>
      <p v-if="pantherStore.state.panther.lastPlayedWith">
        {{ pantherStore.state.panther.name }} last played with {{ pantherStore.state.panther.lastPlayedWith }}.
      </p>
    </div>

    <div class="actions">
      <button @click="pantherStore.feed">Feed</button>
      <div class="play">
        <input v-model="otherPantherName" placeholder="Other panther's name" />
        <button :disabled="!otherPantherName" @click="play">Play</button>
      </div>
    </div>
  </section>
</template>


<style scoped>
.panther-game {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  text-align: center;
}

.type {
  opacity: 0.8;
  font-style: italic;
}

.canvas {
  align-self: center;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.play {
  display: flex;
  gap: 0.5rem;
}
</style>
