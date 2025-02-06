<!-- pages/dashboard/sessions/bind.vue -->
<template>
  <div class="space-y-6">
        <!-- Header -->
        <PageHeader 
            title="Connect WhatsApp" 
            subtitle="Scan QR code to bind your WhatsApp account"
          >
          <template #actions>
            <NuxtLink
              to="/dashboard/sessions"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Sessions
            </NuxtLink>
          </template>
        </PageHeader>


    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
        <!-- Phone Number Input -->
        <div class="max-w-md mx-auto">
          <form @submit.prevent="bindSession" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  +62
                </span>
                <input
                  v-model="phoneNumber"
                  type="text"
                  required
                  placeholder="8123456789"
                  class="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {{ loading ? 'Generating QR Code...' : 'Generate QR Code' }}
            </button>
          </form>
        </div>

        <!-- QR Code Display -->
        <div v-if="qrCode" class="mt-8">
          <div class="max-w-xs mx-auto">
            <!-- Tampilkan ukuran default jika QR code ada -->
            <img 
                :src="qrCode" 
                alt="WhatsApp QR Code" 
                class="w-64 h-64 mx-auto border p-2 rounded-lg"
                @error="(e) => { 
                  console.error('Image loading error:', e); 
                  error = 'Failed to load QR Code image'
                }"
              >
            <p class="mt-4 text-sm text-gray-500 text-center">
              Scan this QR Code with your WhatsApp app to connect
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-md">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/dashboard/"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"        >
            <PlusIcon class="h-5 w-5 mr-2" />
            Back to Dashboard
          </NuxtLink>
        </div>


        <!-- Instructions -->
        <div class="mt-8 border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900">Instructions</h3>
          <ol class="mt-4 space-y-4 text-sm text-gray-500">
            <li class="flex gap-3">
              <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">1</span>
              <span>Open WhatsApp on your phone</span>
            </li>
            <li class="flex gap-3">
              <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">2</span>
              <span>Tap Menu or Settings and select WhatsApp Web</span>
            </li>
            <li class="flex gap-3">
              <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">3</span>
              <span>Point your phone to this screen to scan the QR code</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

const authStore = useAuthStore()
const { authApi } = useApi()
const router = useRouter()

const phoneNumber = ref('')
const qrCode = ref('')
const loading = ref(false)
const error = ref('')

async function bindSession() {
  try {
    loading.value = true
    error.value = ''

    // Prepare request payload
    const payload = {
      userId: authStore.user.id,
      phoneNumber: `62${phoneNumber.value.replace(/^0+/, '')}`
    }

    console.log('Sending payload:', payload)

    // Make API request
    const response = await authApi('/api/whatsapp/bind', {
      method: 'POST',
      body: payload
    })

    console.log('Response received:', response)

    // Karena response berisi qrCode yang sudah dalam format data:image/png;base64
    if (response?.qrCode) {
      // Langsung gunakan qrCode dari response karena sudah dalam format yang benar
      qrCode.value = response.qrCode
      
      // Log partial QR code untuk debugging
      console.log('QR Code received:', qrCode.value.substring(0, 50) + '...')
    } else {
      throw new Error('QR Code not found in response')
    }
  } catch (err) {
    console.error('Error binding WhatsApp:', err)
    error.value = err.message || 'Failed to generate QR Code. Please try again.'
  } finally {
    loading.value = false
  }
}

// Poll for session status
let pollInterval = null

function startPolling() {
  pollInterval = setInterval(async () => {
    try {
      const response = await authApi(`/api/whatsapp/sessions/${authStore.user.id}/status`)
      if (response.data.status === 'connected') {
        clearInterval(pollInterval)
        router.push('/dashboard/sessions')
      }
    } catch (err) {
      console.error('Error polling session status:', err)
    }
  }, 5000) // Poll every 5 seconds
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>