<script setup lang="ts">
const props = defineProps<{
  count: number
}>()
</script>

<template>
  <span v-for="i in props.count" :key="i">&nbsp;</span>
</template>
