// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
    // Allow payment return and callback URLs without auth
    if (to.path.startsWith('/payments/return') || to.path.startsWith('/payments/callback')) {
      return
    }
    
  // Public routes
  if (['/login', '/register'].includes(to.path)) {
    if (authStore.isAuthenticated) {
      return navigateTo('/dashboard')
    }
    return
  }

  // Protected routes
  if (!authStore.isAuthenticated) {
    return navigateTo('/login', { 
      query: { redirect: to.fullPath }
    })
  }

  // Admin routes
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})