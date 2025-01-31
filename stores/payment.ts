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
    async createPayment(data: any) {
      try {
        const { authApi } = useApi()
        const config = useRuntimeConfig()
        
        // Get base URL from config
        const baseUrl = config.public.appUrl || window.location.origin

        // Create payment with correct return & callback URLs
        const response = await authApi('/api/payments/create', {
          method: 'POST',
          body: {
            ...data,
            returnUrl: `${baseUrl}/payments/return`, // Corrected return URL
            callbackUrl: `${baseUrl}/api/payments/callback` // API endpoint for callback
          }
        })

        this.currentPayment = response.data
        return response.data
      } catch (error) {
        console.error('Error creating payment:', error)
        throw error
      }
    },

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