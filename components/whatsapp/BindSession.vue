<template>
    <div class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900">Bind WhatsApp Session</h3>
      <form @submit.prevent="bindSession" class="mt-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            v-model="phoneNumber"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="+1234567890"
          >
        </div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Generate QR Code
        </button>
      </form>
  
      <div v-if="qrCode" class="mt-6">
        <h4 class="text-sm font-medium text-gray-900">Scan QR Code</h4>
        <div class="mt-2 flex justify-center">
          <img :src="qrCode" alt="WhatsApp QR Code" class="h-64 w-64">
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const { authApi } = useApi()
  const authStore = useAuthStore()
  
  const phoneNumber = ref('')
  const qrCode = ref('')
  
  async function bindSession() {
    try {
      const response = await authApi('/api/whatsapp/bind', {
        method: 'POST',
        body: {
          userId: authStore.user?.id,
          phoneNumber: phoneNumber.value
        }
      })
      qrCode.value = response.qrCode
    } catch (error) {
      console.error('Error binding session:', error)
    }
  }
  </script>