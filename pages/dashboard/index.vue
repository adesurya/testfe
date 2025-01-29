<template>
  <div class="space-y-6">
    <PageHeader 
      :title="`Welcome, ${user?.username}`" 
      subtitle="Overview of your dashboard"
    />

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ChatBubbleLeftRightIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Messages Sent</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.messagesSent }}</p>
            <p class="text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DevicePhoneMobileIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Active Sessions</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.activeSessions }}</p>
            <p class="text-sm text-gray-500">Connected devices</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Success Rate</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.successRate }}%</p>
            <p class="text-sm text-gray-500">Message delivery</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <EnvelopeIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">Messages Left</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.messagesRemaining }}</p>
            <p class="text-sm text-gray-500">Current plan limit</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Activity Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900">Message Activity</h3>
      <div class="mt-4 h-80">
        <LineChart 
          :data="chartData.messageActivity" 
          :options="chartOptions"
        />
      </div>
    </div>

    <!-- Recent Messages -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Recent Messages</h3>
          <NuxtLink 
            to="/dashboard/messages"
            class="text-sm font-medium text-green-600 hover:text-green-500"
          >
            View all
          </NuxtLink>
        </div>
        <div class="mt-6">
          <MessageHistory :limit="5" />
        </div>
      </div>
    </div>

    <!-- Active Sessions -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Active WhatsApp Sessions</h3>
          <NuxtLink 
            to="/dashboard/sessions"
            class="text-sm font-medium text-green-600 hover:text-green-500"
          >
            Manage sessions
          </NuxtLink>
        </div>
        <ul class="mt-6 divide-y divide-gray-200">
          <li v-for="session in sessions" :key="session.id"
            class="py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <DevicePhoneMobileIcon class="h-6 w-6 text-gray-400" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ session.phoneNumber }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Last active: {{ formatDate(session.lastActive) }}
                  </p>
                </div>
              </div>
              <StatusBadge :status="session.status" />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Current Plan -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Current Plan</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                {{ currentPlan?.name || 'No active plan' }}
              </p>
            </div>
          </div>
          <div class="mt-4 sm:mt-0">
            <NuxtLink 
              to="/plans"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              {{ currentPlan ? 'Upgrade Plan' : 'Choose Plan' }}
            </NuxtLink>
          </div>
        </div>
        <div v-if="currentPlan" class="mt-6">
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div class="bg-gray-50 rounded-lg px-6 py-5">
              <p class="text-sm font-medium text-gray-500">Messages Remaining</p>
              <p class="mt-2 flex items-baseline">
                <span class="text-2xl font-semibold text-gray-900">
                  {{ currentPlan.messagesRemaining }}
                </span>
                <span class="ml-2 text-sm text-gray-500">
                  of {{ currentPlan.messageLimit }}
                </span>
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg px-6 py-5">
              <p class="text-sm font-medium text-gray-500">Plan Expires</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900">
                {{ formatDate(currentPlan.expiryDate) }}
              </p>
            </div>
            <div class="bg-gray-50 rounded-lg px-6 py-5">
              <p class="text-sm font-medium text-gray-500">Daily Average</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900">
                {{ stats.dailyAverage }} messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ChatBubbleLeftRightIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  EnvelopeIcon 
} from '@heroicons/vue/24/outline'
import { Line as LineChart } from 'vue-chartjs'

definePageMeta({
  middleware: ['auth', 'plan']
})

const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed(() => authStore.user)
const stats = ref({
  messagesSent: 0,
  activeSessions: 0,
  successRate: 0,
  messagesRemaining: 0,
  dailyAverage: 0
})
const sessions = ref([])
const currentPlan = ref(null)
const chartData = ref({
  messageActivity: {
    labels: [],
    datasets: []
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadSessions(),
    loadCurrentPlan()
  ])
})

async function loadStats() {
  try {
    const response = await userStore.fetchStats()
    stats.value = response
    updateChartData(response.messageHistory)
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

async function loadSessions() {
  try {
    const { authApi } = useApi()
    const response = await authApi('/api/whatsapp/sessions')
    sessions.value = response.data
  } catch (error) {
    console.error('Error loading sessions:', error)
  }
}

async function loadCurrentPlan() {
  try {
    const response = await userStore.fetchCurrentPlan()
    currentPlan.value = response
  } catch (error) {
    console.error('Error loading current plan:', error)
  }
}

function updateChartData(messageHistory) {
  chartData.value.messageActivity = {
    labels: messageHistory.map(item => item.date),
    datasets: [
      {
        label: 'Messages Sent',
        data: messageHistory.map(item => item.count),
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      }
    ]
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>