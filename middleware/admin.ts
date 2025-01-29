import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Check if user is admin
  if (!authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})