<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'
import PantherCanvas from '@/components/PantherCanvas.vue'

const {
  state,
  feed,
  playWith,
  getAge,
  timeAgo,
  PANTHER_TYPES,
} = inject('panther')

const otherPantherName = ref('')

/**
 * Reactive clock tick
 * Updating this forces recomputation of time-based displays
 */
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
    PANTHER_TYPES.find(t => t.value === state.panther.type)?.label ??
    'Mind Panther'
  )
})

const ageText = computed(() => {
  now.value // dependency trigger
  return getAge()
})

const lastFedText = computed(() => {
  now.value // dependency trigger
  return timeAgo(state.panther.lastFedAt)
})

function play() {
  playWith(otherPantherName.value)
  otherPantherName.value = ''
}
</script>

<template>
  <section class="panther-game">
    <header>
      <h1>{{ state.panther.name }}</h1>
      <p class="type">{{ pantherTypeLabel }}</p>
    </header>

    <!-- Canvas -->
    <PantherCanvas class="canvas" />

    <!-- Stats -->
    <div class="stats">
      <p>
        {{ state.panther.name }} has existed for {{ ageText }}.
      </p>

      <p>
        Last fed: {{ lastFedText }}
      </p>

      <p>
        Mood: {{ state.panther.mood }}
      </p>

      <p v-if="state.panther.lastPlayedWith">
        {{ state.panther.name }} last played with
        {{ state.panther.lastPlayedWith }}.
      </p>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button @click="feed">
        Feed
      </button>

      <div class="play">
        <input
          v-model="otherPantherName"
          placeholder="Other panther's name"
        />
        <button
          :disabled="!otherPantherName"
          @click="play"
        >
          Play
        </button>
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
