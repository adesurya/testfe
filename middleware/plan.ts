export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip for login, register, plans pages and payment routes
  if (['/login', '/register', '/plans'].includes(to.path) || 
      to.path.startsWith('/payments/')) {
    return
  }

  const authStore = useAuthStore()

  // Skip for admin
  if (authStore.isAdmin) {
    return
  }

  try {
    const { authApi } = useApi()
    const response = await authApi(`/api/plans/user/${authStore.user?.id}`)

    // Pastikan kita mengakses data dengan benar dari response
    const plans = response.data || response
    
    // Cari plan yang aktif
    const activePlan = Array.isArray(plans) ? 
      plans.find(plan => plan.status === 'active') : null

    if (!activePlan) {
      return navigateTo('/plans')
    }
  } catch (error) {
    console.error('Error checking plan:', error)
    return navigateTo('/plans')
  }
})