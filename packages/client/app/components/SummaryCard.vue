<script setup lang="ts">
import type { Summary } from '~~/types'

interface Props {
  summary: Summary
  totalIssues: number
  version: string
  config: object | null
}

defineProps<Props>()
</script>

<template>
  <div class="my-3 flex flex-col gap-2">

    <div class="flex gap-2 flex-wrap">
      <NuxtLink :to="`https://github.com/oxc-project/oxc/releases/tag/oxlint_v${version}`" external target="_blank"
        class="summary-card hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
        <u-icon name="ph:anchor" class="w-5 h-5" />
        <span class="text-sm">Oxlint Version</span>

        <span class="font-medium ml-1">{{ version }}</span>
      </NuxtLink>

      <UModal title="Oxlint Config" :ui="{ content: 'max-w-2xl' }">
        <div class="summary-card hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <u-icon name="ph:gear" class="w-5 h-5" />
          <span class="text-sm">Oxlint Config</span>
        </div>

        <template #body>
          <div v-if="config" class="w-200">
            <Shiki :code="JSON.stringify(config, null, 2)" ext=".json" />
          </div>
          <div v-else>
            <p class="text-sm text-gray-500">No config found</p>
          </div>
        </template>
      </UModal>


      <div class="summary-card">
        <u-icon name="ph:alarm" class="w-5 h-5" />
        <span class="text-sm">Generated at</span>

        <span class="font-medium ml-1">{{ new Date().toLocaleString() }}</span>
      </div>
    </div>


    <div class="flex w-full flex-wrap gap-2">
      <div class="summary-card">
        <u-icon name="ph-files" class="w-5 h-5" />
        <span class="text-sm">Files Checked</span>

        <span class="font-medium ml-1">{{ summary.number_of_files }}</span>
      </div>

      <div class="summary-card">
        <u-icon name="ph:line-segments" class="w-5 h-5" />
        <span class="text-sm">Threads</span>

        <span class="font-medium ml-1">{{ summary.threads_count }}</span>
      </div>

      <div class="summary-card">
        <u-icon name="ph:clock" class="w-5 h-5" />
        <span class="text-sm">Duration</span>

        <span class="font-medium ml-1">{{ (summary.start_time * 1000).toFixed(2) }}ms</span>
      </div>

      <div class="summary-card">
        <u-icon name="codicon:issues" class="w-5 h-5" />
        <span class="text-sm">Total Issues</span>

        <span class="font-medium ml-1">{{ totalIssues }}</span>
      </div>
    </div>

  </div>
</template>

<!-- <style scoped>
.summary-card {
  @apply border gap-1 border-gray-200 dark:border-red-900 rounded-sm px-2 py-1 flex items-center;
}
</style> -->
