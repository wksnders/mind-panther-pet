import { reactive, watch } from 'vue'

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

    mood: 'neutral',
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

export function useMindPanther() {
  const state = reactive({
    panther: loadFromStorage(),
    isCreated: false,
  })

  function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultPanther()

    try {
      return {
        ...createDefaultPanther(),
        ...JSON.parse(raw),
      }
    } catch {
      return createDefaultPanther()
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.panther))
  }

  watch(
    () => state.panther,
    saveToStorage,
    { deep: true }
  )

  function createPanther({ name, pronouns, lore, type }) {
    state.panther = {
      ...createDefaultPanther(),
      name,
      pronouns,
      lore,
      type: type ?? 'mind',
      createdAt: Date.now(),
      lastFedAt: Date.now(),
    }
    state.isCreated = true
  }

  function feed() {
    state.panther.lastFedAt = Date.now()
    state.panther.mood = 'happy'
  }

  function playWith(otherName) {
    state.panther.lastPlayedAt = Date.now()
    state.panther.lastPlayedWith = otherName
    state.panther.mood = 'happy'
  }

  function getAge() {
    if (!state.panther.createdAt) return 'unknown'
    return formatDuration(Date.now() - state.panther.createdAt)
  }

  function timeAgo(timestamp) {
    if (!timestamp) return 'never'
    return formatDuration(Date.now() - timestamp) + ' ago'
  }

  return {
    state,
    PANTHER_TYPES,
    createPanther,
    feed,
    playWith,
    getAge,
    timeAgo,
  }
}
