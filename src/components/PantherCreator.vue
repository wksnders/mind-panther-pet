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
  <section class="creator">
    <h1>Create Your Mind Panther</h1>

    <label>
      <span>Name</span>
      <input v-model="name" />
    </label>

    <label>
      <span>Pronouns</span>
      <input v-model="pronouns" placeholder="they/them" />
    </label>

    <label>
      <span>Lore</span>
      <textarea v-model="lore" rows="4" />
    </label>

    <label>
      <span>Type</span>
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

<style scoped>
.creator {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1c1c1c;
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
</style>
