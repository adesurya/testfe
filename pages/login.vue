<template>
  <div class="min-h-screen flex flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/register" class="font-medium text-green-600 hover:text-green-500">
          Register here
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-50 p-4 rounded-md">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    loading.value = true
    
    const response = await $fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      body: {
        username: form.value.username,
        password: form.value.password
      }
    })

    // Response langsung memiliki token dan user
    if (response.token && response.user) {
      // Update auth store dengan response langsung
      await authStore.login({
        token: response.token,
        user: response.user
      })
      
      // Redirect ke dashboard atau halaman redirect
      const redirectPath = route.query.redirect?.toString() || '/dashboard'
      await router.push(redirectPath)
    } else {
      throw new Error('Invalid server response')
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'Failed to login. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>