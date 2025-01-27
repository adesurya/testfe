export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()
    const { authApi } = useApi()
  
    if (!authStore.isAdmin) {
      try {
        const userPlans = await authApi(`/api/plans/user/${authStore.user?.id}`)
        const hasActivePlan = userPlans.some(plan => plan.status === 'active')
        
        if (!hasActivePlan && to.path !== '/plans') {
          return navigateTo('/plans')
        }
      } catch (error) {
        console.error('Error checking plan:', error)
        return navigateTo('/plans')
      }
    }
  })