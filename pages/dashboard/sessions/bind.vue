<template>
    <div class="space-y-6">
      <PageHeader 
        title="Bind WhatsApp Session" 
        subtitle="Connect your WhatsApp account"
      />
  
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- QR Code Section -->
        <div class="bg-white shadow rounded-lg p-6">
          <div v-if="!session.bound">
            <div class="text-center">
              <h3 class="text-lg font-medium text-gray-900">
                Scan QR Code
              </h3>
              <p class="mt-2 text-sm text-gray-500">
              Open WhatsApp on your phone and scan this QR code
            </p>
          </div>

          <div class="mt-6">
            <div v-if="qrCode" class="flex justify-center">
              <img 
                :src="qrCode" 
                alt="WhatsApp QR Code"
                class="h-64 w-64"
              >
            </div>
            <div v-else-if="loading" class="py-12">
              <LoadingSpinner text="Generating QR Code..." />
            </div>
            <div v-else class="text-center py-12">
              <XCircleIcon class="mx-auto h-12 w-12 text-red-500" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">
                Failed to generate QR code
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Please try again or contact support if the problem persists.
              </p>
              <div class="mt-6">
                <button
                  @click="generateQR"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">
            Successfully Connected
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            Your WhatsApp account is now connected to the platform.
          </p>
          <div class="mt-6">
            <button
              @click="goToDashboard"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="space-y-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900">Instructions</h3>
          <ol class="mt-4 space-y-4 text-sm text-gray-500">
            <li class="flex items-start">
              <span class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">
                1
              </span>
              <p class="ml-3">Open WhatsApp on your phone</p>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">
                2
              </span>
              <p class="ml-3">Tap Menu (three dots) and select WhatsApp Web</p>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">
                3
              </span>
              <p class="ml-3">Point your phone camera to the QR code</p>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium">
                4
              </span>
              <p class="ml-3">Keep your phone connected to the internet</p>
            </li>
          </ol>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900">Important Notes</h3>
          <ul class="mt-4 space-y-2 text-sm text-gray-500">
            <li class="flex items-start">
              <InformationCircleIcon class="h-5 w-5 text-blue-500 mr-2" />
              Make sure your phone has a stable internet connection
            </li>
            <li class="flex items-start">
              <InformationCircleIcon class="h-5 w-5 text-blue-500 mr-2" />
              You can only connect one WhatsApp account per session
            </li>
            <li class="flex items-start">
              <InformationCircleIcon class="h-5 w-5 text-blue-500 mr-2" />
              The QR code expires after 45 seconds
            </li>
          </ul>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900">Need Help?</h4>
          <p class="mt-1 text-sm text-gray-500">
            If you're having trouble connecting your WhatsApp account, please
            <button 
              @click="showSupportInfo = true"
              class="text-green-600 hover:text-green-500"
            >
              contact our support team
            </button>.
          </p>
        </div>
      </div>
    </div>

    <!-- Support Modal -->
    <Modal 
      v-if="showSupportInfo"
      title="Contact Support"
      @close="showSupportInfo = false"
    >
      <div class="p-6">
        <p class="text-sm text-gray-500">
          Our support team is available to help you with any issues:
        </p>
        <ul class="mt-4 space-y-2">
          <li class="flex items-center">
            <EnvelopeIcon class="h-5 w-5 text-gray-400 mr-2" />
            <span class="text-sm text-gray-900">support@example.com</span>
          </li>
          <li class="flex items-center">
            <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
            <span class="text-sm text-gray-900">+1 234 567 890</span>
          </li>
        </ul>
        <div class="mt-6">
          <button
            @click="showSupportInfo = false"
            class="w-full inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth', 'plan']
})

const router = useRouter()

const qrCode = ref('')
const loading = ref(false)
const showSupportInfo = ref(false)
const session = ref({
  bound: false,
  status: 'pending'
})

let qrInterval = null
let statusInterval = null

onMounted(() => {
  generateQR()
})

onUnmounted(() => {
  if (qrInterval) clearInterval(qrInterval)
  if (statusInterval) clearInterval(statusInterval)
})

async function generateQR() {
  try {
    loading.value = true
    const { authApi } = useApi()
    const response = await authApi('/api/whatsapp/bind', {
      method: 'POST'
    })
    
    qrCode.value = response.data.qrCode
    startStatusCheck(response.data.sessionId)
    startQRRefresh()
  } catch (error) {
    console.error('Error generating QR code:', error)
    qrCode.value = ''
  } finally {
    loading.value = false
  }
}

function startQRRefresh() {
  // Refresh QR code every 45 seconds
  qrInterval = setInterval(() => {
    if (!session.value.bound) {
      generateQR()
    }
  }, 45000)
}

function startStatusCheck(sessionId: string) {
  statusInterval = setInterval(async () => {
    try {
      const { authApi } = useApi()
      const response = await authApi(`/api/whatsapp/sessions/${sessionId}/status`)
      session.value = response.data

      if (session.value.bound) {
        clearInterval(statusInterval)
        clearInterval(qrInterval)
      }
    } catch (error) {
      console.error('Error checking session status:', error)
    }
  }, 3000)
}

function goToDashboard() {
  router.push('/dashboard')
}
</script>