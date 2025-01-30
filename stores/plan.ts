// stores/plan.ts
import { defineStore } from 'pinia'

interface Plan {
  id: number
  name: string
  messageLimit: number
  price: number
  durationDays: number
  description: string
  status: 'active' | 'inactive'
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plans: [] as Plan[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchPlans() {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/plans')
        this.plans = response
      } catch (error) {
        console.error('Error fetching plans:', error)
        this.error = 'Failed to load plans'
      } finally {
        this.loading = false
      }
    },

    async initiatePayment(planId: number, paymentMethod: string) {
      try {
        const { authApi } = useApi()
        const response = await authApi('/api/payments/create', {
          method: 'POST',
          body: {
            planId,
            paymentMethod
          }
        })
        return response
      } catch (error) {
        console.error('Error initiating payment:', error)
        throw error
      }
    },

    async checkPaymentStatus(orderId: string) {
      try {
        const { authApi } = useApi()
        const response = await authApi(`/api/payments/status/${orderId}`)
        return response
      } catch (error) {
        console.error('Error checking payment status:', error)
        throw error
      }
    }
  }
})