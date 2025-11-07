// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './packages/core/.nuxt/eslint.config.mjs'

export default antfu({
  pnpm: true,
  vue: true,
})
  .append(nuxt())
  .append({
    ignores: [
      'packages/core/fixtures/*',
      'README.md',
    ],
  })
