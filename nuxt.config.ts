export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  nitro: {
    preset: 'bun',
  },
  eslint: {
    config: {
      autoInit: true,
      standalone: false,
    },
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },
  css: ['@/assets/css/main.css'],
})
