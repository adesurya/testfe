// middleware/plan.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip for login, register and plans pages
  if (['/login', '/register', '/plans', '/payments/status', '/payments/callback'].includes(to.path)) {
    return
  }

  const authStore = useAuthStore()
  const planStore = usePlanStore()

  // Skip for admin
  if (authStore.isAdmin) {
    return
  }

  try {
    const { authApi } = useApi()
    const response = await authApi(`/api/plans/user/${authStore.user?.id}`)
    const activePlan = response.find(plan => plan.status === 'active')

    if (!activePlan) {
      return navigateTo('/plans')
    }
  } catch (error) {
    console.error('Error checking plan:', error)
    return navigateTo('/plans')
  }
})