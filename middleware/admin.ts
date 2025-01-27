export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})