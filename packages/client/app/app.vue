<script setup lang="ts">
import type { PayloadData } from '~~/types'
import EmptyState from '~~/components/EmptyState.vue'
import FileCard from '~~/components/FileCard.vue'
import LoadingState from '~~/components/LoadingState.vue'
import SummaryCard from '~~/components/SummaryCard.vue'

const { data } = await useFetch<PayloadData>('/api/payload.json', {})

// 计算问题总数
const totalIssues = computed(() => {
  if (!data.value?.files)
    return 0
  return data.value.files.reduce((sum, file) =>
    sum + file.lines.reduce((s, line) => s + line.messages.length, 0), 0)
})

// 判断是否显示摘要
const showSummary = computed(() => !!data.value?.summary)

// 判断是否显示文件列表
const showFiles = computed(() => !!data.value?.files && data.value.files.length > 0)

// 判断是否显示加载状态
const showLoading = computed(() => !data.value)

// 判断是否显示空状态
const showEmpty = computed(() => data.value && (!data.value.files || data.value.files.length === 0))
</script>

<template>
  <UApp>
    <main class="container mx-auto p-4">
      <!-- 摘要信息 -->
      <SummaryCard v-if="showSummary && data?.summary" :summary="data.summary" :total-issues="totalIssues" />

      <!-- 文件列表 -->
      <div v-if="showFiles" class="space-y-6 grid grid-cols-2 gap-4">
        <FileCard v-for="file in data!.files" :key="file.filename" :file="file" />
      </div>

      <!-- 加载状态 -->
      <LoadingState v-else-if="showLoading" />

      <!-- 空状态 -->
      <EmptyState v-else-if="showEmpty" />
    </main>
  </UApp>
</template>
