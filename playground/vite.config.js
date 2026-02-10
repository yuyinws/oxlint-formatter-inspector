import { DevTools } from '@vitejs/devtools'
import { defineConfig } from 'vite'
import { DevToolsOxlint } from 'vite-plugin-devtools-oxlint'

export default defineConfig({
  plugins: [DevTools(), DevToolsOxlint()],
  build: {
    rolldownOptions: {
      debug: {},
    },
  },
})
