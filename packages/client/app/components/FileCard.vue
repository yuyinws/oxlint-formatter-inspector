<script setup lang="ts">
import type { FileData } from '~~/types'
import { getFileIcon } from '~/composables/useFileUtils'

interface Props {
  file: FileData
}

const props = defineProps<Props>()

// 获取文件图标
const fileIcon = computed(() => getFileIcon(props.file.filename))
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <u-icon :name="fileIcon" />
        <span class="dark:text-neutral-300 text-neutral-700 cursor-pointer hover:underline font-mono">
          {{ file.filename }}
        </span>
      </div>
    </template>

    <div class="relative font-mono">
      <!-- 问题列表 -->
      <div v-if="file.lines.length > 0" class="space-y-4">
        <LineError v-for="lineData in file.lines" :key="`${file.filename}-${lineData.line}`" :line-data="lineData"
          :filename="file.filename" :source="file.source" />
      </div>
    </div>
  </UCard>
</template>
