<script setup>
import { provide } from 'vue'
import { useMindPanther } from './composables/useMindPanther'

import PantherCreator from './components/PantherCreator.vue'
import PantherDashboard from './components/PantherDashboard.vue'

const panther = useMindPanther()
provide('panther', panther)
</script>

<template>
  <main>
    <PantherCreator v-if="!panther.state.isCreated" />
    <PantherDashboard v-else />
  </main>
</template>
