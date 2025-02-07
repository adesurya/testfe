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
  state: (): MessageState => ({
    messages: [],
    loading: false,
    error: null
  }),

  actions: {
    async sendMessage(messageData: {
      targetNumber: string
      message: string
      imagePath?: File
      delay?: number
    }) {
      try {
        this.loading = true
        const { authApi } = useApi()
        
        // Create FormData for multipart/form-data request
        const formData = new FormData()
        formData.append('targetNumber', messageData.targetNumber)
        formData.append('message', messageData.message)
        formData.append('delay', String(messageData.delay || 5))

        if (messageData.imagePath) {
          formData.append('imagePath', messageData.imagePath)
        }

        const response = await authApi('/api/messages/send', {
          method: 'POST',
          body: formData
        })

        if (!response.success) {
          throw new Error(response.error || 'Failed to send message')
        }

        return response

      } catch (error: any) {
        console.error('Error sending message:', error)
        throw new Error(error.response?.data?.error || error.message || 'Failed to send message')
      } finally {
        this.loading = false
      }
    },

    async sendBulkMessages(messageData: {
      targetNumbers: string[]
      message: string
      baseDelay?: number
      intervalDelay?: number
    }) {
      try {
        this.loading = true
        const { authApi } = useApi()

        const payload = {
          targetNumbers: messageData.targetNumbers,
          message: messageData.message,
          baseDelay: messageData.baseDelay || 5,
          intervalDelay: messageData.intervalDelay || 5
        }

        const response = await authApi('/api/messages/bulk/send', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.success) {
          throw new Error(response.error || 'Failed to send bulk messages')
        }

        return response

      } catch (error: any) {
        console.error('Error sending bulk messages:', error)
        throw new Error(error.response?.data?.error || error.message || 'Failed to send bulk messages')
      } finally {
        this.loading = false
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
})