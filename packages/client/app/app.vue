<script setup lang="ts">
import Shiki from '~~/components/Shiki.vue'

const { data } = await useFetch('/api/payload.json', {})

// 获取文件扩展名
function getFileExt(filename: string) {
  const ext = filename.split('.').pop()
  return ext ? `.${ext}` : ''
}

// 获取文件图标
function getFileIcon(filename: string) {
  const ext = getFileExt(filename)
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'vscode-icons:file-type-typescript'
    case '.js':
    case '.jsx':
      return 'vscode-icons:file-type-javascript'
    case '.vue':
      return 'vscode-icons:file-type-vue'
    case '.css':
      return 'vscode-icons:file-type-css'
    case '.json':
      return 'vscode-icons:file-type-json'
    case '.md':
      return 'vscode-icons:file-type-markdown'
    default:
      return 'vscode-icons:file-type-text'
  }
}

// 获取严重程度颜色
function getSeverityColor(severity: string) {
  switch (severity) {
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    default:
      return 'text-blue-500'
  }
}

// 计算错误标记的高度
function calculateErrorHeight(messages: any[]) {
  if (!messages || messages.length === 0)
    return 0

  // 计算所有 labels 的最大数量
  const maxLabels = Math.max(...messages.map(msg => msg.labels?.length || 0))

  // 每个 label 大约需要 2 行的高度（一行给指示器，一行给消息）
  // 每行约 20px 高度，加上一些间距
  return maxLabels > 0 ? maxLabels * 2 * 20 + 10 : 0
}
</script>

<template>
  <UApp>
    <main class="container mx-auto p-4">
      <!-- 摘要信息 -->
      <UCard v-if="data?.summary" class="mb-4">
        <template #header>
          <div class="flex items-center gap-2">
            <u-icon name="heroicons:information-circle" />
            <span>检查摘要</span>
          </div>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div class="text-neutral-500">
              检查文件数
            </div>
            <div class="font-mono">
              {{ data.summary.number_of_files }}
            </div>
          </div>
          <div>
            <div class="text-neutral-500">
              线程数
            </div>
            <div class="font-mono">
              {{ data.summary.threads_count }}
            </div>
          </div>
          <div>
            <div class="text-neutral-500">
              耗时
            </div>
            <div class="font-mono">
              {{ (data.summary.start_time * 1000).toFixed(2) }}ms
            </div>
          </div>
          <div>
            <div class="text-neutral-500">
              问题总数
            </div>
            <div class="font-mono">
              {{ data.files?.reduce((sum, file) => sum + file.lines.reduce((s, line) => s + line.messages.length, 0), 0)
                || 0 }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- 文件列表 -->
      <div v-if="data?.files" class="space-y-6">
        <UCard v-for="file in data.files" :key="file.filename">
          <template #header>
            <div class="flex items-center gap-2">
              <u-icon :name="getFileIcon(file.filename)" />
              <span class="text-neutral-700 cursor-pointer hover:underline font-mono">{{ file.filename }}</span>
            </div>
          </template>

          <div class="relative font-mono">
            <!-- 问题列表 -->
            <div v-if="file.lines.length > 0" class="space-y-4">
              <div v-for="lineData in file.lines" :key="`${file.filename}-${lineData.line}`" class="overflow-hidden">
                <div class="p-4">
                  <!-- 当前行代码 -->
                  <div class="flex gap-4 items-start">
                    <span class="text-neutral-500 font-mono text-sm relative top-[3px]">{{ lineData.line
                      }}</span>
                    <div class="flex-1">
                      <Shiki
:code="file.source.split('\n')[lineData.line - 1] || ''"
                        :ext="getFileExt(file.filename)"
/>

                      <div
class="flex relative text-neutral-400"
                        :style="{ minHeight: `${calculateErrorHeight(lineData.messages)}px` }"
>
                        <a
v-for="(label, totalLabelIndex) in lineData.messages
                          .flatMap(m => m.labels)
                          .sort((a, b) => a.span.column - b.span.column)" :key="totalLabelIndex" target="_blank"
                          :href="lineData.messages[totalLabelIndex]?.url"
                          class="absolute whitespace-pre hover:text-neutral-800 cursor-pointer"
                          :style="{ left: `calc(${label.span.column - 1}ch)` }"
>
                          <div>
                            <span v-for="i in Math.floor((label.span.length - 1) / 2)" :key="`pre-${i}`">─</span>┬<span
                              v-for="i in Math.ceil((label.span.length - 1) / 2)" :key="`post-${i}`"
>─</span>
                          </div>
                          <div
v-for="i in (lineData.messages.flatMap(m => m.labels).length - 1 - totalLabelIndex)"
                            :key="`bar-${i}`" class="relative"
                            :style="{ left: `calc(${Math.floor((label.span.length - 1) / 2) - 1}ch)` }"
>
                            │
                          </div>
                          <div
v-if="label.label" class="relative flex"
                            :style="{ left: `calc(${Math.floor((label.span.length - 1) / 2) - 1}ch)` }"
>
                            <div>
                              ╰─
                            </div>
                            <UTooltip
:delay-duration="100" :content="{ side: 'top' }"
                              :disable-hoverable-content="false" :ui="{ content: 'py-3 px-4 h-auto' }"
>
                              <template #content>
                                <div>
                                  <div
class="flex items-center gap-1 text-[16px]"
                                    :class="getSeverityColor(lineData.messages[totalLabelIndex]?.severity || 'warning')"
>
                                    <u-icon
                                      :name="lineData.messages[totalLabelIndex]?.severity === 'error' ? 'radix-icons:cross-2' : 'radix-icons:exclamation-triangle'"
/>
                                    <div>{{ lineData.messages[totalLabelIndex]?.code }}</div>
                                  </div>

                                  <div
v-if="lineData.messages[totalLabelIndex]?.message"
                                    class="text-sm text-neutral-600"
>
                                    {{ lineData.messages[totalLabelIndex]?.message }}
                                  </div>

                                  <div
v-if="lineData.messages[totalLabelIndex]?.help"
                                    class="text-xs text-neutral-600 mt-1"
>
                                    💡 {{ lineData.messages[totalLabelIndex]?.help }}
                                  </div>

                                </div>
                              </template>
                              <div>{{ label.label }}</div>
                            </UTooltip>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="!data" class="flex items-center justify-center py-12">
        <div class="text-center">
          <u-icon name="heroicons:arrow-path" class="w-8 h-8 mx-auto mb-2 animate-spin text-neutral-400" />
          <div class="text-neutral-500">
            正在加载 oxlint 结果...
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <u-icon name="heroicons:document-text" class="w-8 h-8 mx-auto mb-2 text-neutral-400" />
          <div class="text-neutral-500">
            没有找到任何文件
          </div>
        </div>
      </div>
    </main>
  </UApp>
</template>
