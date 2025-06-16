import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  onSuccess: 'nr --filter client-app build',
})
