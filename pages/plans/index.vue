<script setup>
import { ref, onMounted } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '~/stores/payment'

const router = useRouter()
const paymentStore = usePaymentStore()

// States
const loading = ref(true)
const error = ref(null)
const plans = ref([])
const showPaymentModal = ref(false)
const selectedPlan = ref(null)
const selectedMethod = ref(null)
const processing = ref(false)

// Define Duitku payment methods
const paymentMethods = [
  { id: 'BC', name: 'Credit Card / Debit Card' },
  { id: 'M2', name: 'Mandiri VA' },
  { id: 'BT', name: 'Permata Bank VA' },
  { id: 'B1', name: 'CIMB Niaga VA' },
  { id: 'A1', name: 'ATM Bersama' },
  { id: 'I1', name: 'BNI VA' },
  { id: 'BR', name: 'BRIVA' },
  { id: 'OV', name: 'OVO' },
  { id: 'SA', name: 'SHOPEE PAY' },
  { id: 'LQ', name: 'LINKAJA' }
]

// Format price to IDR
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price)
}

// Load plans on mount
onMounted(async () => {
  try {
    const { api } = useApi()
    const response = await api('/api/plans')
    
    if (response && response.data) {
      plans.value = response.data
      console.log('Plans loaded:', plans.value)
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
async function selectPlan(plan) {
  selectedPlan.value = plan
  showPaymentModal.value = true
}

// Process payment
async function processPayment() {
  if (!selectedPlan.value || !selectedMethod.value) {
    error.value = 'Please select a payment method'
    return
  }

  processing.value = true
  try {
    const { authApi } = useApi()
    const response = await authApi('/api/payments/create', {
      method: 'POST',
      body: {
        planId: selectedPlan.value.id,
        paymentMethod: selectedMethod.value.id,
        amount: selectedPlan.value.price
      }
    })

    if (response && response.paymentUrl) {
      // Redirect ke halaman pembayaran Duitku
      window.location.href = response.paymentUrl
    } else {
      throw new Error('Payment URL not received')
    }
  } catch (err) {
    console.error('Payment error:', err)
    error.value = 'Failed to process payment. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>

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
        <div class="flex items-center space-x-2">
          <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          <span>Loading plans...</span>
        </div>
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
                  {{ formatPrice(plan.price) }}
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
    <div v-if="showPaymentModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            
            <!-- Selected Plan Summary -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <p class="font-medium">{{ selectedPlan?.name }}</p>
              <p class="text-gray-500">{{ formatPrice(selectedPlan?.price) }}</p>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-4">
              <h4 class="font-medium text-gray-700">Select Payment Method</h4>
              <div class="grid gap-4">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="w-full p-4 border rounded-lg text-left hover:bg-gray-50 focus:outline-none"
                  :class="{'border-green-500 bg-green-50': selectedMethod?.id === method.id}"
                  @click="selectedMethod = method"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium">{{ method.name }}</span>
                    <CheckIcon 
                      v-if="selectedMethod?.id === method.id"
                      class="h-5 w-5 text-green-500" 
                    />
                  </div>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {{ error }}
            </div>

            <!-- Payment Button -->
            <div class="mt-6 space-y-3">
              <button
                @click="processPayment"
                :disabled="!selectedMethod || processing"
                class="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ processing ? 'Processing...' : 'Pay Now' }}
              </button>

              <button
                @click="showPaymentModal = false"
                class="w-full text-gray-500 hover:text-gray-700 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>