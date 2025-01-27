import { defineStore } from 'pinia'

interface Message {
  id: number
  targetNumber: string
  content: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  createdAt: string
  media?: string
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
    messages: [] as Message[],
    bulkMessages: [] as BulkMessage[],
    loading: false
  }),

  actions: {
    async sendMessage(messageData: {
      targetNumber: string
      message: string
      media?: File
      scheduleTime?: Date
    }) {
      try {
        this.loading = true
        const { authApi } = useApi()
        
        let formData = new FormData()
        formData.append('targetNumber', messageData.targetNumber)
        formData.append('message', messageData.message)
        
        if (messageData.media) {
          formData.append('media', messageData.media)
        }
        
        if (messageData.scheduleTime) {
          formData.append('scheduleTime', messageData.scheduleTime.toISOString())
        }

        const response = await authApi('/api/messages/send', {
          method: 'POST',
          body: formData
        })
        
        return response.data
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendBulkMessages(bulkData: {
      targetNumbers: string[]
      message: string
      baseDelay: number
      intervalDelay: number
    }) {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/messages/bulk/send', {
          method: 'POST',
          body: bulkData
        })
        return response.data
      } catch (error) {
        console.error('Error sending bulk messages:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMessages(params = {}) {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/messages/history', {
          params
        })
        this.messages = response.data.messages
        return response.data
      } catch (error) {
        console.error('Error fetching messages:', error)
        throw error
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