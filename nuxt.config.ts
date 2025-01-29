export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  ssr: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'WhatsApp Dashboard'
    },


  // Tambahkan konfigurasi asset
  app: {
    head: {
      title: 'WhatsApp Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // Configure image
  image: {
    dir: 'assets/images'
  },

  build: {
    transpile: ['vue-chartjs', 'chart.js']
  },

  compatibilityDate: '2025-01-29'
})