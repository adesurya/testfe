export default defineNuxtRouteMiddleware(async (to) => {
    const config = useRuntimeConfig()
    const { api } = useApi()
  
    // Skip maintenance check for admin routes
    if (to.path.startsWith('/admin')) {
      return
    }
  
    try {
      const response = await api('/api/system/status')
      
      if (response.data.maintenance.enabled) {
        return navigateTo('/maintenance', {
          query: {
            message: response.data.maintenance.message
          }
        })
      }
    } catch (error) {
      console.error('Error checking system status:', error)
    }
  })