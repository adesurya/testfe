export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Cek apakah user sudah login
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login', { 
      query: { 
        redirect: to.fullPath 
      }
    })
  }

  // Jika sudah login dan mencoba akses login page, redirect ke dashboard
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})