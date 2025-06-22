<script setup lang="ts">
const layout = defineModel<'single' | 'double'>('modelValue')
</script>

<template>
  <div class="hidden lg:block">
    <div class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <UButton :color="layout === 'single' ? 'primary' : 'neutral'" :variant="layout === 'single' ? 'solid' : 'ghost'"
        size="sm" icon="i-lucide-layout-list" aria-label="单栏布局" @click="layout = 'single'" />
      <UButton :color="layout === 'double' ? 'primary' : 'neutral'" :variant="layout === 'double' ? 'solid' : 'ghost'"
        size="sm" icon="i-lucide-layout-grid" aria-label="双栏布局" @click="layout = 'double'" />
    </div>
  </div>
</template>
