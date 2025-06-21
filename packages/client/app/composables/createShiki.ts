import css from '@shikijs/langs/css'
import javascript from '@shikijs/langs/javascript'
import json from '@shikijs/langs/json'
import json5 from '@shikijs/langs/json5'
import jsonc from '@shikijs/langs/jsonc'
import markdown from '@shikijs/langs/markdown'
import mdx from '@shikijs/langs/mdx'
import svelte from '@shikijs/langs/svelte'
import ts from '@shikijs/langs/ts'
import tsx from '@shikijs/langs/tsx'
import vue from '@shikijs/langs/vue'
import ThemeDark from '@shikijs/themes/vitesse-dark'
import ThemeLight from '@shikijs/themes/vitesse-light'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

export const createShiki = createHighlighterCoreSync({
  themes: [
    ThemeLight,
    ThemeDark,
  ],
  langs: [css, javascript, json, json5, jsonc, markdown, mdx, ts, tsx, vue, svelte],
  engine: createJavaScriptRegexEngine(),
})
