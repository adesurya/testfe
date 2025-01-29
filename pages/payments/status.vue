<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="space-y-6">
            <div class="text-center">
              <h2 class="text-2xl font-bold text-gray-900">
                Payment Status
              </h2>
            </div>
  
            <!-- Payment Details -->
            <div class="bg-gray-50 rounded-lg p-4">
              <dl class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ payment.orderId }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Amount</dt>
                  <dd class="mt-1 text-sm text-gray-900">${{ payment.amount }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(payment.createdAt) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1">
                    <StatusBadge :status="payment.status" />
                  </dd>
                </div>
              </dl>
            </div>
  
            <!-- Status Message -->
            <div class="text-center">
              <template v-if="payment.status === 'completed'">
                <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
                <h3 class="mt-2 text-lg font-medium text-gray-900">
                  Payment Successful
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Your plan has been activated successfully.
                </p>
              </template>
  
              <template v-else-if="payment.status === 'pending'">
                <ClockIcon class="mx-auto h-12 w-12 text-yellow-500" />
                <h3 class="mt-2 text-lg font-medium text-gray-900">
                  Payment Pending
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Your payment is being processed. This may take a few minutes.
                </p>
              </template>
  
              <template v-else-if="payment.status === 'failed'">
                <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
                <h3 class="mt-2 text-lg font-medium text-gray-900">
                  Payment Failed
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  {{ payment.errorMessage || 'An error occurred during payment processing.' }}
                </p>
              </template>
            </div>
  
            <!-- Actions -->
            <div class="flex justify-center space-x-4">
              <button
                v-if="payment.status === 'failed'"
                @click="retryPayment"
                class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Try Again
              </button>
  
              <button
                v-if="payment.status === 'completed'"
                @click="goToDashboard"
                class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </button>
  
              <button
                @click="contactSupport"
                class="inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Contact Support
              </button>
            </div>
  
            <!-- Support Info -->
            <div v-if="showSupportInfo" class="mt-6 text-center">
              <p class="text-sm text-gray-500">
                For assistance, please contact our support team:
                <br>
                Email: support@example.com
                <br>
                Phone: +1 234 567 890
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    CheckCircleIcon, 
    XCircleIcon,
    ClockIcon 
  } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth']
  })
  
  const route = useRoute()
  const router = useRouter()
  const paymentStore = usePaymentStore()
  
  const payment = ref({
    orderId: '',
    amount: 0,
    status: 'pending',
    createdAt: '',
    errorMessage: ''
  })
  
  const showSupportInfo = ref(false)
  
  onMounted(async () => {
    const { orderId } = route.query
  
    if (!orderId) {
      router.push('/dashboard')
      return
    }
  
    try {
      const response = await paymentStore.getPaymentDetails(orderId as string)
      payment.value = response
      
      if (response.status === 'pending') {
        startStatusPolling(orderId as string)
      }
    } catch (error) {
      console.error('Error loading payment details:', error)
    }
  })
  
  let pollInterval: number | null = null
  
  function startStatusPolling(orderId: string) {
    pollInterval = setInterval(async () => {
      try {
        const response = await paymentStore.checkPaymentStatus(orderId)
        payment.value = response
        
        if (['completed', 'failed'].includes(response.status)) {
          clearInterval(pollInterval!)
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        clearInterval(pollInterval!)
      }
    }, 5000)
  }
  
  onUnmounted(() => {
    if (pollInterval) {
      clearInterval(pollInterval)
    }
  })
  
  function retryPayment() {
    router.push({
      path: '/plans/purchase',
      query: { planId: route.query.planId }
    })
  }
  
  function goToDashboard() {
    router.push('/dashboard')
  }
  
  function contactSupport() {
    showSupportInfo.value = true
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }
  </script>