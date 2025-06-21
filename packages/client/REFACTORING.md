# 重构说明

## 重构概述

本次重构将原来的单一 `app.vue` 文件拆分为多个可复用的组件，并将逻辑从模板中移到 `<script>` 部分，提高了代码的可维护性和可读性。

## 组件结构

### 1. 主应用文件 (`app.vue`)
- **职责**: 应用入口，数据获取，状态管理
- **主要逻辑**:
  - 获取 oxlint 检查结果数据
  - 计算问题总数
  - 控制不同状态的显示逻辑

### 2. 摘要卡片组件 (`SummaryCard.vue`)
- **职责**: 显示检查摘要信息
- **功能**:
  - 显示检查文件数、线程数、耗时、问题总数
  - 响应式布局（2列/4列网格）

### 3. 文件卡片组件 (`FileCard.vue`)
- **职责**: 显示单个文件的检查结果
- **功能**:
  - 文件头部显示（图标 + 文件名）
  - 包含行错误列表

### 4. 行错误组件 (`LineError.vue`)
- **职责**: 显示单行代码的错误信息
- **功能**:
  - 代码高亮显示
  - 错误标记和指示器
  - 错误提示框

### 5. 错误提示框组件 (`ErrorTooltip.vue`)
- **职责**: 显示详细的错误信息
- **功能**:
  - 错误严重程度标识
  - 错误消息和帮助信息
  - 操作按钮（查看规则、打开编辑器）

### 6. 加载状态组件 (`LoadingState.vue`)
- **职责**: 显示数据加载状态

### 7. 空状态组件 (`EmptyState.vue`)
- **职责**: 显示无数据状态

## 工具函数

### 组合式函数 (`useFileUtils.ts`)
包含以下工具函数：
- `getFileExt()`: 获取文件扩展名
- `getFileIcon()`: 获取文件图标
- `calculateErrorHeight()`: 计算错误标记高度
- `openInEditor()`: 跳转到编辑器
- `processLabelHtml()`: 处理标签HTML

## 类型定义

### 共享类型 (`types/index.ts`)
定义了所有组件使用的TypeScript类型：
- `Label`: 错误标签
- `Message`: 错误消息
- `LineData`: 行数据
- `FileData`: 文件数据
- `Summary`: 摘要信息
- `PayloadData`: 完整数据结构

## 重构优势

1. **组件化**: 每个组件职责单一，易于维护和测试
2. **逻辑分离**: 将复杂的计算逻辑从模板移到 `<script>` 中
3. **类型安全**: 统一的类型定义，减少类型错误
4. **可复用性**: 组件可以在其他地方复用
5. **可读性**: 代码结构更清晰，易于理解

## 使用方式

重构后的应用使用方式与之前相同，但内部结构更加清晰：

```vue
<template>
  <UApp>
    <main class="container mx-auto p-4">
      <!-- 摘要信息 -->
      <SummaryCard v-if="showSummary" :summary="data.summary" :total-issues="totalIssues" />

      <!-- 文件列表 -->
      <div v-if="showFiles" class="space-y-6">
        <FileCard v-for="file in data.files" :key="file.filename" :file="file" />
      </div>

      <!-- 状态组件 -->
      <LoadingState v-else-if="showLoading" />
      <EmptyState v-else-if="showEmpty" />
    </main>
  </UApp>
</template>
```

## 注意事项

1. 所有组件都使用了 `~~/` 别名来引用项目根目录
2. 类型定义确保了类型安全
3. 计算属性用于优化性能
4. 组件间通过 props 传递数据，保持单向数据流
