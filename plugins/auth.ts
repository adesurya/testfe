export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()
    
    // Check auth status when app starts
    if (process.client) {
      await authStore.checkAuth()
    }
  })