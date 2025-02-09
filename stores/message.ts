// stores/message.ts
import { defineStore } from 'pinia'

interface Message {
  id: number
  targetNumber: string
  content: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  createdAt: string
  media?: string
}

interface MessageState {
  messages: any[]
  loading: boolean
  error: string | null
}

interface BulkMessage {
  id: number
  targetNumbers: string[]
  message: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  totalMessages: number
  sentMessages: number
  failedMessages: number
  createdAt: string
}

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    loading: false,
    error: null
  }),

  actions: {
    async sendMessage(messageData: any) {
      try {
        this.loading = true
        const authStore = useAuthStore()
        
        if (!authStore.token) {
          throw new Error('Authentication token not found')
        }
    
        // Jika ada file gambar, gunakan FormData
        if (messageData.imagePath instanceof File) {
          const formData = new FormData()
          
          // Tambahkan setiap field secara individual
          formData.append('userId', messageData.userId)
          formData.append('targetNumber', messageData.targetNumber)
          formData.append('message', messageData.message)
          formData.append('delay', messageData.delay?.toString() || '0')
          formData.append('image', messageData.imagePath)
    
          console.log('Sending formData:', {
            userId: messageData.userId,
            targetNumber: messageData.targetNumber,
            message: messageData.message,
            delay: messageData.delay
          }) // Debug log
    
          const response = await $fetch('http://localhost:8000/api/messages/send', {
            method: 'POST',
            headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${authStore.token}`
            },
            body: formData
          })
    
          return response
        }
    
        // Jika tidak ada gambar, kirim sebagai JSON biasa
        const payload = {
          userId: messageData.userId,
          targetNumber: messageData.targetNumber,
          message: messageData.message,
          delay: messageData.delay || 0
        }
    
        const response = await $fetch('http://localhost:8000/api/messages/send', {
          method: 'POST',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: payload
        })
    
        return response
    
      } catch (error: any) {
        console.error('Send message error details:', error) // Debug log
        if (error.response) {
          return {
            success: false,
            error: error.response._data?.error || 'Server error occurred'
          }
        }
        return {
          success: false,
          error: error.message || 'An unexpected error occurred'
        }
      } finally {
        this.loading = false
      }
    },

    async sendBulkMessages(formData: FormData) {
      try {
        const authStore = useAuthStore()
        
        if (!authStore.token) {
          throw new Error('Authentication token not found')
        }
    
        // Debug log untuk FormData
        console.log('FormData entries:')
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value)
        }
    
        const response = await $fetch('http://localhost:8000/api/messages/bulk/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Accept': '*/*'
            // Note: Don't set Content-Type, it will be set automatically for FormData
          },
          body: formData
        })
    
        return response
    
      } catch (error: any) {
        console.error('Error sending bulk messages:', error)
        throw new Error(error.response?._data?.error || error.message || 'Failed to send bulk messages')
      }
    },

    async getBulkProgress(bulkId: string) {
      try {
        const { authApi } = useApi()
        const response = await authApi(`/api/messages/bulk/${bulkId}/status`)
        
        if (!response.success) {
          throw new Error(response.error || 'Failed to get bulk progress')
        }

        return response.data
      } catch (error: any) {
        console.error('Error checking bulk progress:', error)
        throw new Error(error.response?.data?.error || error.message || 'Failed to check bulk progress')
      }
    },

    async fetchMessages(params = {}) {
      try {
        this.loading = true
        const { authApi } = useApi()
        
        const response = await authApi('/api/messages', {
          params
        })

        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch messages')
        }

        this.messages = response.data
        return response.data

      } catch (error: any) {
        console.error('Error fetching messages:', error)
        throw new Error(error.response?.data?.error || error.message || 'Failed to fetch messages')
      } finally {
        this.loading = false
      }
    },

    async fetchBulkMessages(params = {}) {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/messages/bulk/history', {
          params
        })
        this.bulkMessages = response.data.bulkMessages
        return response.data
      } catch (error) {
        console.error('Error fetching bulk messages:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) // Fixed: Added closing brace here