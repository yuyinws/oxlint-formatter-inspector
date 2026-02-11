import { DevTools } from '@vitejs/devtools'
import { defineConfig } from 'vite'
import { DevToolsOxlint } from 'oxc-inspector/vite'

export default defineConfig({
  plugins: [DevTools(), DevToolsOxlint()],
  build: {
    rolldownOptions: {
      devtools: {}, // enable devtools mode
    },
  },
})
