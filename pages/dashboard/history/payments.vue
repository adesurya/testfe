<template>
    <div class="space-y-6">
      <PageHeader 
        title="Payment History" 
        subtitle="View your payment transactions and subscriptions"
      />
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Total Spent</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">
            ${{ formatCurrency(summary.totalSpent) }}
          </p>
          <p class="mt-1 text-sm text-gray-500">All time</p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Active Subscription</h3>
          <p class="mt-2 text-lg font-semibold text-gray-900">
            {{ currentPlan?.name || 'No active plan' }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ currentPlan ? `Expires ${formatDate(currentPlan.expiryDate)}` : 'Get started with a plan' }}
          </p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500">Messages Remaining</h3>
          <p class="mt-2 text-3xl font-bold text-gray-900">
            {{ currentPlan?.messagesRemaining || 0 }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            of {{ currentPlan?.messageLimit || 0 }} total
          </p>
        </div>
      </div>
  
      <!-- Transactions List -->
      <div class="bg-white shadow rounded-lg">
        <!-- Filters -->
        <div class="p-6 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Date Range</label>
              <select 
                v-model="filters.dateRange"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="all">All Time</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select 
                v-model="filters.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">Payment Method</label>
              <select 
                v-model="filters.paymentMethod"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">All Methods</option>
                <option value="card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">Search</label>
              <input 
                v-model="filters.search"
                type="text"
                placeholder="Search transactions..."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
            </div>
          </div>
  
          <!-- Custom Date Range -->
          <div v-if="filters.dateRange === 'custom'" class="mt-4 grid grid-cols-2 gap-4">
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
  
        <!-- Transactions Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(transaction.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.transactionId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ transaction.description }}</div>
                  <div class="text-sm text-gray-500">{{ transaction.plan?.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ formatCurrency(transaction.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="transaction.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatPaymentMethod(transaction.paymentMethod) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewTransactionDetails(transaction)"
                    class="text-green-600 hover:text-green-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Empty State -->
        <div v-if="transactions.length === 0" class="text-center py-12">
          <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Adjust your filters or make a payment to get started
          </p>
        </div>
  
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200">
          <Pagination
            v-model:page="currentPage"
            :total-pages="totalPages"
            :total-items="totalTransactions"
          />
        </div>
      </div>
  
      <!-- Transaction Detail Modal -->
      <Modal 
        v-if="selectedTransaction"
        title="Transaction Details"
        @close="selectedTransaction = null"
      >
        <div class="p-6">
          <dl class="grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt class="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ selectedTransaction.transactionId }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <StatusBadge :status="selectedTransaction.status" />
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Amount</dt>
              <dd class="mt-1 text-sm text-gray-900">
                ${{ formatCurrency(selectedTransaction.amount) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(selectedTransaction.createdAt) }}
              </dd>
            </div>
            <div class="col-span-2">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ selectedTransaction.description }}
              </dd>
            </div>
            <div class="col-span-2">
              <dt class="text-sm font-medium text-gray-500">Payment Method</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatPaymentMethod(selectedTransaction.paymentMethod) }}
                <span v-if="selectedTransaction.paymentDetails" class="text-gray-500">
                  ending in {{ selectedTransaction.paymentDetails.last4 }}
                </span>
              </dd>
            </div>
          </dl>
  
          <!-- Receipt Download -->
          <div class="mt-6 flex justify-end">
            <button
              @click="downloadReceipt(selectedTransaction)"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentDownloadIcon class="h-5 w-5 mr-2" />
              Download Receipt
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CreditCardIcon, DocumentDownloadIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'plan']
  })
  
  const paymentStore = usePaymentStore()
  const userStore = useUserStore()
  
  // ... [Lanjutan kode di respons berikutnya]
  const filters = ref({
  dateRange: 'last30',
  startDate: '',
  endDate: '',
  status: '',
  paymentMethod: '',
  search: ''
})

const transactions = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalTransactions = ref(0)
const selectedTransaction = ref(null)
const currentPlan = ref(null)
const summary = ref({
  totalSpent: 0,
  activeSubscriptions: 0,
  pendingPayments: 0
})

onMounted(async () => {
  await Promise.all([
    loadTransactions(),
    loadCurrentPlan(),
    loadSummary()
  ])
})

watch([filters, currentPage], () => {
  loadTransactions()
})

async function loadTransactions() {
  try {
    const response = await paymentStore.fetchPaymentHistory({
      ...filters.value,
      page: currentPage.value
    })
    
    transactions.value = response.transactions
    totalPages.value = response.totalPages
    totalTransactions.value = response.total
  } catch (error) {
    console.error('Error loading transactions:', error)
  }
}

async function loadCurrentPlan() {
  try {
    const plan = await userStore.fetchCurrentPlan()
    currentPlan.value = plan
  } catch (error) {
    console.error('Error loading current plan:', error)
  }
}

async function loadSummary() {
  try {
    const response = await paymentStore.fetchSummary()
    summary.value = response
  } catch (error) {
    console.error('Error loading summary:', error)
  }
}

function viewTransactionDetails(transaction) {
  selectedTransaction.value = transaction
}

async function downloadReceipt(transaction) {
  try {
    const response = await paymentStore.downloadReceipt(transaction.id)
    // Create blob from response and download
    const blob = new Blob([response], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `receipt-${transaction.transactionId}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading receipt:', error)
  }
}

function formatCurrency(amount: number): string {
  return amount.toFixed(2)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString()
}

function formatPaymentMethod(method: string): string {
  const methods = {
    card: 'Credit Card',
    bank_transfer: 'Bank Transfer',
    wallet: 'E-Wallet'
  }
  return methods[method] || method
}
</script>