<template>
    <div class="space-y-6">
      <PageHeader 
        title="Admin Reports" 
        subtitle="Generate and view system reports"
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
  
      <!-- Report Filters -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Report Type</label>
            <select 
              v-model="filters.reportType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="users">Users Report</option>
              <option value="messages">Messages Report</option>
              <option value="transactions">Transactions Report</option>
              <option value="sessions">Sessions Report</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Date Range</label>
            <select 
              v-model="filters.dateRange"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
  
          <div v-if="filters.dateRange === 'custom'" class="md:col-span-2">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  v-model="filters.startDate"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  v-model="filters.endDate"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
            </div>
          </div>
        </div>
  
        <div class="mt-4 flex justify-end">
          <button
            @click="generateReport"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Generate Report
          </button>
        </div>
      </div>
  
      <!-- Report Content -->
      <div v-if="reportData" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="metric in reportData.metrics" :key="metric.label"
            class="bg-white rounded-lg shadow p-6"
          >
            <dt class="text-sm font-medium text-gray-500">{{ metric.label }}</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ metric.value }}
              <span class="ml-2 text-sm font-medium" 
                :class="metric.change >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ metric.change >= 0 ? '↑' : '↓' }} {{ Math.abs(metric.change) }}%
              </span>
            </dd>
          </div>
        </div>
  
        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Line Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900">Trend Over Time</h3>
            <div class="mt-4 h-80">
              <LineChart 
                :data="reportData.trendData" 
                :options="chartOptions"
              />
            </div>
          </div>
  
          <!-- Bar Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900">Distribution</h3>
            <div class="mt-4 h-80">
              <BarChart 
                :data="reportData.distributionData" 
                :options="chartOptions"
              />
            </div>
          </div>
        </div>
  
        <!-- Detailed Data Table -->
        <div class="bg-white shadow rounded-lg">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="column in reportData.columns" :key="column.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in reportData.rows" :key="index">
                  <td v-for="column in reportData.columns" :key="column.key"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {{ formatCellValue(row[column.key], column.type) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200">
            <Pagination
              v-model:page="currentPage"
              :total-pages="totalPages"
              :total-items="totalItems"
            />
          </div>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-else-if="loading" class="text-center py-12">
        <LoadingSpinner text="Generating report..." />
      </div>
  
      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white shadow rounded-lg">
        <DocumentChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Report Generated</h3>
        <p class="mt-1 text-sm text-gray-500">
          Select your report parameters and click "Generate Report" to get started.
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { DocumentArrowDownIcon, TableCellsIcon, DocumentChartBarIcon } from '@heroicons/vue/24/outline'
  import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  import { Line as LineChart, Bar as BarChart } from 'vue-chartjs'
  
  // Register ChartJS components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  )
  
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const adminStore = useAdminStore()
  
  const filters = ref({
    reportType: 'users',
    dateRange: 'last7days',
    startDate: '',
    endDate: ''
  })
  
  const loading = ref(false)
  const reportData = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  }
  
  watch([filters, currentPage], () => {
    if (reportData.value) {
      generateReport()
    }
  })
  
  async function generateReport() {
    try {
      loading.value = true
      const response = await adminStore.generateReport({
        ...filters.value,
        page: currentPage.value
      })
      
      reportData.value = response.data
      totalPages.value = response.totalPages
      totalItems.value = response.totalItems
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function downloadReport(format: 'pdf' | 'csv') {
    try {
      const response = await adminStore.downloadReport({
        ...filters.value,
        format
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
  
  function formatCellValue(value: any, type: string) {
    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'currency':
        return `$${value.toFixed(2)}`
      case 'percentage':
        return `${value}%`
      default:
        return value
    }
  }
  </script>