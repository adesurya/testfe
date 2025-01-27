<template>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">Complete Payment</h3>
              <div class="mt-2">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      v-model="form.cardNumber"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                  </div>
                  <!-- Add more payment fields -->
                  <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Pay Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    plan: {
      id: number
      price: number
    }
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
  }>()
  
  const form = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  
  async function handleSubmit() {
    const { authApi } = useApi()
    try {
      await authApi('/api/payments/create', {
        method: 'POST',
        body: {
          planId: props.plan.id,
          paymentMethod: 'card',
          // Add payment details
        }
      })
      emit('success')
    } catch (error) {
      console.error('Payment error:', error)
    }
  }
  </script>