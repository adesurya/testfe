# pages/plans/index.vue
<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p class="mt-4 text-lg text-gray-500">
          Select a plan that suits your messaging needs
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mt-12 flex justify-center">
        <LoadingSpinner text="Loading plans..." />
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-12 text-center text-red-600">
        {{ error }}
      </div>

      <!-- Plans Grid -->
      <div v-if="!loading && !error" class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="plan in plans" :key="plan.id" 
          class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <!-- Plan Header -->
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
              <div class="mt-4">
                <span class="text-4xl font-extrabold text-gray-900">
                  Rp {{ formatNumber(plan.price) }}
                </span>
                <span class="text-gray-500">/{{ plan.durationDays }} days</span>
              </div>
            </div>

            <!-- Plan Features -->
            <div class="mt-6">
              <ul class="space-y-4">
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-green-500" />
                  <span class="ml-3 text-gray-500">{{ plan.messageLimit }} Messages</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-green-500" />
                  <span class="ml-3 text-gray-500">{{ plan.durationDays }} Days Validity</span>
                </li>
                <li class="flex items-center">
                  <CheckIcon class="h-5 w-5 text-green-500" />
                  <span class="ml-3 text-gray-500">WhatsApp API Access</span>
                </li>
              </ul>
            </div>

            <!-- Action Button -->
            <div class="mt-8">
              <button
                @click="selectPlan(plan)"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150"
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      v-if="showPaymentModal"
      :plan="selectedPlan"
      @close="showPaymentModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const loading = ref(true)
const error = ref(null)
const plans = ref([])
const showPaymentModal = ref(false)
const selectedPlan = ref(null)

// Format number to Indonesian format
function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

// Load plans on mount
onMounted(async () => {
  try {
    const { api } = useApi()
    const response = await api('/api/plans')
    
    if (response && response.data) {
      plans.value = response.data
    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error loading plans:', err)
    error.value = 'Failed to load plans. Please try again later.'
  } finally {
    loading.value = false
  }
})

// Handle plan selection
function selectPlan(plan) {
  selectedPlan.value = plan
  showPaymentModal.value = true
} 

// Handle payment success
function handlePaymentSuccess(data) {
  showPaymentModal.value = false
  
  // If we have a redirect URL, navigate to it
  if (data.redirectUrl) {
    window.location.href = data.redirectUrl
  } else {
    // Otherwise, redirect to dashboard
    router.push('/dashboard')
  }
}
</script>