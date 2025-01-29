<template>
    <div class="space-y-6">
      <PageHeader 
        title="Reports & Analytics" 
        subtitle="View detailed analytics and generate custom reports"
      >
        <template #actions>
          <div class="flex space-x-3">
            <button
              @click="downloadReport('pdf')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
              Export PDF
            </button>
            <button
              @click="downloadReport('csv')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <TableCellsIcon class="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </template>
      </PageHeader>
  
      <!-- Date Range Selector -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Date Range</label>
            <select 
              v-model="dateRange"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
  
          <div v-if="dateRange === 'custom'" class="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                v-model="customRange.startDate"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <input 
                v-model="customRange.endDate"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
            </div>
          </div>
        </div>
      </div>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="metric in metrics" :key="metric.label" 
          class="bg-white rounded-lg shadow p-6">
          <dt class="text-sm font-medium text-gray-500">{{ metric.label }}</dt>
          <dd class="mt-2 flex items-baseline justify-between md:block lg:flex">
            <div class="flex items-baseline text-2xl font-semibold text-gray-900">
              {{ metric.value }}
              <span class="ml-2 text-sm font-medium text-gray-500">
                {{ metric.unit }}
              </span>
            </div>
  
            <div class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium"
              :class="metric.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              <ArrowUpIcon v-if="metric.change >= 0" 
                class="h-5 w-5 flex-shrink-0 self-center text-green-500" />
              <ArrowDownIcon v-else 
                class="h-5 w-5 flex-shrink-0 self-center text-red-500" />
              <span class="ml-1">{{ Math.abs(metric.change) }}%</span>
            </div>
          </dd>
        </div>
      </div>
  
      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Message Volume</h3>
          <div class="mt-4 h-80">
            <LineChart :data="messageVolumeData" :options="chartOptions" />
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Success Rate</h3>
          <div class="mt-4 h-80">
            <LineChart :data="successRateData" :options="chartOptions" />
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Message Types Distribution</h3>
          <div class="mt-4 h-80">
            <DoughnutChart :data="messageTypesData" :options="chartOptions" />
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900">Hourly Activity</h3>
          <div class="mt-4 h-80">
            <BarChart :data="hourlyActivityData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    ArrowUpIcon, 
    ArrowDownIcon,
    DocumentArrowDownIcon,
    TableCellsIcon
  } from '@heroicons/vue/24/outline'
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement
  } from 'chart.js'
  import { Line as LineChart, Bar as BarChart, Doughnut as DoughnutChart } from 'vue-chartjs'
  
  // Register ChartJS components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  )
  
  definePageMeta({
    middleware: ['auth', 'plan']
  })
  
  const dateRange = ref('last7days')
  const customRange = ref({
    startDate: '',
    endDate: ''
  })
  
  // Metrics data
  const metrics = ref([
    { 
      label: 'Total Messages',
      value: 0,
      unit: 'messages',
      change: 0
    },
    {
      label: 'Success Rate',
      value: 0,
      unit: '%',
      change: 0
    },
    {
      label: 'Active Sessions',
      value: 0,
      unit: 'sessions',
      change: 0
    },
    {
      label: 'Average Response Time',
      value: 0,
      unit: 'seconds',
      change: 0
    }
  ])
  
  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  }
  
  // Chart Data
  const messageVolumeData = ref({
    labels: [],
    datasets: [
      {
        label: 'Messages Sent',
        data: [],
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      }
    ]
  })
  
  const successRateData = ref({
    labels: [],
    datasets: [
      {
        label: 'Success Rate',
        data: [],
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      }
    ]
  })
  
  const messageTypesData = ref({
    labels: ['Text', 'Media', 'Template'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)'
        ]
      }
    ]
  })
  
  const hourlyActivityData = ref({
    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Messages',
        data: Array(24).fill(0),
        backgroundColor: 'rgb(34, 197, 94)'
      }
    ]
  })
  
  // Watch for date range changes
  watch([dateRange, customRange], () => {
    loadReportData()
  })
  
  onMounted(() => {
    loadReportData()
  })
  
  async function loadReportData() {
    try {
      const { authApi } = useApi()
      const params = {
        dateRange: dateRange.value,
        ...customRange.value
      }
  
      const response = await authApi('/api/reports/analytics', { params })
      updateMetrics(response.data.metrics)
      updateCharts(response.data.charts)
    } catch (error) {
      console.error('Error loading report data:', error)
    }
  }
  
  function updateMetrics(data) {
    metrics.value = metrics.value.map(metric => ({
      ...metric,
      value: data[metric.label.toLowerCase().replace(/\s/g, '_')],
      change: data[`${metric.label.toLowerCase().replace(/\s/g, '_')}_change`]
    }))
  }
  
  function updateCharts(data) {
    messageVolumeData.value.labels = data.messageVolume.labels
    messageVolumeData.value.datasets[0].data = data.messageVolume.data
  
    successRateData.value.labels = data.successRate.labels
    successRateData.value.datasets[0].data = data.successRate.data
  
    messageTypesData.value.datasets[0].data = data.messageTypes.data
  
    hourlyActivityData.value.datasets[0].data = data.hourlyActivity.data
  }
  
  async function downloadReport(format: 'pdf' | 'csv') {
    try {
      const { authApi } = useApi()
      const response = await authApi('/api/reports/download', {
        params: {
          format,
          dateRange: dateRange.value,
          ...customRange.value
        },
        responseType: 'blob'
      })
  
      // Create and trigger download
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report-${Date.now()}.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }
  </script>