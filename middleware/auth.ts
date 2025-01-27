export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const publicPages = ['/login', '/register']

  if (!authStore.isAuthenticated && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})