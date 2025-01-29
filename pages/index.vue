<template>
  <div class="space-y-6">
    <PageHeader title="Admin Dashboard" />
    
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Total Users</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ metrics.users.total }}</p>
        <p class="mt-1 text-sm text-gray-500">
          <span :class="metrics.users.growth >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ metrics.users.growth >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.users.growth) }}%
          </span>
          vs last month
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Active Sessions</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ metrics.sessions.active }}</p>
        <p class="mt-1 text-sm text-gray-500">
          Out of {{ metrics.sessions.total }} total sessions
        </p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Total Revenue</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">${{ metrics.revenue.total }}</p>
        <p class="mt-1 text-sm text-gray-500">
          <span :class="metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ metrics.revenue.growth >= 0 ? '↑' : '↓' }} {{ Math.abs(metrics.revenue.growth) }}%
          </span>
          vs last month
        </p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Messages Overview</h3>
        <div class="mt-4 h-64">
          <LineChart :data="messageChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900">Revenue Overview</h3>
        <div class="mt-4 h-64">
          <BarChart :data="revenueChartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
      <div class="mt-4">
        <div v-for="activity in recentActivity" :key="activity.id" 
          class="flex items-center space-x-4 py-3 border-b last:border-0">
          <div class="flex-shrink-0">
            <component :is="activity.icon" class="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(activity.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineChart, BarChart } from 'vue-chartjs'
import { 
  UserIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftIcon 
} from '@heroicons/vue/24/outline'

definePageMeta({
  middleware: ['auth', 'admin']
})

const adminStore = useAdminStore()

const metrics = ref({
  users: { total: 0, active: 0, growth: 0 },
  sessions: { active: 0, total: 0 },
  revenue: { total: 0, growth: 0 },
  messages: { total: 0, success: 0, failed: 0 }
})

const recentActivity = ref([])
const messageChartData = ref(null)
const revenueChartData = ref(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  try {
    const data = await adminStore.fetchMetrics()
    metrics.value = data.metrics
    messageChartData.value = data.messageChart
    revenueChartData.value = data.revenueChart
    recentActivity.value = data.recentActivity
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}
</script>