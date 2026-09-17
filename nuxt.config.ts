import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: the deploy workflow sets NUXT_APP_BASE_URL at build time.
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

/** Prefix a public/ asset path with the app base URL. */
function withBase(path: string): string {
  return `${baseURL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // The timer is fully client-interactive and the alarm uses Tone.js
  // (browser-only AudioContext), so everything runs as a static SPA.
  ssr: false,

  devtools: { enabled: true },

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'GYM Interval Timer',
      meta: [{ name: 'apple-mobile-web-app-title', content: 'GYM Interval Timer' }],
      // Head links are not auto-prefixed with baseURL, so prefix them here.
      link: [
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: withBase('favicon-96x96.png') },
        { rel: 'icon', type: 'image/svg+xml', href: withBase('favicon.svg') },
        { rel: 'shortcut icon', href: withBase('favicon.ico') },
        { rel: 'apple-touch-icon', sizes: '180x180', href: withBase('apple-touch-icon.png') },
        { rel: 'manifest', href: withBase('site.webmanifest') },
      ],
    },
  },

  // Same injection order as the old src/main.ts.
  css: [
    '@fontsource/inter/300.css',
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    '~/assets/main.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // Extra safety for array and object lookups, but may have false positives.
        noUncheckedIndexedAccess: true,
      },
    },
    // .nuxt/tsconfig.node.json only includes nuxt.config.* by default — re-add the
    // root config files so `pnpm type-check` keeps covering them (relative to .nuxt/).
    nodeTsConfig: {
      include: ['../vitest.config.ts', '../playwright.config.ts', '../eslint.config.ts'],
    },
  },
})
