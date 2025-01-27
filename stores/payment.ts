import { defineStore } from 'pinia'

interface PaymentMethod {
  id: string
  name: string
  type: string
  icon: string
}

interface Payment {
  id: number
  amount: number
  status: 'pending' | 'completed' | 'failed'
  paymentMethod: string
  transactionId: string
  createdAt: string
}

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    availableMethods: [] as PaymentMethod[],
    payments: [] as Payment[],
    loading: false
  }),

  actions: {
    async fetchPaymentMethods(planId: number) {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi(`/api/payments/methods/${planId}`)
        this.availableMethods = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching payment methods:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPayment(paymentData: {
      planId: number
      paymentMethod: string
      amount: number
    }) {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/payments/create', {
          method: 'POST',
          body: paymentData
        })
        return response.data
      } catch (error) {
        console.error('Error creating payment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkPaymentStatus(merchantOrderId: string) {
      const { authApi } = useApi()
      const response = await authApi(`/api/payments/status/${merchantOrderId}`)
      return response.data
    },

    async fetchPaymentHistory(params = {}) {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/payments/history', {
          params
        })
        this.payments = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching payment history:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})