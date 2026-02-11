import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/types/index.ts', 'src/vite.ts'],
  dts: true,
  clean: true,
})
