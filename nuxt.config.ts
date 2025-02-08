// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['jspdf', 'jspdf-autotable', 'marked', 'papaparse']
  },
  router: {
    middleware: ['auth'] // Middleware auth akan dijalankan untuk semua route
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],

  components: {
    dirs: [
      '~/components',
      '~/components/messages'
    ]
  },

  ui: {
    notifications: {
      // Notifications module options
      position: 'top-right',
      duration: 3000
    }
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },

  ssr: true,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'WhatsApp Dashboard',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      title: 'WhatsApp Dashboard',
      layoutTransition: { name: 'layout', mode: 'out-in' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },


  routeRules: {
    '/payments/callback': { ssr: false },
    '/payments/status': { ssr: false },
    '/payments/return': { ssr: false },
    '/redirect': { 
      ssr: false  // Disable SSR for redirect page
    }
  },

  build: {
    transpile: ['vue-chartjs', 'chart.js']
  },

  compatibilityDate: '2025-01-30'
})