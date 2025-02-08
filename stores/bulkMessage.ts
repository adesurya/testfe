// stores/bulkMessage.ts
import { defineStore } from 'pinia'

export const useBulkMessageStore = defineStore('bulkMessage', {
  state: () => ({
    currentBulk: null,
    history: [],
    loading: false
  }),

  actions: {
    async sendBulkMessages({ type, data }) {
      try {
        this.loading = true
        const authStore = useAuthStore()

        console.log('Sending bulk messages with:', { type, data })

        // URL endpoint
        const url = 'http://localhost:8000/api/messages/bulk/send'
        
        // Headers
        const headers = {
          'Authorization': `Bearer ${authStore.token}`,
          'Accept': '*/*'
        }

        // Jika type adalah JSON
        if (type === 'json') {
          headers['Content-Type'] = 'application/json'
          
          const response = await $fetch(url, {
            method: 'POST',
            headers,
            body: data
          })

          console.log('JSON Response:', response)
          return response
        }
        
        // Jika type adalah FormData
        if (type === 'formData') {
          const response = await $fetch(url, {
            method: 'POST',
            headers,
            body: data
          })

          console.log('FormData Response:', response)
          return response
        }

      } catch (error: any) {
        console.error('Error in sendBulkMessages:', error)
        return {
          success: false,
          error: error.message || 'Failed to send bulk messages'
        }
      } finally {
        this.loading = false
      }
    }  
  }
})