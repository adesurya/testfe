import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

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
        this.loading = true
        const { authApi } = useApi()
        const config = useRuntimeConfig()
        
        const baseUrl = config.public.appUrl || window.location.origin
        const backendURL = 'http://localhost:8000'
        const merchantOrderId = crypto.randomUUID()

        // Create payment with corrected redirect URL
        const response = await authApi('http://localhost:8000/api/payments/create', {
          method: 'POST',
          body: {
            planId: data.planId,
            paymentMethod: data.paymentMethod,
            merchantOrderId,
            // Use /payments/redirect instead of redirect.php
            returnUrl: `${baseUrl}/redirect`,
            callbackUrl: `${backendURL}/api/payments/callback`
          }
        })

        this.currentPayment = response
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkPaymentStatus(merchantOrderId: string) {
      try {
        const { authApi } = useApi()
        const response = await authApi(`/api/payments/status/${merchantOrderId}`)
        
        this.paymentStatus = response.data.status
        return response.data
      } catch (error) {
        console.error('Error checking payment status:', error)
        throw error
      }
    },

    async processReturn(params: { 
      merchantOrderId: string, 
      resultCode: string, 
      reference: string 
    }) {
      const status = {
        '00': 'success',
        '01': 'pending',
        '02': 'cancelled'
      }[params.resultCode] || 'failed'

      return {
        status,
        merchantOrderId: params.merchantOrderId,
        reference: params.reference
      }
    }
  }
})