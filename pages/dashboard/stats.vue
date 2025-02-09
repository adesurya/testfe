<!-- pages/dashboard/stats.vue -->
<template>
  <div class="space-y-6">
    <PageHeader 
      title="Statistics" 
      subtitle="View your usage statistics and analytics"
    />

    <!-- Current Plan Info -->
    <div v-if="stats.current_plan" class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <dt class="text-sm text-gray-500">Plan Name</dt>
          <dd class="mt-1 text-lg font-medium text-gray-900">{{ stats.current_plan.name }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">Messages Remaining</dt>
          <dd class="mt-1 text-lg font-medium text-gray-900">{{ stats.current_plan.messages_remaining }}</dd>
        </div>
        <div>
          <dt class="text-sm text-gray-500">Expires</dt>
          <dd class="mt-1 text-lg font-medium text-gray-900">{{ formatDate(stats.current_plan.end_date) }}</dd>
        </div>
      </div>
    </div>

    <!-- Messages Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Single Messages Stats -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Single Messages</h3>
        <dl class="space-y-4">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Total Messages</dt>
            <dd class="text-sm font-medium text-gray-900">{{ stats.messages?.single?.total || 0 }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Successful</dt>
            <dd class="text-sm font-medium text-green-600">{{ stats.messages?.single?.successful || 0 }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Failed</dt>
            <dd class="text-sm font-medium text-red-600">{{ stats.messages?.single?.failed || 0 }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Success Rate</dt>
            <dd class="text-sm font-medium text-gray-900">{{ (stats.messages?.single?.success_rate || 0) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Bulk Messages Stats -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Bulk Messages</h3>
        <dl class="space-y-4">
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Total Messages</dt>
            <dd class="text-sm font-medium text-gray-900">{{ stats.messages?.bulk?.total_messages || 0 }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Successful</dt>
            <dd class="text-sm font-medium text-green-600">{{ stats.messages?.bulk?.successful || 0 }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Failed</dt>
            <dd class="text-sm font-medium text-red-600">{{ stats.messages?.bulk?.failed || 0 }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-sm text-gray-500">Success Rate</dt>
            <dd class="text-sm font-medium text-gray-900">{{ (stats.messages?.bulk?.success_rate || 0) }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Recent Single Messages -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Single Messages</h3>
        <div class="space-y-4">
          <div v-for="message in stats.recent_activity?.single_messages || []" 
            :key="message.id" 
            class="border-b border-gray-200 pb-4 last:border-0"
          >
            <div class="flex justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ message.target_number }}</p>
                <p class="text-sm text-gray-500">{{ message.status }}</p>
              </div>
              <div class="flex flex-col items-end">
                <StatusBadge :status="message.status" />
                <span class="mt-1 text-xs text-gray-500">{{ formatDate(message.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bulk Campaigns -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Bulk Messages</h3>
        <div class="space-y-4">
          <div v-for="campaign in stats.recent_activity?.bulk_campaigns || []" 
            :key="campaign.id" 
            class="border-b border-gray-200 pb-4 last:border-0"
          >
            <div class="flex justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Total : {{ campaign.total_messages }} messages</p>
                <p class="text-sm text-gray-500">{{ campaign.message_type }}</p>
                <p class="text-sm text-gray-500">{{ campaign.preview_message }}</p>
              </div>
              <div class="flex flex-col items-end">
                <StatusBadge :status="campaign.status" />
                <span class="mt-1 text-sm text-gray-500">Success: {{ campaign.status }}</span>
                <span class="text-xs text-gray-500">{{ formatDate(campaign.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
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
        label: 'Single Messages',
        data: stats.value.messages.history.map(item => item.single_total || 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: 'Bulk Messages',
        data: stats.value.messages.history.map(item => item.bulk_total || 0),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
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

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}
</script>