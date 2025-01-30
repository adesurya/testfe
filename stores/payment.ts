// stores/payment.ts
import { defineStore } from 'pinia'

interface PaymentState {
  currentPayment: any
  paymentStatus: string | null
  error: string | null
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    currentPayment: null,
    paymentStatus: null,
    error: null
  }),

  actions: {
    async checkPaymentStatus(merchantOrderId: string) {
      try {
        const { authApi } = useApi()
        const response = await authApi(`/api/payments/status/${merchantOrderId}`)
        
        this.paymentStatus = response.status
        return response
      } catch (error) {
        console.error('Error checking payment status:', error)
        throw error
      }
    },

    async processCallback(callbackData: any) {
      try {
        const { authApi } = useApi()
        const response = await authApi('/api/payments/callback', {
          method: 'POST',
          body: callbackData
        })
        return response
      } catch (error) {
        console.error('Error processing callback:', error)
        throw error
      }
    }
  }
})