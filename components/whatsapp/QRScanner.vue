<template>
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div v-if="!session.bound" class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Scan QR Code with WhatsApp
          </h3>
          
          <div v-if="qrCode" class="flex justify-center">
            <img 
              :src="qrCode" 
              alt="WhatsApp QR Code" 
              class="h-64 w-64"
            >
            <p class="mt-4 text-sm text-gray-500">
              Open WhatsApp on your phone and scan this QR code
            </p>
          </div>
  
          <div v-else-if="loading" class="py-12">
            <LoadingSpinner text="Generating QR Code..." />
          </div>
  
          <div v-else class="py-12">
            <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
            <p class="mt-2 text-sm text-gray-500">
              Failed to generate QR code. Please try again.
            </p>
            <button
              @click="generateQR"
              class="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
  
        <div v-else class="text-center">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">
            Successfully Connected
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            WhatsApp is now connected to your account
          </p>
          <button
            @click="$emit('continue')"
            class="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Continue
          </button>
        </div>
      </div>
  
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-sm font-medium text-gray-900">Instructions:</h4>
        <ol class="mt-2 text-sm text-gray-500 space-y-2 list-decimal list-inside">
          <li>Open WhatsApp on your phone</li>
          <li>Tap Menu or Settings and select WhatsApp Web</li>
          <li>Point your phone to this screen to capture the QR code</li>
          <li>Keep your phone connected to the internet during the process</li>
        </ol>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps<{
    phoneNumber: string
  }>()
  
  const emit = defineEmits<{
    (e: 'bound'): void
    (e: 'continue'): void
  }>()
  
  const { authApi } = useApi()
  const authStore = useAuthStore()
  
  const qrCode = ref('')
  const loading = ref(false)
  const session = ref({
    bound: false,
    status: 'pending'
  })
  
  let statusCheckInterval: number | null = null
  
  onMounted(() => {
    generateQR()
  })
  
  onUnmounted(() => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval)
    }
  })
  
  async function generateQR() {
    try {
      loading.value = true
      const response = await authApi('/api/whatsapp/bind', {
        method: 'POST',
        body: {
          userId: authStore.user?.id,
          phoneNumber: props.phoneNumber
        }
      })
      qrCode.value = response.data.qrCode
      startStatusCheck(response.data.sessionId)
    } catch (error) {
      console.error('Error generating QR code:', error)
      qrCode.value = ''
    } finally {
      loading.value = false
    }
  }
  
  function startStatusCheck(sessionId: string) {
    statusCheckInterval = setInterval(async () => {
      try {
        const response = await authApi(`/api/whatsapp/sessions/${sessionId}/status`)
        session.value = response.data
  
        if (session.value.bound) {
          clearInterval(statusCheckInterval)
          emit('bound')
        }
      } catch (error) {
        console.error('Error checking session status:', error)
      }
    }, 5000) // Check every 5 seconds
  }
  </script>