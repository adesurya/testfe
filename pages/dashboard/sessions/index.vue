// pages/dashboard/sessions/index.vue
<template>
  <div class="space-y-6">
    <PageHeader 
      title="WhatsApp Sessions" 
      subtitle="Manage your WhatsApp connections"
    >
      <template #actions>
        <button
          @click="showBindModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Add New Session
        </button>
      </template>
    </PageHeader>

    <!-- Active Sessions -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <div v-for="session in sessions" :key="session.id" 
            class="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <DevicePhoneMobileIcon 
                  class="h-8 w-8 text-gray-400" 
                  :class="{'text-green-500': session.status === 'active'}"
                />
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-900">
                  {{ session.phoneNumber }}
                </h4>
                <p class="text-sm text-gray-500">
                  Last active: {{ formatDate(session.lastActive) }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <StatusBadge :status="session.status" />
              <button
                @click="unbindSession(session.id)"
                class="text-red-600 hover:text-red-900"
              >
                Unbind
              </button>
            </div>
          </div>

          <div v-if="sessions.length === 0" class="text-center py-12">
            <PhoneIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No active sessions</h3>
            <p class="mt-1 text-sm text-gray-500">
              Get started by binding a new WhatsApp session.
            </p>
            <div class="mt-6">
              <button
                @click="showBindModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon class="h-5 w-5 mr-2" />
                Add New Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Messages Sent</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ stats.messagesSent }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Last 30 days
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Success Rate</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ stats.successRate }}%
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Based on delivery status
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Active Sessions</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ stats.activeSessions }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Out of {{ sessions.length }} total
        </p>
      </div>
    </div>

    <!-- Bind Modal -->
    <Modal 
      v-if="showBindModal" 
      title="Add New WhatsApp Session"
      @close="showBindModal = false"
    >
      <div class="p-6">
        <QRScanner 
          :phone-number="newPhoneNumber"
          @bound="handleSessionBound"
        />
      </div>
    </Modal>

    <!-- Confirmation Modal -->
    <Modal 
      v-if="showConfirmUnbind"
      title="Confirm Unbind"
      @close="showConfirmUnbind = false"
    >
      <div class="p-6">
        <p class="text-sm text-gray-500">
          Are you sure you want to unbind this WhatsApp session? This action cannot be undone.
        </p>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showConfirmUnbind = false"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmUnbind"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Unbind
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { 
  PlusIcon, 
  DevicePhoneMobileIcon,
  PhoneIcon 
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth', 'plan']
})

const sessions = ref([])
const stats = ref({
  messagesSent: 0,
  successRate: 0,
  activeSessions: 0
})

const showBindModal = ref(false)
const showConfirmUnbind = ref(false)
const newPhoneNumber = ref('')
const selectedSessionId = ref(null)

onMounted(() => {
  loadSessions()
  loadStats()
})

async function loadSessions() {
  try {
    const { authApi } = useApi()
    const response = await authApi('/api/whatsapp/sessions')
    sessions.value = response.data
  } catch (error) {
    console.error('Error loading sessions:', error)
  }
}

async function loadStats() {
  try {
    const { authApi } = useApi()
    const response = await authApi('/api/whatsapp/sessions/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

function unbindSession(sessionId: number) {
  selectedSessionId.value = sessionId
  showConfirmUnbind.value = true
}

async function confirmUnbind() {
  try {
    const { authApi } = useApi()
    await authApi(`/api/whatsapp/sessions/${selectedSessionId.value}`, {
      method: 'DELETE'
    })
    await loadSessions()
    showConfirmUnbind.value = false
  } catch (error) {
    console.error('Error unbinding session:', error)
  }
}

function handleSessionBound() {
  showBindModal.value = false
  loadSessions()
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}
</script>