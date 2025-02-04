<!-- pages/payments/return.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <!-- Loading State -->
          <div v-if="loading" class="py-6">
            <LoadingSpinner text="Processing your payment..." />
          </div>

          <!-- Success State -->
          <template v-else-if="status === 'success'">
            <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
            <h2 class="mt-4 text-xl font-bold text-gray-900">Payment Successful!</h2>
            <p class="mt-2 text-gray-600">Your plan has been activated successfully.</p>
            
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
              class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </template>

          <!-- Pending State -->
          <template v-else-if="status === 'pending'">
            <ClockIcon class="mx-auto h-12 w-12 text-yellow-500" />
            <h2 class="mt-4 text-xl font-bold text-gray-900">Payment Pending</h2>
            <p class="mt-2 text-gray-600">
              Your payment is being processed. Please wait while we confirm your payment.
            </p>
            <div class="mt-6">
              <button
                @click="checkStatus"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Check Status
              </button>
            </div>
          </template>

          <!-- Failed/Cancelled State -->
          <template v-else>
            <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
            <h2 class="mt-4 text-xl font-bold text-gray-900">
              {{ status === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed' }}
            </h2>
            <p class="mt-2 text-gray-600">
              {{ status === 'cancelled' ? 'Your payment was cancelled.' : 'There was an error processing your payment.' }}
            </p>
            <button
              @click="retryPayment"
              class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
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
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()

const loading = ref(true)
const status = ref(null)
const merchantOrderId = ref(null)
const reference = ref(null)

onMounted(async () => {
  // Get parameters from URL
  const params = {
    merchantOrderId: route.query.merchantOrderId,
    resultCode: route.query.resultCode,
    reference: route.query.reference
  }

  if (!params.merchantOrderId || !params.resultCode) {
    status.value = 'failed'
    loading.value = false
    return
  }

  try {
    const result = await paymentStore.processReturn(params)
    status.value = result.status
    merchantOrderId.value = result.merchantOrderId
    reference.value = result.reference
  } catch (error) {
    console.error('Error processing payment return:', error)
    status.value = 'failed'
  } finally {
    loading.value = false
  }
})

async function checkStatus() {
  loading.value = true
  try {
    const result = await paymentStore.checkPaymentStatus(merchantOrderId.value)
    if (result.status === 'completed') {
      status.value = 'success'
    } else if (result.status === 'failed') {
      status.value = 'failed'
    }
  } catch (error) {
    console.error('Error checking status:', error)
    status.value = 'failed'
  } finally {
    loading.value = false
  }
}

function goToDashboard() {
  router.push('/dashboard')
}

function retryPayment() {
  router.push('/plans')
}
</script>