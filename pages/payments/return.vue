<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="text-center">
            <template v-if="status === 'success'">
              <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
              <h2 class="mt-4 text-xl font-bold text-gray-900">Payment Successful!</h2>
              <p class="mt-2 text-gray-600">Your plan has been activated successfully.</p>
              
              <!-- Transaction Details -->
              <div class="mt-6 bg-gray-50 rounded-lg p-4 text-left">
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Transaction ID:</dt>
                    <dd class="font-medium text-gray-900">{{ merchantOrderId }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Reference:</dt>
                    <dd class="font-medium text-gray-900">{{ reference }}</dd>
                  </div>
                </dl>
              </div>
  
              <button
                @click="goToDashboard"
                class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Go to Dashboard
              </button>
            </template>
  
            <template v-else>
              <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
              <h2 class="mt-4 text-xl font-bold text-gray-900">Payment Failed</h2>
              <p class="mt-2 text-gray-600">{{ errorMessage }}</p>
              <button
                @click="retryPayment"
                class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
  import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
  import { ref, onMounted } from 'vue'
  
  const router = useRouter()
  const route = useRoute()
  
  // Get parameters from Duitku redirect
  const merchantOrderId = route.query.merchantOrderId
  const resultCode = route.query.resultCode
  const reference = route.query.reference
  
  // Check result code from Duitku
  // 00 = Success
  // 01 = Pending
  // 02 = Failed
  const status = ref(resultCode === '00' ? 'success' : 'failed')
  
  const errorMessage = computed(() => {
    if (!merchantOrderId) return 'Invalid payment session'
    if (resultCode === '01') return 'Payment is still pending'
    if (resultCode === '02') return 'Payment failed or was cancelled'
    if (resultCode !== '00') return 'Payment verification failed'
    return 'An error occurred during payment'
  })
  
  function goToDashboard() {
    router.push('/dashboard')
  }
  
  function retryPayment() {
    router.push('/plans')
  }
  </script>