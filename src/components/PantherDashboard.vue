<script setup>
import { inject, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PantherCanvas from './PantherCanvas.vue'

const pantherStore = inject('panther')

// Inputs
const otherPantherName = ref('')
const now = ref(Date.now())

// Direction and motion
const direction = ref(pantherStore.state.direction)
const reduceMotion = ref(pantherStore.state.reduceMotion)

// Editable fields
const pronouns = ref(pantherStore.state.panther.pronouns)
const lore = ref(pantherStore.state.panther.lore)

// Responsive canvas size
const canvasWidth = ref(Math.min(window.innerWidth - 80, 900))
const canvasHeight = ref(canvasWidth.value * 0.5)

// Computed labels
const pantherTypeLabel = computed(() => {
  return (
    pantherStore.PANTHER_TYPES.find(t => t.value === pantherStore.state.panther.type)?.label ??
    'Mind Panther'
  )
})

const ageText = computed(() => pantherStore.getAge())
const lastFedText = computed(() => pantherStore.timeAgo(pantherStore.state.panther.lastFedAt))
const moodText = computed(() => pantherStore.state.panther.moods.join(', '))

// Play action
function play() {
  pantherStore.playWith(otherPantherName.value)
  otherPantherName.value = ''
}

// Return to creator
function goBackToCreator() {
  const confirmed = window.confirm(
    'Going back will overwrite your current Mind Panther. Are you sure?'
  )
  if (confirmed) pantherStore.state.isCreated = false
}

// Update canvas size
function updateCanvasSize() {
  canvasWidth.value = Math.min(window.innerWidth - 80, 900)
  canvasHeight.value = canvasWidth.value * 0.5
}

// Watchers to sync local fields with store
watch(() => pantherStore.state.direction, val => direction.value = val)
watch(() => pantherStore.state.reduceMotion, val => reduceMotion.value = val)
watch(pronouns, val => pantherStore.state.panther.pronouns = val)
watch(lore, val => pantherStore.state.panther.lore = val)

// Auto-update "now" and moods
let intervalId = null
onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now()
    if (pantherStore.state.isCreated && pantherStore.updateMoods) {
      pantherStore.updateMoods(pantherStore.state.panther)
    }
  }, 1000)

  window.addEventListener('resize', updateCanvasSize)
})

onUnmounted(() => {
  clearInterval(intervalId)
  window.removeEventListener('resize', updateCanvasSize)
})
</script>



<template>
  <section class="panther-game">
    <button @click="goBackToCreator">Back to Creator</button>

    <header class="compact-header">
      <h1>{{ pantherStore.state.panther.name }}</h1>
      <p class="type">{{ pantherTypeLabel }}</p>
    </header>


    <PantherCanvas
      :initial-direction="direction"
      :initial-reduced-motion="reduceMotion"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    >
      <div class="controls-overlay">
        <button
          :class="{ active: direction === -1 }"
          :disabled="direction === -1"
          @click="direction = -1"
        >
          ◀
        </button>

        <button
          :class="{ active: direction === 1 }"
          :disabled="direction === 1"
          @click="direction = 1"
        >
          ▶
        </button>

        <label class="toggle">
          <input type="checkbox" v-model="reduceMotion" />
          Reduce motion
        </label>
      </div>
    </PantherCanvas>

    <!-- Character Sheet Layout -->
    <div class="character-sheet">
      <table>
        <tr>
          <th>Pronouns</th>
          <td>
            <input v-model="pronouns" placeholder="any/all" />
          </td>
        </tr>
        <tr>
          <th>Type</th>
          <td>{{ pantherTypeLabel }}</td>
        </tr>
        <tr>
          <th>Age</th>
          <td>{{ ageText }}</td>
        </tr>
        <tr>
          <th>Last Fed</th>
          <td>
            {{ lastFedText }}
            <button class="feed-btn" @click="pantherStore.feed">Feed</button>
          </td>
        </tr>
        <tr>
          <th>Mood</th>
          <td>{{ moodText }}</td>
        </tr>
        <tr v-if="pantherStore.state.panther.lastPlayedWith">
          <th>Last Played With</th>
          <td>{{ pantherStore.state.panther.lastPlayedWith }}</td>
        </tr>
        <tr>
          <th>Lore</th>
          <td>
            <textarea v-model="lore" rows="3" placeholder="Add lore..."></textarea>
          </td>
        </tr>
      </table>
    </div>

    <!-- Play With Other Panther Section -->
    <div class="play-section">
      <label for="otherPanther">Play with another panther:</label>
      <div class="play-group">
        <input
          id="otherPanther"
          v-model="otherPantherName"
          placeholder="Enter other panther's name"
        />
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
  gap: .5rem;
}

/* Compact header styles */
.compact-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.compact-header h1 {
  margin: 0;
  padding: 0;
}

.compact-header .type {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.7;
  font-style: italic;
}


.type {
  opacity: 0.8;
  font-style: italic;
}

.character-sheet table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.character-sheet th,
.character-sheet td {
  text-align: left;
  padding: 0.5rem;
  border-bottom: 1px solid #444;
}

.character-sheet th {
  width: 30%;
  opacity: 0.8;
  font-weight: 600;
}

.character-sheet td {
  width: 70%;
}

.character-sheet input,
.character-sheet textarea {
  width: 100%;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #666;
  background: #1a1a1a;
  color: #eee;
  font-size: 0.9rem;
}

.character-sheet textarea {
  resize: vertical;
}

/* Feed button inline with Last Fed */
.feed-btn {
  margin-left: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #eee;
  cursor: pointer;
  font-size: 0.85rem;
}

/* Play section styling */
.play-section {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.play-section label {
  font-weight: 600;
  font-size: 0.9rem;
}

.play-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.play-group input {
  flex: 1;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #666;
  background: #1a1a1a;
  color: #eee;
  font-size: 0.9rem;
}

.play-group button {
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #eee;
  cursor: pointer;
}

/* Controls overlay inside canvas */
.controls-overlay {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 10;
}

.controls-overlay button {
  padding: 0.4rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: #eee;
  cursor: pointer;
}

.controls-overlay button.active {
  background: #444;
}

.controls-overlay .toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #ccc;
}
</style>

