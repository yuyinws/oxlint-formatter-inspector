<script setup lang=ts>
import { connect, connectionState } from './composables/rpc'

connect()
</script>

<template>
  <div v-if="connectionState.error" class="text-red-500">
    {{ connectionState.error }}
  </div>
  <VisualLoading v-else-if="!connectionState.connected" text="Connecting..." />
  <div v-else class="h-screen">
    <UApp>
      <NuxtPage />
    </UApp>
  </div>
</template>
