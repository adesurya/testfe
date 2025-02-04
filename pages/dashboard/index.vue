<!-- pages/dashboard/index.vue -->
<script setup>
import { 
  ChatBubbleLeftRightIcon, 
  DevicePhoneMobileIcon, 
  CheckCircleIcon, 
  EnvelopeIcon,
  Bars3Icon 
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const userStore = useUserStore()
const user = computed(() => authStore.user)

const currentPlan = ref(null)
const sessions = ref([])
const loading = ref(true)
const error = ref(null)
const messageHistory = ref([])
const stats = ref(null)

onMounted(async () => {
  if (user.value?.id) {
    console.log('Loading data for user:', user.value.id)
    await Promise.all([
      loadData(),
      loadSessions()

    ])
  }
})

async function loadSessions() {
  try {
    loading.value = true
    const userId = authStore.user?.id
    if (!userId) throw new Error('User ID not found')
    
    const response = await userStore.fetchUserSessions(userId)
    sessions.value = response
  } catch (err) {
    console.error('Error loading sessions:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function loadData() {
  try {
    // Load all data with proper error handling and logging
    const [planResponse, sessionResponse, messageResponse, statsResponse] = await Promise.all([
      userStore.fetchUserPlan(user.value.id),
      userStore.fetchUserSessions(user.value.id),
      userStore.fetchMessageHistory(user.value.id),
      userStore.fetchStats()
    ])

    console.log('Plan Response:', planResponse)
    console.log('Session Response:', sessionResponse)
    console.log('Message Response:', messageResponse)
    console.log('Stats Response:', statsResponse)

    // Update refs with response data
    currentPlan.value = Array.isArray(planResponse) ? 
      planResponse.find(plan => plan.status === 'active') : 
      planResponse

    sessions.value = sessionResponse
    messageHistory.value = messageResponse?.slice(0, 5) || []
    stats.value = statsResponse?.data
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

// Set page meta
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">
        Welcome, {{ user?.username || 'User' }}
      </h1>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/dashboard/messages/new"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          New Message
        </NuxtLink>
      </div>
    </div>

    <!-- Current Plan Section -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900">Current Plan</h3>
        <div v-if="currentPlan" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Plan Name</p>
            <p class="mt-1 text-lg font-semibold">{{ currentPlan.planName }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Messages</p>
            <p class="mt-1 text-lg font-semibold">{{ currentPlan.messagesRemaining }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Expires</p>
            <p class="mt-1 text-lg font-semibold">{{ formatDate(currentPlan.endDate) }}</p>
          </div>
        </div>
        <div v-else class="mt-4 text-center py-6">
          <p class="text-gray-500">No active plan found</p>
          <NuxtLink 
            to="/plans"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Choose a Plan
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Messages Sent -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <ChatBubbleLeftRightIcon class="h-8 w-8 text-green-600" />
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Messages Sent</h3>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats?.messages?.overall?.total ?? '0' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <DevicePhoneMobileIcon class="h-8 w-8 text-green-600" />
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Active Sessions</h3>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats?.sessions?.active ?? '0' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Success Rate -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <CheckCircleIcon class="h-8 w-8 text-green-600" />
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Success Rate</h3>
            <p class="text-2xl font-semibold text-gray-900">
              {{ stats?.messages?.overall?.success_rate ?? '0%' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Messages Left -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <EnvelopeIcon class="h-8 w-8 text-green-600" />
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Messages Left</h3>
            <p class="text-2xl font-semibold text-gray-900">
              {{ currentPlan?.messagesRemaining ?? '0' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- WhatsApp Sessions -->
    <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">WhatsApp Sessions</h3>
        <NuxtLink 
          to="/dashboard/sessions"
          class="text-sm font-medium text-green-600 hover:text-green-500"
        >
          Manage Sessions
        </NuxtLink>
      </div>
      
      <div class="mt-6">
        <div v-if="loading" class="flex justify-center py-4">
          <LoadingSpinner text="Loading sessions..." />
        </div>
        
        <div v-else-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>
        
        <div v-else-if="sessions && sessions.length > 0" class="space-y-4">
          <div v-for="session in sessions" :key="session.id" 
          class="p-4 bg-gray-50 rounded-lg"
          >
          <WhatsappSessionCard :session="session" />
          </div>
        </div>
        
        <div v-else class="text-center py-6">
          <p class="text-sm text-gray-500">No active WhatsApp sessions</p>
          <NuxtLink 
            to="/dashboard/sessions/bind"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Connect WhatsApp
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
    <!-- Message History -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Recent Messages</h3>
          <NuxtLink 
            to="/dashboard/messages"
            class="text-sm font-medium text-green-600 hover:text-green-500"
          >
            View All
          </NuxtLink>
        </div>
        
        <div class="mt-4">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden ring-1 ring-gray-200 sm:rounded-lg">
                <!-- Message list with horizontal scroll for mobile -->
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Recipient
                      </th>
                      <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="message in messageHistory" :key="message.id">
                      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div class="font-medium text-gray-900">{{ message.target_number }}</div>
                        <div class="text-gray-500">{{ message.message }}</div>
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm">
                        <StatusBadge :status="message.status" />
                      </td>
                      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {{ formatDate(message.created_at) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>