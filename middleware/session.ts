export default defineNuxtRouteMiddleware(async (to) => {
    const { authApi } = useApi()
    const messageRoutes = ['/dashboard/messages', '/dashboard/bulk-messages']
  
    if (messageRoutes.includes(to.path)) {
      try {
        // Check if user has active WhatsApp session
        const response = await authApi('/api/whatsapp/sessions/active')
        
        if (!response.data.hasActiveSession) {
          return navigateTo('/dashboard/sessions/bind?redirect=' + to.fullPath)
        }
      } catch (error) {
        console.error('Error checking WhatsApp session:', error)
        return navigateTo('/dashboard/sessions/bind')
      }
    }
  })