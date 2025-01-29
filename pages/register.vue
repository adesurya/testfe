<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-green-600 hover:text-green-500">
            Sign in
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              v-model="form.username"
              id="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              :class="{ 'border-red-300': errors.username }"
            >
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              v-model="form.email"
              id="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              :class="{ 'border-red-300': errors.email }"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model="form.password"
              id="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              :class="{ 'border-red-300': errors.password }"
            >
          </div>
          <div>
            <label for="password_confirmation" class="sr-only">Confirm Password</label>
            <input
              v-model="form.password_confirmation"
              id="password_confirmation"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Confirm password"
              :class="{ 'border-red-300': errors.password_confirmation }"
            >
          </div>
        </div>

        <!-- Validation Errors -->
        <div v-if="hasErrors" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <XCircleIcon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="(error, field) in errors" :key="field">
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            v-model="form.terms_accepted"
            id="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            :class="{ 'border-red-300': errors.terms_accepted }"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            I agree to the
            <a href="#" class="font-medium text-green-600 hover:text-green-500">Terms of Service</a>
            and
            <a href="#" class="font-medium text-green-600 hover:text-green-500">Privacy Policy</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            :class="{ 'opacity-75 cursor-not-allowed': loading }"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserPlusIcon class="h-5 w-5 text-green-500 group-hover:text-green-400" />
            </span>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <!-- Social Registration -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleRegister"
              class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <!-- <img src="~/assets/google-logo.svg" alt="Google" class="h-5 w-5 mr-2"> -->
              Google
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserPlusIcon, XCircleIcon } from '@heroicons/vue/24/solid'

definePageMeta({
  middleware: 'guest'
})

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms_accepted: false
})

const loading = ref(false)
const errors = ref({})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

async function handleRegister() {
  try {
    loading.value = true
    errors.value = {}

    // Validate form
    if (!validateForm()) return

    await authStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })

    // Redirect to login with success message
    router.push('/login?registered=true')
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      errors.value = { general: 'Registration failed. Please try again.' }
    }
  } finally {
    loading.value = false
  }
}

function validateForm() {
  const newErrors = {}

  if (form.value.password !== form.value.password_confirmation) {
    newErrors.password_confirmation = 'Passwords do not match'
  }

  if (form.value.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  }

  if (!form.value.terms_accepted) {
    newErrors.terms_accepted = 'You must accept the terms and conditions'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

async function handleGoogleRegister() {
  try {
    const googleAuth = await initGoogleAuth()
    const response = await googleAuth.signIn()
    
    await authStore.loginWithGoogle(response.tokenId)
    router.push('/dashboard')
  } catch (err) {
    errors.value = { general: 'Google registration failed' }
  }
}

function initGoogleAuth() {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/platform.js'
      script.onload = () => {
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: process.env.GOOGLE_CLIENT_ID
          }).then(resolve, reject)
        })
      }
      document.head.appendChild(script)
    } catch (err) {
      reject(err)
    }
  })
}
</script>