<!-- pages/dashboard/statistics.vue -->
<template>
    <div class="space-y-6">
      <PageHeader 
        title="User Statistics" 
        subtitle="View your usage statistics and analytics"
      />
  
      <!-- Loading State -->
      <div v-if="loading" class="bg-white shadow rounded-lg p-6">
        <LoadingSpinner text="Loading statistics..." />
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-white shadow rounded-lg p-6">
        <div class="text-center text-red-600">
          {{ error }}
        </div>
      </div>
  
      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Messages Stats -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Message Statistics</h3>
            <dl class="space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Total Messages</dt>
                <dd class="text-sm font-medium text-gray-900">{{ stats.messages?.overall?.total || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Successful</dt>
                <dd class="text-sm font-medium text-green-600">{{ stats.messages?.overall?.successful || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Failed</dt>
                <dd class="text-sm font-medium text-red-600">{{ stats.messages?.overall?.failed || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Success Rate</dt>
                <dd class="text-sm font-medium text-gray-900">{{ (stats.messages?.overall?.success_rate || 0) }}%</dd>
              </div>
            </dl>
          </div>
  
          <!-- Sessions Stats -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Session Statistics</h3>
            <dl class="space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Active Sessions</dt>
                <dd class="text-sm font-medium text-gray-900">{{ stats.sessions?.active || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Total Sessions</dt>
                <dd class="text-sm font-medium text-gray-900">{{ stats.sessions?.total || 0 }}</dd>
              </div>
            </dl>
          </div>
  
          <!-- Usage Stats -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
            <dl class="space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Messages Today</dt>
                <dd class="text-sm font-medium text-gray-900">{{ stats.messages?.today?.total || 0 }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Success Rate Today</dt>
                <dd class="text-sm font-medium text-gray-900">{{ (stats.messages?.today?.success_rate || 0) }}%</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Messages This Month</dt>
                <dd class="text-sm font-medium text-gray-900">{{ stats.messages?.monthly?.total || 0 }}</dd>
              </div>
            </dl>
          </div>
        </div>
  
        <!-- Message History Chart -->
        <div v-if="chartData" class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Message History</h3>
          <div class="h-80">
            <LineChart 
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { Line as LineChart } from 'vue-chartjs'
  import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  
  // Register ChartJS components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )
  
  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
  })
  
  const userStore = useUserStore()
  const loading = ref(true)
  const error = ref(null)
  const stats = ref({})
  
  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
  
  const chartData = computed(() => {
    if (!stats.value?.messages?.history?.length) return null
  
    return {
      labels: stats.value.messages.history.map(item => item.date),
      datasets: [
        {
          label: 'Messages Sent',
          data: stats.value.messages.history.map(item => item.total),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    }
  })
  
  onMounted(async () => {
    try {
      const response = await userStore.fetchStats()
      console.log('Stats response:', response)
      stats.value = response
    } catch (err) {
      error.value = 'Failed to load statistics'
      console.error('Error loading stats:', err)
    } finally {
      loading.value = false
    }
  })
  </script>