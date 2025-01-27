import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isActive: (state) => state.user?.status === 'active'
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        this.loading = true
        const { api } = useApi()
        const response = await api('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: { username: string; email: string; password: string }) {
      try {
        this.loading = true
        const { api } = useApi()
        const response = await api('/api/auth/register', {
          method: 'POST',
          body: userData
        })
        return response.data
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(idToken: string) {
      try {
        this.loading = true
        const { api } = useApi()
        const response = await api('/api/auth/google', {
          method: 'POST',
          body: { idToken }
        })
        
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        
        return response.data
      } catch (error) {
        console.error('Google login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return false

        this.token = token
        const { authApi } = useApi()
        const response = await authApi('/api/auth/me')
        this.user = response.data
        return true
      } catch (error) {
        this.logout()
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      navigateTo('/login')
    }
  }
})