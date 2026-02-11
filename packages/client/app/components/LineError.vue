<script setup lang="ts">
import type { Label, LineData } from 'shared'
import { calculateErrorHeight, getFileExt, processLabelHtml } from '~/composables/useFileUtils'

interface Props {
  lineData: LineData
  filename: string
  source: string
}

const props = defineProps<Props>()

// 计算当前行的代码
const currentLineCode = computed(() => {
  const lines = props.source.split('\n')
  return lines[props.lineData.line - 1] || ''
})

// 获取文件扩展名
const fileExt = computed(() => getFileExt(props.filename))

// 计算错误标记高度
const errorHeight = computed(() => calculateErrorHeight(props.lineData.messages))

// 获取排序后的标签
const sortedLabels = computed(() => {
  return props.lineData.messages
    .flatMap(m => m.labels || [])
    .sort((a, b) => a.span.column - b.span.column)
})

// 获取标签对应的消息
function getMessageForLabel(column: number) {
  for (const message of props.lineData.messages) {
    if (message.labels) {
      for (const label of message.labels) {
        if (label.span.column === column) {
          return message
        }
      }
    }
  }
  return null
}

// 计算标签的垂直位置样式
function getLabelVerticalStyle(labelIndex: number, baseLeft = 0) {
  const label = sortedLabels.value[labelIndex]
  if (!label) {
    return { left: '0ch' }
  }

  return {
    left: `calc(${Math.floor((label.span.length - 1) / 2) + baseLeft}ch)`,
  }
}

// 生成标签指示器
function generateLabelIndicator(label: Label) {
  const preDashes = Math.floor((label.span.length - 1) / 2)
  const postDashes = Math.ceil((label.span.length - 1) / 2)

  return {
    preDashes: Array.from({ length: preDashes }, (_, i) => i),
    postDashes: Array.from({ length: postDashes }, (_, i) => i),
  }
}

function severityClass(severity: string | undefined) {
  if (severity === 'error') {
    return 'text-red-300 group-hover:text-red-600 dark:text-red-800 dark:group-hover:text-red-500'
  }

  return 'text-yellow-400 group-hover:text-yellow-600 dark:text-yellow-800 dark:group-hover:text-yellow-300'
}
</script>

<template>
  <div class="overflow-auto">
    <div class="p-4">
      <!-- 当前行代码 -->
      <div class="flex gap-4 items-start">
        <span class="text-neutral-500 font-mono text-sm relative top-[3px]">{{
          lineData.line
        }}</span>
        <div class="flex-1">
          <Shiki :code="currentLineCode" :ext="fileExt" />

          <div class="flex relative" :style="{ minHeight: `${errorHeight}px`, top: '-10px' }">
            <a
              v-for="(label, labelIndex) in sortedLabels"
              :key="labelIndex"
              target="_blank"
              :href="getMessageForLabel(label.span.column)?.url"
              class="absolute whitespace-pre text-neutral-300 dark:text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer group"
              :style="{ left: `calc(${label.span.column - 1}ch)` }"
            >
              <UTooltip
                :delay-duration="100"
                :disable-hoverable-content="false"
                :ui="{ content: 'py-4 px-5 h-auto max-w-sm' }"
              >
                <template #content>
                  <ErrorTooltip
                    v-if="getMessageForLabel(label.span.column)"
                    :message="getMessageForLabel(label.span.column)!"
                    :filename="filename"
                    :line="lineData.line"
                    :column="label.span.column"
                  />
                </template>
                <div>
                  <div>
                    <span v-for="i in generateLabelIndicator(label).preDashes" :key="`pre-${i}`"
                      >─</span
                    >
                    <span>┬</span>
                    <span v-for="i in generateLabelIndicator(label).postDashes" :key="`post-${i}`"
                      >─</span
                    >
                  </div>
                  <div
                    v-for="i in (sortedLabels.length - labelIndex - 1) * 2"
                    :key="`bar-${i}`"
                    class="relative"
                    :style="getLabelVerticalStyle(labelIndex, -1)"
                  >
                    │
                  </div>
                  <div class="relative flex" :style="getLabelVerticalStyle(labelIndex)">
                    <div>╰─</div>
                    <div
                      v-if="(label as any).label"
                      class="ml-1"
                      v-html="`${processLabelHtml((label as any).label)}.`"
                    />
                    <div
                      class="ml-1"
                      :class="severityClass(getMessageForLabel(label.span.column)?.severity)"
                    >
                      {{ getMessageForLabel(label.span.column)?.code }}
                    </div>
                  </div>
                </div>
              </UTooltip>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
