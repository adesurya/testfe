import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface Plan {
  id: number
  name: string
  messageLimit: number
  messagesRemaining: number
  expiryDate: string
  status: 'active' | 'inactive'
}

interface UserStats {
  totalMessages: number
  successfulMessages: number
  failedMessages: number
  successRate: number
  activeSessions: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserPlan(userId: string) {
      const { authApi } = useApi()
      try {
        const response = await authApi(`/api/plans/user/${userId}`, {
          headers: {
            'Accept': 'application/json'
          }
        })
        return response.data || response
      } catch (error) {
        console.error('Error fetching user plan:', error)
        throw error
      }
    },

    async fetchUserSessions(userId: string) {
      const { authApi } = useApi()
      try {
        const response = await authApi(`/api/whatsapp/sessions/${userId}`)
        return response.data || response
      } catch (error) {
        console.error('Error fetching user sessions:', error)
        throw error
      }
    },

    async fetchMessageHistory(userId: string, page = 1, limit = 10) {
      const { authApi } = useApi()
      try {
        const response = await authApi(`/api/messages/history/${userId}?page=${page}&limit=${limit}`, {
          headers: {
            'Accept': 'application/json'
          }
        })
        return response
      } catch (error) {
        console.error('Error fetching messages:', error)
        throw error
      }
    },

    async fetchBulkMessageHistory(userId: string, page = 1, limit = 10) {
      const { authApi } = useApi()
      try {
        const response = await authApi(`/api/messages/bulk/history/${userId}?page=${page}&limit=${limit}`)
        return response.data || []
      } catch (error) {
        console.error('Error fetching bulk messages:', error)
        throw error
      }
    },

    
    async exportMessageReport(userId: string) {
      const { authApi } = useApi()
      try {
        const response = await authApi(`/api/reports/messages/${userId}/export`, {
          responseType: 'blob'
        })
        return response
      } catch (error) {
        console.error('Error exporting report:', error)
        throw error
      }
    },

    async fetchStats() {
      const { authApi } = useApi()
      try {
        const response = await authApi('/api/user/stats')
        return response.data || response
      } catch (error) {
        console.error('Error fetching user stats:', error)
        throw error
      }
    },

    async updateProfile(profileData: { username: string; email: string }) {
      const { authApi } = useApi()
      const response = await authApi('/api/user/profile', {
        method: 'PUT',
        body: profileData
      })
      return response.data
    },

    async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
      const { authApi } = useApi()
      const response = await authApi('/api/user/password', {
        method: 'PUT',
        body: passwordData
      })
      return response.data
    }
  }
})