<template>
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          :class="[
            'p-4 border rounded-lg cursor-pointer',
            selectedMethod?.id === method.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
          ]"
          @click="selectMethod(method)"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <img :src="method.icon" :alt="method.name" class="h-8 w-8">
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ method.name }}</p>
              <p class="text-sm text-gray-500">{{ method.description }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Payment Form -->
      <div v-if="selectedMethod">
        <div v-if="selectedMethod.type === 'card'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              v-model="cardDetails.number"
              type="text"
              placeholder="1234 5678 9012 3456"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                v-model="cardDetails.expiry"
                type="text"
                placeholder="MM/YY"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CVV</label>
              <input
                v-model="cardDetails.cvv"
                type="text"
                placeholder="123"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>
          </div>
        </div>
  
        <div v-else-if="selectedMethod.type === 'bank_transfer'" class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900">Bank Transfer Instructions</h4>
            <ul class="mt-2 text-sm text-gray-600 space-y-2">
              <li>Bank Name: {{ selectedMethod.bankDetails.name }}</li>
              <li>Account Number: {{ selectedMethod.bankDetails.accountNumber }}</li>
              <li>Account Name: {{ selectedMethod.bankDetails.accountName }}</li>
            </ul>
          </div>
        </div>
  
        <button
          @click="processPayment"
          :disabled="processing"
          class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {{ processing ? 'Processing...' : 'Pay Now' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    amount: number
    planId: number
  }>()
  
  const emit = defineEmits<{
    (e: 'success', data: any): void
    (e: 'error', error: any): void
  }>()
  
  const { authApi } = useApi()
  
  const paymentMethods = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: '/icons/credit-card.svg'
    },
    {
      id: 'bank_transfer',
      type: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Pay via bank transfer',
      icon: '/icons/bank.svg',
      bankDetails: {
        name: 'Example Bank',
        accountNumber: '1234567890',
        accountName: 'WhatsApp Dashboard'
      }
    }
  ]
  
  const selectedMethod = ref(null)
  const processing = ref(false)
  const cardDetails = ref({
    number: '',
    expiry: '',
    cvv: ''
  })
  
  function selectMethod(method) {
    selectedMethod.value = method
  }
  
  async function processPayment() {
    try {
      processing.value = true
      const response = await authApi('/api/payments/create', {
        method: 'POST',
        body: {
          planId: props.planId,
          amount: props.amount,
          paymentMethod: selectedMethod.value.id,
          paymentDetails: selectedMethod.value.type === 'card' ? cardDetails.value : null
        }
      })
  
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl
      } else {
        emit('success', response.data)
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      emit('error', error)
    } finally {
      processing.value = false
    }
  }
  </script>