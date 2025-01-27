import { defineStore } from 'pinia'

export const useBulkMessageStore = defineStore('bulkMessage', {
  state: () => ({
    currentBulk: null,
    history: []
  }),

  actions: {
    async sendBulk(payload) {
      const { authApi } = useApi()
      const response = await authApi('/api/messages/bulk/send', {
        method: 'POST',
        body: payload
      })
      return response
    },

    async getBulkStatus(bulkId) {
      const { authApi } = useApi()
      return await authApi(`/api/messages/bulk/${bulkId}/status`)
    },

    async getBulkHistory(params = {}) {
      const { authApi } = useApi()
      const history = await authApi('/api/messages/bulk/history', {
        params
      })
      this.history = history
      return history
    }
  }
})