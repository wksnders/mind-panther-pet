import { reactive, watch, computed, onMounted, onUnmounted } from 'vue'
import {
  FOOD_STATES,
  PLAY_STATES,
  getNextFoodState,
  getNextPlayState,
} from '@/mood_state_machine'

const STORAGE_KEY = 'mind-panther'

export const PANTHER_TYPES = [
  { value: 'mind', label: 'Mind Panther' },
  { value: 'zombie', label: 'Zombie Mind Panther' },
  { value: 'skeletal', label: 'Skeletal Mind Panther' },
  { value: 'vampire', label: 'Vampire Mind Panther' },
  { value: 'ghost', label: 'Ghost Mind Panther' },
  { value: 'astral', label: 'Astral Mind Panther' },
  { value: 'fractal', label: 'Fractal Mind Panther' },
  { value: 'nightmare', label: 'Nightmare Mind Panther' },
  { value: 'mirrored', label: 'Mirrored Mind Panther' },
  { value: 'dead', label: 'Dead Mind Panther' },
  { value: 'forgotten', label: 'Forgotten Mind Panther' },
  { value: 'fostered', label: 'Fostered Mind Panther' },
]

function createDefaultPanther() {
  return {
    createdAt: null,
    name: '',
    pronouns: '',
    lore: '',
    type: 'mind',

    lastFedAt: null,
    lastPlayedAt: null,
    lastPlayedWith: '',

    foodState: FOOD_STATES.FULL,
    playState: PLAY_STATES.NEUTRAL,
    moods: [],
    hopefulAt: null,
    sleptAt: null,
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const parts = []

  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? 's' : ''}`)
    parts.push(`${months % 12} month${months % 12 !== 1 ? 's' : ''}`)
    parts.push(`${days % 30} day${days % 30 !== 1 ? 's' : ''}`)
  } else if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
    parts.push(`${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`)
    parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`)
  } else if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
    parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? 's' : ''}`)
    parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`)
  } else if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
    parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`)
  } else {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
  }

  return parts.slice(0, 3).join(', ')
}

function loadPanther() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return createDefaultPanther()
  try {
    const parsed = JSON.parse(raw)
    return { ...createDefaultPanther(), ...parsed }
  } catch {
    return createDefaultPanther()
  }
}

function loadSettings() {
  const raw = localStorage.getItem(`${STORAGE_KEY}-settings`)
  if (!raw) return { direction: 1, reduceMotion: false }
  try {
    return JSON.parse(raw)
  } catch {
    return { direction: 1, reduceMotion: false }
  }
}

function updateMoods(panther) {
  panther.foodState = getNextFoodState(panther.foodState, panther)
  panther.playState = getNextPlayState(panther.playState, panther)

  const moods = []
  if (panther.foodState !== FOOD_STATES.FULL) moods.push(panther.foodState)
  if (panther.playState !== PLAY_STATES.NEUTRAL) moods.push(panther.playState)
  panther.moods = moods
}

export function useMindPanther() {
  const pantherState = reactive({
    panther: loadPanther(),
    isCreated: !!loadPanther().createdAt,
    direction: loadSettings().direction,
    reduceMotion: loadSettings().reduceMotion,
  })

  function savePanther() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pantherState.panther))
    localStorage.setItem(
      `${STORAGE_KEY}-settings`,
      JSON.stringify({
        direction: pantherState.direction,
        reduceMotion: pantherState.reduceMotion,
      })
    )
  }

  watch(() => pantherState.panther, savePanther, { deep: true })
  watch(() => [pantherState.direction, pantherState.reduceMotion], savePanther)

  function createPanther({ name, pronouns, lore, type }) {
    pantherState.panther = {
      ...createDefaultPanther(),
      name,
      pronouns,
      lore,
      type: type ?? 'mind',
      createdAt: Date.now(),
      lastFedAt: Date.now(),
      lastPlayedAt: Date.now(),
    }
    updateMoods(pantherState.panther)
    pantherState.isCreated = true
  }

  function feed() {
    pantherState.panther.lastFedAt = Date.now()
    updateMoods(pantherState.panther)
  }

  function playWith(otherName) {
    pantherState.panther.lastPlayedAt = Date.now()
    pantherState.panther.lastPlayedWith = otherName
    updateMoods(pantherState.panther)
  }

  // Automatically update moods periodically
  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      if (!pantherState.isCreated) return
      updateMoods(pantherState.panther)
    }, 10_000)
  })
  onUnmounted(() => clearInterval(intervalId))

  function getAge() {
    if (!pantherState.panther.createdAt) return 'unknown'
    return formatDuration(Date.now() - pantherState.panther.createdAt)
  }

  function timeAgo(timestamp) {
    if (!timestamp) return 'never'
    return formatDuration(Date.now() - timestamp) + ' ago'
  }

  function setDirection(dir) {
    pantherState.direction = Math.sign(dir)
  }

  function setReduceMotion(enabled) {
    pantherState.reduceMotion = !!enabled
  }

  return {
    state: pantherState,
    PANTHER_TYPES,
    createPanther,
    feed,
    playWith,
    getAge,
    timeAgo,
    setDirection,
    setReduceMotion,
  }
}
