<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in stats" :key="stat.label" 
        class="bg-white rounded-lg shadow p-6">
        <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.label }}</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stat.value }}</dd>
        <div class="mt-2 flex items-center text-sm">
          <span :class="stat.change >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ stat.change >= 0 ? '↑' : '↓' }} {{ Math.abs(stat.change) }}%
          </span>
          <span class="text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900">Message Volume</h3>
        <MessageVolumeChart :data="chartData.messageVolume" />
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900">Revenue</h3>
        <RevenueChart :data="chartData.revenue" />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
        <div class="mt-4">
          <ActivityLog :activities="recentActivities" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin'

const adminStore = useAdminStore()

const stats = ref([
  { label: 'Total Users', value: 0, change: 0 },
  { label: 'Active Sessions', value: 0, change: 0 },
  { label: 'Messages Sent', value: 0, change: 0 }
])

const chartData = ref({
  messageVolume: [],
  revenue: []
})

const recentActivities = ref([])

onMounted(async () => {
  try {
    const metrics = await adminStore.fetchMetrics()
    updateStats(metrics)
    await loadChartData()
    await loadRecentActivities()
  } catch (error) {
    console.error('Error loading admin stats:', error)
  }
})

function updateStats(metrics) {
  stats.value = [
    {
      label: 'Total Users',
      value: metrics.totalUsers,
      change: metrics.userGrowth
    },
    {
      label: 'Active Sessions',
      value: metrics.activeSessions,
      change: metrics.sessionGrowth
    },
    {
      label: 'Messages Sent',
      value: metrics.totalMessages,
      change: metrics.messageGrowth
    }
  ]
}

async function loadChartData() {
  // Load chart data from API
  const data = await adminStore.fetchChartData()
  chartData.value = data
}

async function loadRecentActivities() {
  // Load recent activities from API
  recentActivities.value = await adminStore.fetchRecentActivities()
}
</script>