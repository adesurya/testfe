# pages/redirect.vue
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white shadow rounded-lg p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Processing your payment...</p>
        </div>

        <!-- Success State -->
        <div v-else-if="status === 'success'" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Payment Successful</h3>
          
          <!-- Transaction Details -->
          <div class="mt-4 bg-gray-50 rounded-lg p-4">
            <dl class="divide-y divide-gray-200">
              <div class="flex justify-between py-2">
                <dt class="text-sm text-gray-500">Transaction ID</dt>
                <dd class="text-sm font-medium text-gray-900">{{ merchantOrderId }}</dd>
              </div>
              <div class="flex justify-between py-2">
                <dt class="text-sm text-gray-500">Reference</dt>
                <dd class="text-sm font-medium text-gray-900">{{ reference }}</dd>
              </div>
            </dl>
          </div>

          <button
            @click="goToDashboard"
            class="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue to Dashboard
          </button>
        </div>

        <!-- Failed State -->
        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <XMarkIcon class="h-6 w-6 text-red-600" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Payment Failed</h3>
          <p class="mt-2 text-sm text-gray-500">{{ errorMessage }}</p>
          <button
            @click="goToPlans"
            class="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: 'auth'
})

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

    // Check result code from Duitku
    switch (params.resultCode) {
      case '00':
        status.value = 'success'
        break
      case '01':
        status.value = 'pending'
        errorMessage.value = 'Payment is still being processed'
        break
      case '02':
        status.value = 'failed'
        errorMessage.value = 'Payment was cancelled'
        break
      default:
        status.value = 'failed'
        errorMessage.value = 'Payment was not successful'
    }
  } catch (error) {
    console.error('Error processing payment:', error)
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