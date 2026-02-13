<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center -mt-20 min-h-screen font-mono">
    <visual-logo />
    <div class="flex gap-2 animate-pulse mt-10 items-center justify-center">
      <div class="i-svg-spinners-8-dots-rotate" />
      <span>{{ props.text ?? 'Loading...' }}</span>
    </div>
  </div>
</template>
