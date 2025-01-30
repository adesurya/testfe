<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="bg-white p-8 rounded-lg shadow">
          <div class="text-center">
            <!-- Loading State -->
            <div v-if="loading" class="py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p class="mt-4 text-gray-500">Verifying payment status...</p>
            </div>
  
            <!-- Success State -->
            <template v-else-if="status === 'success'">
              <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
              <h2 class="mt-4 text-xl font-bold text-gray-900">Payment Successful!</h2>
              <p class="mt-2 text-gray-600">Your plan has been activated successfully.</p>
              <button
                @click="redirectToDashboard"
                class="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Go to Dashboard
              </button>
            </template>
  
            <!-- Failed State -->
            <template v-else>
              <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
              <h2 class="mt-4 text-xl font-bold text-gray-900">Payment Failed</h2>
              <p class="mt-2 text-gray-600">{{ error }}</p>
              <button
                @click="redirectToPlans"
                class="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Try Again
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
  import { useRouter, useRoute } from 'vue-router'
  
  const router = useRouter()
  const route = useRoute()
  const loading = ref(true)
  const status = ref(null)
  const error = ref(null)
  
  onMounted(async () => {
    const { merchantOrderId, reference } = route.query
  
    if (!merchantOrderId) {
      status.value = 'error'
      error.value = 'Invalid payment session'
      loading.value = false
      return
    }
  
    try {
      const { authApi } = useApi()
      const response = await authApi(`/api/payments/status/${merchantOrderId}`)
  
      if (response && response.status === 'PAID') {
        status.value = 'success'
      } else {
        status.value = 'error'
        error.value = 'Payment verification failed. Please contact support.'
      }
    } catch (err) {
      console.error('Error checking payment:', err)
      status.value = 'error'
      error.value = 'Failed to verify payment status'
    } finally {
      loading.value = false
    }
  })
  
  function redirectToDashboard() {
    router.push('/dashboard')
  }
  
  function redirectToPlans() {
    router.push('/plans')
  }
  </script>