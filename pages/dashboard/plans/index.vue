<template>
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Choose Your Plan</h2>
        <p class="mt-4 text-lg text-gray-500">
          Select a plan that suits your needs
        </p>
      </div>
  
      <!-- Current Plan Info (if exists) -->
      <div v-if="currentPlan" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-8">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">Current Plan: {{ currentPlan.name }}</h3>
              <p class="mt-2 text-gray-500">
                Messages Remaining: {{ currentPlan.messagesRemaining }}
              </p>
              <p class="text-sm text-gray-500">
                Expires: {{ formatDate(currentPlan.expiryDate) }}
              </p>
            </div>
            <StatusBadge :status="currentPlan.status" />
          </div>
        </div>
      </div>
  
      <!-- Available Plans -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div v-for="plan in availablePlans" :key="plan.id" 
          class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="px-6 py-8">
            <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
            <p class="mt-4 text-gray-500">{{ plan.description }}</p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900">${{ plan.price }}</span>
              <span class="text-base font-medium text-gray-500">/{{ plan.durationDays }} days</span>
            </p>
  
            <ul class="mt-6 space-y-4">
              <li v-for="feature in plan.features" :key="feature" 
                class="flex items-center">
                <CheckIcon class="flex-shrink-0 h-5 w-5 text-green-500" />
                <span class="ml-3 text-base text-gray-500">{{ feature }}</span>
              </li>
            </ul>
  
            <button
              @click="selectPlan(plan)"
              class="mt-8 w-full bg-green-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-green-700"
            >
              {{ currentPlan ? 'Upgrade Plan' : 'Get Started' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Payment Modal -->
      <Modal v-if="showPaymentModal" @close="showPaymentModal = false">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Complete Your Purchase
          </h3>
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900">Order Summary</h4>
              <p class="mt-2 text-gray-600">Plan: {{ selectedPlan?.name }}</p>
              <p class="text-gray-600">Price: ${{ selectedPlan?.price }}</p>
              <p class="text-gray-600">Duration: {{ selectedPlan?.durationDays }} days</p>
            </div>
  
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Payment Method</h4>
              <div class="grid grid-cols-2 gap-4">
                <button
                  v-for="method in paymentMethods"
                  :key="method.id"
                  @click="selectPaymentMethod(method)"
                  :class="[
                    'p-4 border rounded-lg text-center',
                    selectedPaymentMethod?.id === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-500'
                  ]"
                >
                  <img :src="method.icon" :alt="method.name" class="h-8 mx-auto mb-2">
                  <span class="text-sm font-medium text-gray-900">{{ method.name }}</span>
                </button>
              </div>
            </div>
  
            <button
              @click="processPayment"
              :disabled="processing || !selectedPaymentMethod"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {{ processing ? 'Processing...' : 'Pay Now' }}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth']
  })
  
  const { authApi } = useApi()
  const currentPlan = ref(null)
  const availablePlans = ref([])
  const showPaymentModal = ref(false)
  const selectedPlan = ref(null)
  const selectedPaymentMethod = ref(null)
  const processing = ref(false)
  
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit Card',
      icon: '/icons/credit-card.svg'
    },
    {
      id: 'transfer',
      name: 'Bank Transfer',
      icon: '/icons/bank-transfer.svg'
    }
  ]
  
  onMounted(async () => {
    await Promise.all([
      loadCurrentPlan(),
      loadAvailablePlans()
    ])
  })
  
  async function loadCurrentPlan() {
    try {
      const response = await authApi('/api/plans/current')
      currentPlan.value = response.data
    } catch (error) {
      console.error('Error loading current plan:', error)
    }
  }
  
  async function loadAvailablePlans() {
    try {
      const response = await authApi('/api/plans')
      availablePlans.value = response.data.map(plan => ({
        ...plan,
        features: [
          `${plan.messageLimit} messages`,
          'WhatsApp API Access',
          'Message Templates',
          'Basic Analytics',
          plan.price >= 50 ? 'Priority Support' : 'Standard Support'
        ]
      }))
    } catch (error) {
      console.error('Error loading plans:', error)
    }
  }
  
  function selectPlan(plan) {
    selectedPlan.value = plan
    showPaymentModal.value = true
  }
  
  function selectPaymentMethod(method) {
    selectedPaymentMethod.value = method
  }
  
  async function processPayment() {
    if (!selectedPlan.value || !selectedPaymentMethod.value) return
  
    try {
      processing.value = true
      const response = await authApi('/api/payments/create', {
        method: 'POST',
        body: {
          planId: selectedPlan.value.id,
          paymentMethod: selectedPaymentMethod.value.id
        }
      })
  
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl
      } else {
        showPaymentModal.value = false
        await loadCurrentPlan()
        showSuccessMessage('Payment processed successfully')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      showErrorMessage('Payment processing failed')
    } finally {
      processing.value = false
    }
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }
  
  function showSuccessMessage(message) {
    // Implement toast notification
  }
  
  function showErrorMessage(message) {
    // Implement toast notification
  }
  </script>