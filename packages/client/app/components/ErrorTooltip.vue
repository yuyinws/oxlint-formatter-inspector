<script setup lang="ts">
import type { Message } from '~~/types'
import { openInEditor, processLabelHtml } from '~/composables/useFileUtils'

interface Props {
  message: Message
  filename: string
  line: number
  column: number
}

const props = defineProps<Props>()

const severityClasses = computed(() => {
  return props.message.severity === 'error'
    ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
    : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
})

const severityIcon = computed(() => {
  return props.message.severity === 'error'
    ? 'radix-icons:cross-2'
    : 'radix-icons:exclamation-triangle'
})

function handleOpenInEditor() {
  $fetch('/api/launch', {
    query: {
      file: `${props.filename}:${props.line}:${props.column}`,
    },
  })
}
</script>

<template>
  <div class="space-y-3">
    <!-- 标题区域 -->
    <div class="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
      <div class="flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium" :class="severityClasses">
        <u-icon :name="severityIcon" class="w-3.5 h-3.5" />
        <span class="font-mono">{{ message.code }}</span>
      </div>
    </div>

    <!-- 消息内容 -->
    <div v-if="message.message" class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
      v-html="processLabelHtml(message.message)" />

    <!-- 帮助信息 -->
    <div v-if="message.help"
      class="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100/50 dark:border-blue-900/50">
      <u-icon name="heroicons:light-bulb" class="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
      <div class="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
        {{ message.help }}
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
      <!-- 跳转到规则 URL -->
      <a v-if="message.url" :href="message.url" target="_blank"
        class="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs text-neutral-600 dark:text-neutral-400">
        <u-icon name="radix-icons:info-circled" class="w-3.5 h-3.5" />
        <span>Rule details</span>
      </a>

      <!-- 跳转到编辑器 -->
      <button
        class="flex items-center gap-1.5 cursor-pointer px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs text-neutral-600 dark:text-neutral-400"
        @click="handleOpenInEditor">
        <u-icon name="radix-icons:open-in-new-window" class="w-3.5 h-3.5" />
        <span>Open in editor</span>
      </button>
    </div>
  </div>
</template>
