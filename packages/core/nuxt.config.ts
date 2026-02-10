import { defineNuxtConfig } from 'nuxt/config'

const BASE = '/.devtools-oxlint/'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'static',
    output: {
      dir: 'dist',
    },
    routeRules: {
      '/': {
        prerender: true,
      },
      '/200.html': {
        prerender: true,
      },
      '/404.html': {
        prerender: true,
      },
      '/**': {
        prerender: false,
        // headers,
      },
    },
  },
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  icon: {
    clientBundle: {
      scan: {
        globInclude: ['app/**/*'],
      },
    },
  },
  devServer: {
    port: 5555,
  },
  app: {
    baseURL: BASE,
    head: {
      title: 'Oxlint Inspector',
      meta: [
        {
          name: 'description',
          content: 'An interactive tool to inspect Oxlint formatter on the browser.',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
      htmlAttrs: {
        lang: 'en',
        class: 'bg-dots',
      },
    },
  },
  ui: {
    fonts: false,
  },
  vite: {
    base: BASE,
  },
})
