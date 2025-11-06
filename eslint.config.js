// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './packages/core/.nuxt/eslint.config.mjs'

export default antfu({
  pnpm: true,
  vue: true,
})
  .append(nuxt())
  .append({
    files: ['./packages/vite/src/node/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  })
