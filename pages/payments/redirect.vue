# pages/payments/redirect.vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-6">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <!-- Loading State -->
        <div v-if="loading" class="py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Processing your payment...</p>
        </div>

        <!-- Success State -->
        <template v-else-if="status === 'success'">
          <div class="w-12 h-12 rounded-full bg-green-100 mx-auto flex items-center justify-center">
            <CheckIcon class="h-6 w-6 text-green-600" />
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-900">Payment Successful!</h2>
          <p class="mt-2 text-gray-600">Your payment has been processed successfully.</p>
          
          <div class="mt-6 bg-gray-50 rounded-lg p-4 text-left">
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Transaction ID:</dt>
                <dd class="text-sm font-medium">{{ merchantOrderId }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Reference:</dt>
                <dd class="text-sm font-medium">{{ reference }}</dd>
              </div>
            </dl>
          </div>

          <button
            @click="goToDashboard"
            class="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </template>

        <!-- Failed State -->
        <template v-else>
          <div class="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center">
            <XMarkIcon class="h-6 w-6 text-red-600" />
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-900">Payment Failed</h2>
          <p class="mt-2 text-gray-600">{{ errorMessage }}</p>
          
          <button
            @click="goToPlans"
            class="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Try Again
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const status = ref(null)
const errorMessage = ref('')
const merchantOrderId = ref('')
const reference = ref('')

onMounted(async () => {
  try {
    // Get parameters from URL
    const params = {
      merchantOrderId: route.query.merchantOrderId,
      resultCode: route.query.resultCode,
      reference: route.query.reference
    }

    // Validate required parameters
    if (!params.merchantOrderId || !params.resultCode) {
      throw new Error('Invalid payment response')
    }

    // Store values for display
    merchantOrderId.value = params.merchantOrderId
    reference.value = params.reference

    // Check result code
    if (params.resultCode === '00') {
      status.value = 'success'
    } else if (params.resultCode === '01') {
      status.value = 'pending'
      errorMessage.value = 'Payment is still being processed'
    } else {
      status.value = 'failed'
      errorMessage.value = 'Payment was not successful'
    }
  } catch (error) {
    status.value = 'failed'
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
})

function goToDashboard() {
  router.push('/dashboard')
}

function goToPlans() {
  router.push('/plans')
}
</script>