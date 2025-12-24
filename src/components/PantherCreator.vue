<script setup>
import { inject, ref } from 'vue'

const { createPanther, PANTHER_TYPES } = inject('panther')

const name = ref('')
const pronouns = ref('')
const lore = ref('')
const type = ref('mind')

function submit() {
  createPanther({
    name: name.value,
    pronouns: pronouns.value,
    lore: lore.value,
    type: type.value,
  })
}
</script>

<template>
  <section>
    <h1>Create Your Mind Panther</h1>

    <label>
      Name
      <input v-model="name" />
    </label>

    <label>
      Pronouns
      <input v-model="pronouns" placeholder="they/them" />
    </label>

    <label>
      Lore
      <textarea v-model="lore" />
    </label>

    <label>
      Type
      <select v-model="type">
        <option
          v-for="t in PANTHER_TYPES"
          :key="t.value"
          :value="t.value"
        >
          {{ t.label }}
        </option>
      </select>
    </label>

    <button :disabled="!name" @click="submit">
      Begin Bond
    </button>
  </section>
</template>
