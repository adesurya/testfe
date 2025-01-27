<template>
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Transaction Report</h2>
        
        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">End Date</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Transaction Type</label>
            <select
              v-model="filters.transactionType"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All Types</option>
              <option value="purchase">Purchase</option>
              <option value="topup">Top Up</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              v-model="filters.paymentMethod"
              class="mt-1 block w-full rounded-md border-gray-300"
            >
              <option value="">All Methods</option>
              <option value="online">Online</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
        </div>
  
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Total Transactions</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ summary.totalTransactions }}
            </dd>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Total Revenue</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              ${{ summary.totalRevenue.toFixed(2) }}
            </dd>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Average Transaction</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              ${{ summary.averageTransaction.toFixed(2) }}
            </dd>
          </div>
        </div>
  
        <!-- Transactions Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in tableHeaders" 
                    :key="header.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(transaction.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ transaction.user.username }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ transaction.transaction_type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  ${{ transaction.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ transaction.payment_method }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="transaction.payment_status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <Pagination
          v-if="totalPages > 1"
          v-model:page="currentPage"
          :total-pages="totalPages"
          class="mt-6"
        />
  
        <!-- Export Buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="exportPDF"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
            Export PDF
          </button>
          <button
            @click="exportCSV"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <TableCellsIcon class="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { DocumentArrowDownIcon, TableCellsIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const { authApi } = useApi()
  
  const tableHeaders = [
    { key: 'date', label: 'Date' },
    { key: 'user', label: 'User' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Payment Method' },
    { key: 'status', label: 'Status' }
  ]
  
  const filters = ref({
    startDate: '',
    endDate: '',
    transactionType: '',
    paymentMethod: ''
  })
  
  const transactions = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const summary = ref({
    totalTransactions: 0,
    totalRevenue: 0,
    averageTransaction: 0
  })
  
  onMounted(() => {
    loadTransactions()
    loadSummary()
  })
  
  async function loadTransactions() {
    try {
      const response = await authApi('/api/reports/transactions', {
        params: {
          ...filters.value,
          page: currentPage.value
        }
      })
      transactions.value = response.data.transactions
      totalPages.value = response.data.totalPages
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }
  
  async function loadSummary() {
    try {
      const response = await authApi('/api/reports/transactions/summary', {
        params: filters.value
      })
      summary.value = response.data
    } catch (error) {
      console.error('Error loading summary:', error)
    }
  }
  
  async function exportPDF() {
    try {
      const response = await authApi('/api/reports/transactions/export/pdf', {
        params: filters.value,
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transactions-report.pdf')
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Error exporting PDF:', error)
    }
  }
  
  async function exportCSV() {
    try {
      const response = await authApi('/api/reports/transactions/export/csv', {
        params: filters.value,
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'transactions-report.csv')
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }
  
  watch([filters, currentPage], () => {
    loadTransactions()
    loadSummary()
  })
  </script>