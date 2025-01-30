// stores/auth.ts
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
        const { api } = useApi()
        const response = await api('/api/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (!response.token || !response.user) {
          throw new Error('Invalid response from server')
        }

        // Set token dan user data
        this.token = response.token
        this.user = response.user

        // Simpan token di cookie
        const cookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        })
        cookie.value = response.token

        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async checkAuth() {
      try {
        const cookie = useCookie('auth_token')
        if (!cookie.value || !this.user) {
          this.logout()
          return false
        }

        // Hanya update token jika sudah ada user data
        this.token = cookie.value
        return true
      } catch (error) {
        console.error('Auth check error:', error)
        this.logout()
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      
      const cookie = useCookie('auth_token')
      cookie.value = null
      
      navigateTo('/login')
    },

    // Function untuk register
    async register(data: { 
      username: string
      email: string
      password: string 
    }) {
      try {
        const { api } = useApi()
        const response = await api('/api/auth/register', {
          method: 'POST',
          body: data
        })
        return response
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    }
  },

  persist: true
})