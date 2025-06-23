<script setup lang="ts">
import type { PayloadData } from '~~/types'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { isMatch } from 'picomatch'

const { data, pending } = await useFetch<PayloadData>('/api/payload.json', {})

// 计算问题总数
const totalIssues = computed(() => {
  if (!data.value?.files) { return 0 }
  return data.value.files.reduce((sum, file) =>
    sum + file.lines.reduce((s, line) => s + line.messages.length, 0), 0)
})

// 判断是否显示摘要
const showSummary = computed(() => !!data.value?.summary)

const search = ref('')

// 防抖的搜索值
const debouncedSearch = ref('')

// 使用 VueUse 的 useDebounceFn 创建防抖函数
const debouncedUpdateSearch = useDebounceFn((value: string) => {
  debouncedSearch.value = value
}, 300)

// 监听搜索值变化
watch(search, (newValue) => {
  debouncedUpdateSearch(newValue)
}, { immediate: true })


const filteredFiles = computed(() => {
  if (!data.value?.files) { return [] }

  const searchTerm = debouncedSearch.value.trim()

  // 如果搜索词为空，返回所有文件
  if (!searchTerm) {
    return data.value.files
  }

  // 尝试使用 picomatch 进行 glob 匹配
  try {
    return data.value.files.filter(file => isMatch(file.filename, searchTerm, { contains: true }))
  } catch (error) {
    // 如果 glob 模式无效，回退到简单的字符串包含匹配
    return data.value.files.filter(file => file.filename.includes(searchTerm))
  }
})

// 判断是否显示文件列表
const showFiles = computed(() => !!filteredFiles.value && filteredFiles.value.length > 0)


// 判断是否显示空状态
const showEmpty = computed(() => filteredFiles.value && (!filteredFiles.value.length || filteredFiles.value.length === 0))


// 计算布局类名
const layoutClass = computed(() => {
  if (layout.value === 'single') {
    return 'grid-cols-1'
  }
  return 'grid-cols-1 lg:grid-cols-2'
})

const layout = useLocalStorage<'single' | 'double'>('layout', 'double')
</script>

<template>
  <UApp>
    <div class="container mx-auto p-4">

      <AppHeader />

      <main>

        <!-- 摘要信息 -->
        <SummaryCard v-if="showSummary && data?.summary" :summary="data.summary" :total-issues="totalIssues"
          :version="data.version" :config="data.config" :timestamp="data.timestamp" />

        <!-- 搜索和布局控制区域 -->
        <div class="flex flex-col sm:flex-row gap-3 mb-3 items-start sm:items-center" v-if="totalIssues > 0">
          <Search v-model="search" class="flex-1" />
          <LayoutToggle v-model="layout" />
        </div>

        <!-- 文件列表 -->
        <div v-if="showFiles" :class="['grid gap-4', layoutClass]">
          <FileCard v-for="file in filteredFiles" :key="file.filename" :file="file" />
        </div>

        <!-- 加载状态 -->
        <LoadingState v-else-if="pending" />

        <CongratState v-else-if="totalIssues === 0" />

        <!-- 空状态 -->
        <EmptyState v-else-if="showEmpty" />
      </main>
    </div>

  </UApp>
</template>
