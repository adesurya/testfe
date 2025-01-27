import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    metrics: null,
    loading: false
  }),

  actions: {
    async fetchMetrics() {
      try {
        this.loading = true
        const { authApi } = useApi()
        const response = await authApi('/api/metrics')
        this.metrics = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching metrics:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUsers(params = {}) {
      const { authApi } = useApi()
      const response = await authApi('/api/users', { params })
      return response.data
    },

    async createUser(userData: any) {
      const { authApi } = useApi()
      const response = await authApi('/api/users', {
        method: 'POST',
        body: userData
      })
      return response.data
    },

    async updateUser(userId: number, userData: any) {
      const { authApi } = useApi()
      const response = await authApi(`/api/users/${userId}`, {
        method: 'PUT',
        body: userData
      })
      return response.data
    },

    async deleteUser(userId: number) {
      const { authApi } = useApi()
      await authApi(`/api/users/${userId}`, {
        method: 'DELETE'
      })
    },

    async generateReport(params = {}) {
      const { authApi } = useApi()
      const response = await authApi('/api/reports/transactions', {
        params
      })
      return response.data
    }
  }
})