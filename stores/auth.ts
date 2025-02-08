// stores/auth.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(data) {
      // Data sekarang memiliki format yang sama dengan response dari backend
      this.token = data.token
      this.user = data.user

      // Simpan token di cookie
      const cookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
      cookie.value = data.token

      return true
    },

    logout() {
      this.user = null
      this.token = null
      
      // Clear cookie
      const cookie = useCookie('auth_token')
      cookie.value = null
      
      // Redirect to login
      navigateTo('/login')
    },

    async checkAuth() {
      try {
        const cookie = useCookie('auth_token')
        if (!cookie.value) {
          this.logout()
          return false
        }

        if (!this.user) {
          // Optionally fetch user data here if needed
          // const response = await $fetch('/api/auth/me', {
          //   headers: { Authorization: `Bearer ${cookie.value}` }
          // })
          // this.user = response.user
        }

        this.token = cookie.value
        return true
      } catch (error) {
        console.error('Check auth error:', error)
        this.logout()
        return false
      }
    }
  },

  persist: true
})