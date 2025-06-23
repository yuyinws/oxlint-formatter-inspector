// @ts-check
import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    ignores: ['**/fixtures/**', '**/.specstory/**'],
    rules: {
      'no-console': 'off',
      // 'vue/html-indent': 'off',
    },
  },
  oxlint.configs['flat/recommended'],
)
