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
    currentPlan: null as Plan | null,
    stats: null as UserStats | null,
    loading: false
  }),

  actions: {
    async fetchCurrentPlan() {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/plans/user/current')
        this.currentPlan = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching current plan:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/user/stats')
        this.stats = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching user stats:', error)
        throw error
      } finally {
        this.loading = false
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