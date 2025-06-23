// 获取文件扩展名
export function getFileExt(filename: string) {
  const ext = filename.split('.').pop()
  return ext ? `.${ext}` : ''
}

// 获取文件图标
export function getFileIcon(filename: string) {
  const ext = getFileExt(filename)
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'vscode-icons:file-type-typescript'
    case '.js':
    case '.jsx':
      return 'vscode-icons:file-type-js'
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
export function calculateErrorHeight(messages: any[]) {
  if (!messages || messages.length === 0)
    return 0

  // 计算所有 labels 的最大数量
  const maxLabels = Math.max(...messages.map(msg => msg.labels?.length || 0))

  // 每个 label 大约需要 2 行的高度（一行给指示器，一行给消息）
  // 每行约 20px 高度，加上一些间距
  return maxLabels > 0 ? maxLabels * 3 * 20 + 15 : 0
}

// 跳转到编辑器
export function openInEditor(filename: string, line: number, column: number) {
  // 尝试使用 vscode:// 协议打开
  const vscodeUrl = `vscode://file/${encodeURIComponent(filename)}:${line}:${column}`
  window.open(vscodeUrl, '_blank')
}

// 处理 v-html 输入，将单引号中间的内容替换为带背景色
export function processLabelHtml(text: string) {
  if (!text)
    return ''

  // 匹配单引号和反引号中间的内容，并替换为带背景色的 span
  return text.replace(/['`]([^'`]+)['`]/g, '<span class="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-semibold">$1</span>')
}
