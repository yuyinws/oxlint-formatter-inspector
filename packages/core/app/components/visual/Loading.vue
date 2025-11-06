<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="p-10 h-full flex flex-col items-center justify-center">
    <VisualLogoBanner />
    <div class="flex gap-2 animate-pulse -mt-4 items-center justify-center">
      <div class="i-svg-spinners-8-dots-rotate" />
      <span>{{ props.text ?? 'Loading...' }}</span>
    </div>
  </div>
</template>
