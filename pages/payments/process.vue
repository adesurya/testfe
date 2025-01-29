<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="text-center">
            <template v-if="loading">
              <LoadingSpinner />
              <h2 class="mt-4 text-lg font-medium text-gray-900">
                Processing Payment
              </h2>
              <p class="mt-2 text-sm text-gray-500">
                Please wait while we process your payment...
              </p>
            </template>
  
            <template v-else-if="error">
              <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
              <h2 class="mt-4 text-lg font-medium text-gray-900">
                Payment Failed
              </h2>
              <p class="mt-2 text-sm text-gray-500">
                {{ error }}
              </p>
              <div class="mt-6">
                <button
                  @click="retryPayment"
                  class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Try Again
                </button>
              </div>
            </template>
  
            <template v-else>
              <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
              <h2 class="mt-4 text-lg font-medium text-gray-900">
                Payment Successful
              </h2>
              <p class="mt-2 text-sm text-gray-500">
                Your payment has been processed successfully.
              </p>
              <div class="mt-6">
                <button
                  @click="goToDashboard"
                  class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Go to Dashboard
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth']
  })
  
  const route = useRoute()
  const router = useRouter()
  const paymentStore = usePaymentStore()
  
  const loading = ref(true)
  const error = ref<string | null>(null)
  
  onMounted(async () => {
    const { orderId, status } = route.query
  
    if (!orderId) {
      router.push('/dashboard')
      return
    }
  
    try {
      // Verify payment status
      const response = await paymentStore.checkPaymentStatus(orderId as string)
      
      if (response.status === 'completed') {
        loading.value = false
      } else if (response.status === 'failed') {
        loading.value = false
        error.value = response.message || 'Payment processing failed'
      } else {
        // Payment still processing, poll for status
        startStatusPolling(orderId as string)
      }
    } catch (err) {
      loading.value = false
      error.value = 'An error occurred while processing your payment'
    }
  })
  
  function startStatusPolling(orderId: string) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await paymentStore.checkPaymentStatus(orderId)
        
        if (response.status === 'completed') {
          loading.value = false
          clearInterval(pollInterval)
        } else if (response.status === 'failed') {
          loading.value = false
          error.value = response.message || 'Payment processing failed'
          clearInterval(pollInterval)
        }
      } catch (err) {
        loading.value = false
        error.value = 'An error occurred while checking payment status'
        clearInterval(pollInterval)
      }
    }, 3000) // Poll every 3 seconds
  
    // Clear interval after 5 minutes
    setTimeout(() => {
      if (loading.value) {
        loading.value = false
        error.value = 'Payment verification timeout. Please contact support.'
        clearInterval(pollInterval)
      }
    }, 300000)
  }
  
  function retryPayment() {
    router.push({
      path: '/plans/purchase',
      query: { planId: route.query.planId }
    })
  }
  
  function goToDashboard() {
    router.push('/dashboard')
  }
  </script>