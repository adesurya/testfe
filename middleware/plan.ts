import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  // Skip plan check for admin users
  if (authStore.isAdmin) {
    return
  }

  // Skip plan check for plan-related routes
  const planRoutes = ['/plans', '/plans/purchase', '/plans/payment']
  if (planRoutes.includes(to.path)) {
    return
  }

  try {
    // Check if user has an active plan
    const currentPlan = await userStore.fetchCurrentPlan()
    
    if (!currentPlan || currentPlan.status !== 'active') {
      return navigateTo('/plans?redirect=' + to.fullPath)
    }

    // Check if user has exceeded message limit
    if (currentPlan.messagesRemaining <= 0) {
      return navigateTo('/plans/upgrade?reason=limit-exceeded')
    }
  } catch (error) {
    console.error('Error checking plan:', error)
    return navigateTo('/plans')
  }
})