import { defineStore } from 'pinia'

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
    error: null
  }),

  actions: {
    async fetchUserPlan(userId: string) {
      try {
        const { authApi } = useApi()
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
      try {
        this.loading = true;
        const { authApi } = useApi()
        const response = await authApi(`/api/whatsapp/sessions/${userId}`)
        // Pastikan kita mengambil data dari response dengan benar
        this.sessions = response || []
        return this.sessions
      } catch (error) {
        console.error('Error fetching sessions:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMessageHistory(userId: string) {
      try {
        const { authApi } = useApi()
        const response = await authApi(`/api/messages/history/${userId}`, {
          headers: {
            'Accept': 'application/json'
          }
        })
        return response.data || response
      } catch (error) {
        console.error('Error fetching message history:', error)
        throw error
      }
    },

    async fetchStats() {
      try {
        const { authApi } = useApi()
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