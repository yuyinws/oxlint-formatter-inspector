import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'node/index.ts',
    dirs: 'dirs.ts',
  },
  target: 'esnext',
  dts: true,
  clean: false,
  inputOptions: {
    experimental: {
      resolveNewUrlToAsset: false,
    },
  },
})
