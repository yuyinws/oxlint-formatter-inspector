<script setup lang="ts">
import type { Summary } from '~~/types'

interface Props {
  summary: Summary
  totalIssues: number
}

defineProps<Props>()
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <div class="flex items-center gap-2">
        <u-icon name="heroicons:information-circle" />
        <span>检查摘要</span>
      </div>
    </template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <div class="text-neutral-500/50">
          检查文件数
        </div>
        <div class="font-mono">
          {{ summary.number_of_files }}
        </div>
      </div>
      <div>
        <div class="text-neutral-500/50">
          线程数
        </div>
        <div class="font-mono">
          {{ summary.threads_count }}
        </div>
      </div>
      <div>
        <div class="text-neutral-500/50">
          耗时
        </div>
        <div class="font-mono">
          {{ (summary.start_time * 1000).toFixed(2) }}ms
        </div>
      </div>
      <div>
        <div class="text-neutral-500/50">
          问题总数
        </div>
        <div class="font-mono">
          {{ totalIssues }}
        </div>
      </div>
    </div>
  </UCard>
</template>
