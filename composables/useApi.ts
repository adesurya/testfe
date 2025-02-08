// composables/useApi.ts
import { UseFetchOptions } from '#app'

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const baseURL = config.public.apiBase

  const api = async (endpoint: string, options: any = {}) => {
    try {
      const response = await $fetch(endpoint, {
        baseURL,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      return response
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  const authApi = async (endpoint: string, options: any = {}) => {
    if (!authStore.token) {
      throw new Error('No authentication token')
    }

    return api(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authStore.token}`
      }
    })
  }

  return {
    api,
    authApi
  }
}