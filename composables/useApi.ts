import { UseFetchOptions } from '#app'

export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const baseURL = config.public.apiBase

  // Common headers for all requests
  const headers = computed(() => ({
    'Content-Type': 'application/json',
    ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {})
  }))

  // Base fetch options
  const baseOptions: UseFetchOptions<any> = {
    baseURL,
    headers: headers.value,
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
    }
  }

  // Regular API calls
  const api = async (endpoint: string, options: UseFetchOptions<any> = {}) => {
    return await useFetch(endpoint, {
      ...baseOptions,
      ...options,
      headers: {
        ...baseOptions.headers,
        ...options.headers
      }
    })
  }

  // Authenticated API calls
  const authApi = async (endpoint: string, options: UseFetchOptions<any> = {}) => {
    if (!authStore.token) {
      throw new Error('No authentication token')
    }

    return await api(endpoint, options)
  }

  return {
    api,
    authApi
  }
}