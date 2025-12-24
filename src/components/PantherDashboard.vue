<script setup>
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'

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
  now.value
  return getAge()
})

const lastFedText = computed(() => {
  now.value
  return timeAgo(state.panther.lastFedAt)
})

function play() {
  playWith(otherPantherName.value)
  otherPantherName.value = ''
}
</script>

<template>
  <section>
    <h1>{{ state.panther.name }}</h1>
    <p class="type">{{ pantherTypeLabel }}</p>

    <!-- Stats -->
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

    <!-- Visual placeholder -->
    <div class="panther-visual">
      <em>[ Mind Panther Image / Canvas Placeholder ]</em>
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
