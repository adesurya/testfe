<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <template v-if="loading">
          <LoadingSpinner text="Checking payment status..." />
        </template>
        
        <template v-else-if="status === 'completed'">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
          <h2 class="mt-4 text-2xl font-bold text-gray-900">Payment Successful</h2>
          <p class="mt-2 text-gray-500">Your plan has been activated successfully.</p>
          <button
            @click="router.push('/dashboard')"
            class="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </template>

        <template v-else>
          <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
          <h2 class="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
          <p class="mt-2 text-gray-500">{{ errorMessage || 'Something went wrong with your payment.' }}</p>
          <button
            @click="router.push('/plans')"
            class="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Try Again
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()

const loading = ref(true)
const status = ref(null)
const errorMessage = ref('')

onMounted(async () => {
  const { orderId } = route.query
  
  if (!orderId) {
    status.value = 'failed'
    errorMessage.value = 'Invalid payment session'
    loading.value = false
    return
  }

  try {
    const response = await planStore.checkPaymentStatus(orderId)
    status.value = response.status
  } catch (error) {
    status.value = 'failed'
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
})
</script>