export default defineNuxtConfig({
    modules: [
      '@pinia/nuxt',
      '@nuxtjs/tailwindcss',
      '@vueuse/nuxt'
    ],
    runtimeConfig: {
      public: {
        apiBase: process.env.NUXT_PUBLIC_API_BASE
      }
    },
    css: ['~/assets/css/main.css'],
    app: {
      head: {
        title: 'WhatsApp Marketing Dashboard',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
      }
    }
  })