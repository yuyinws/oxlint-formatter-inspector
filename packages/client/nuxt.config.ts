export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'static',
    output: {
      dir: '../oxlint-fi/dist/client',
    },
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 5555,
  },
  app: {
    head: {
      title: 'Oxlint Formatter Inspector',
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
    },
  },
})
