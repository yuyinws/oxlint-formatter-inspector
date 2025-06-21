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

// 计算错误标记的高度
function calculateErrorHeight(messages: any[]) {
  if (!messages || messages.length === 0)
    return 0

  // 计算所有 labels 的最大数量
  const maxLabels = Math.max(...messages.map(msg => msg.labels?.length || 0))

  // 每个 label 大约需要 2 行的高度（一行给指示器，一行给消息）
  // 每行约 20px 高度，加上一些间距
  return maxLabels > 0 ? maxLabels * 2 * 20 + 15 : 0
}

// 跳转到编辑器
function openInEditor(filename: string, line: number, column: number) {
  // 尝试使用 vscode:// 协议打开
  const vscodeUrl = `vscode://file/${encodeURIComponent(filename)}:${line}:${column}`
  window.open(vscodeUrl, '_blank')
}

// 处理 v-html 输入，将单引号中间的内容替换为带背景色
function processLabelHtml(text: string) {
  if (!text)
    return ''

  // 匹配单引号和反引号中间的内容，并替换为带背景色的 span
  return text.replace(/['`]([^'`]+)['`]/g, '<span class="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-semibold">$1</span>')
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
            <div class="text-neutral-500/50">
              检查文件数
            </div>
            <div class="font-mono">
              {{ data.summary.number_of_files }}
            </div>
          </div>
          <div>
            <div class="text-neutral-500/50">
              线程数
            </div>
            <div class="font-mono">
              {{ data.summary.threads_count }}
            </div>
          </div>
          <div>
            <div class="text-neutral-500/50">
              耗时
            </div>
            <div class="font-mono">
              {{ (data.summary.start_time * 1000).toFixed(2) }}ms
            </div>
          </div>
          <div>
            <div class="text-neutral-500/50">
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
              <span class="dark:text-neutral-300 text-neutral-700 cursor-pointer hover:underline font-mono">{{
                file.filename }}</span>
            </div>
          </template>

          <div class="relative font-mono">
            <!-- 问题列表 -->
            <div v-if="file.lines.length > 0" class="space-y-4">
              <div v-for="lineData in file.lines" :key="`${file.filename}-${lineData.line}`" class="overflow-hidden">
                <div class="p-4">
                  <!-- 当前行代码 -->
                  <div class="flex gap-4 items-start">
                    <span class="text-neutral-500 font-mono text-sm relative top-[3px]">{{ lineData.line }}</span>
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
                          class="absolute whitespace-pre text-neutral-500/50 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                          :style="{ left: `calc(${label.span.column - 1}ch)` }"
>
                          <UTooltip
:delay-duration="100" :content="{ side: 'top' }" :disable-hoverable-content="false"
                            :ui="{ content: 'py-4 px-5 h-auto max-w-sm' }"
>
                            <template #content>
                              <div class="space-y-3">
                                <!-- 标题区域 -->
                                <div
                                  class="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800"
>
                                  <div
class="flex items-center gap-2 px-2 py-1 rounded-md text-sm font-medium" :class="lineData.messages[totalLabelIndex]?.severity === 'error'
                                    ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                    : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'"
>
                                    <u-icon
:name="lineData.messages[totalLabelIndex]?.severity === 'error'
                                      ? 'radix-icons:cross-2'
                                      : 'radix-icons:exclamation-triangle'" class="w-3.5 h-3.5"
/>
                                    <span class="font-mono">{{ lineData.messages[totalLabelIndex]?.code }}</span>
                                  </div>
                                </div>

                                <!-- 消息内容 -->
                                <div
v-if="lineData.messages[totalLabelIndex]?.message"
                                  class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                                  v-html="processLabelHtml(lineData.messages[totalLabelIndex]?.message)"
/>

                                <!-- 帮助信息 -->
                                <div
v-if="lineData.messages[totalLabelIndex]?.help"
                                  class="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100/50 dark:border-blue-900/50"
>
                                  <u-icon
name="heroicons:light-bulb"
                                    class="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0"
/>
                                  <div class="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
                                    {{ lineData.messages[totalLabelIndex]?.help }}
                                  </div>
                                </div>

                                <!-- 操作按钮 -->
                                <div
                                  class="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800"
>
                                  <!-- 跳转到规则 URL -->
                                  <a
v-if="lineData.messages[totalLabelIndex]?.url"
                                    :href="lineData.messages[totalLabelIndex]?.url" target="_blank"
                                    class="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs text-neutral-600 dark:text-neutral-400"
>
                                    <u-icon name="radix-icons:info-circled" class="w-3.5 h-3.5" />
                                    <span>Check rule</span>
                                  </a>

                                  <!-- 跳转到编辑器 -->
                                  <button
                                    class="flex items-center gap-1.5 cursor-pointer px-2 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs text-neutral-600 dark:text-neutral-400"
                                    @click="openInEditor(file.filename, lineData.line, label.span.column)"
>
                                    <u-icon name="radix-icons:open-in-new-window" class="w-3.5 h-3.5" />
                                    <span>Open in editor</span>
                                  </button>
                                </div>
                              </div>
                            </template>
                            <div>

                              <div>
                                <span
v-for="i in Math.floor((label.span.length - 1) / 2)"
                                  :key="`pre-${i}`"
>─</span>┬<span
v-for="i in Math.ceil((label.span.length - 1) / 2)"
                                  :key="`post-${i}`"
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
class="relative flex"
                                :style="{ left: `calc(${Math.floor((label.span.length - 1) / 2) - 1}ch)` }"
>
                                <div>
                                  ╰─
                                </div>

                                <div
                                  v-html="processLabelHtml((label as any).label || lineData.messages[totalLabelIndex]?.code)"
/>
                              </div>
                            </div>

                          </UTooltip>

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
