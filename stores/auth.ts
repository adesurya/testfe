import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        // Simulasi API call untuk testing
        console.log('Login credentials:', credentials)
        
        // Simulasi response
        const response = {
          data: {
            token: 'dummy_token',
            user: {
              id: 1,
              username: credentials.username,
              email: `${credentials.username}@example.com`,
              role: 'user'
            }
          }
        }

        this.token = response.data.token
        this.user = response.data.user

        // Gunakan cookie untuk menyimpan token
        const cookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        })
        cookie.value = response.data.token

        return response.data
      } catch (error: any) {
        throw new Error(error.message || 'Login failed')
      }
    },

    logout() {
      this.user = null
      this.token = null
      
      // Hapus cookie
      const cookie = useCookie('auth_token')
      cookie.value = null
      
      // Redirect ke login
      navigateTo('/login')
    },

    async checkAuth() {
      const cookie = useCookie('auth_token')
      if (!cookie.value) {
        this.user = null
        this.token = null
        return false
      }

      // Jika ada token di cookie, set state
      if (!this.token) {
        this.token = cookie.value
        // Simulasi user data
        this.user = {
          id: 1,
          username: 'user',
          email: 'user@example.com',
          role: 'user'
        }
      }

      return true
    }
  },

  persist: {
    key: 'auth-state'
  }
})