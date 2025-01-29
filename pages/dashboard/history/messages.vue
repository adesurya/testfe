<template>
    <div class="space-y-6">
      <PageHeader 
        title="Message History" 
        subtitle="View and manage your message history"
      />
  
      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select 
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="failed">Failed</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select 
              v-model="filters.type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Types</option>
              <option value="single">Single Message</option>
              <option value="bulk">Bulk Message</option>
              <option value="template">Template</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input 
              v-model="filters.search"
              type="text"
              placeholder="Search messages..."
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
  
      <!-- Message List -->
      <div class="bg-white shadow rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="message in messages" :key="message.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(message.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ message.recipient }}</div>
                  <div class="text-sm text-gray-500">{{ message.recipientName }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ message.content }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ message.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="message.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewMessageDetails(message)"
                    class="text-green-600 hover:text-green-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    v-if="message.status === 'failed'"
                    @click="resendMessage(message)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Resend
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Empty State -->
        <div v-if="messages.length === 0" class="text-center py-12">
          <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your filters or send some messages
          </p>
        </div>
  
        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200">
          <Pagination
            v-model:page="currentPage"
            :total-pages="totalPages"
            :total-items="totalMessages"
          />
        </div>
      </div>
  
      <!-- Message Detail Modal -->
      <Modal 
        v-if="selectedMessage"
        title="Message Details"
        @close="selectedMessage = null"
      >
        <div class="p-6">
          <dl class="grid grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt class="text-sm font-medium text-gray-500">Recipient</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ selectedMessage.recipient }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <StatusBadge :status="selectedMessage.status" />
              </dd>
            </div>
            <div class="col-span-2">
              <dt class="text-sm font-medium text-gray-500">Message</dt>
              <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {{ selectedMessage.content }}
              </dd>
            </div>
            <div class="col-span-2" v-if="selectedMessage.media">
              <dt class="text-sm font-medium text-gray-500">Media</dt>
              <dd class="mt-1">
                <img 
                  :src="selectedMessage.media" 
                  alt="Message media"
                  class="max-w-full h-auto rounded-lg"
                >
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Sent At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(selectedMessage.createdAt) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Type</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ selectedMessage.type }}
              </dd>
            </div>
          </dl>
  
          <!-- Status Timeline -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900">Status Timeline</h4>
            <ul class="mt-2 space-y-4">
              <li v-for="(status, index) in selectedMessage.statusHistory" 
                :key="index"
                class="flex items-center space-x-3"
              >
                <StatusBadge :status="status.status" />
                <span class="text-sm text-gray-500">
                  {{ formatDate(status.timestamp) }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { InboxIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'plan']
  })
  
  const messageStore = useMessageStore()
  
  const filters = ref({
    dateRange: 'last7days',
    startDate: '',
    endDate: '',
    status: '',
    type: '',
    search: ''
  })
  
  const messages = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalMessages = ref(0)
  const selectedMessage = ref(null)
  
  onMounted(() => {
    loadMessages()
  })
  
  watch([filters, currentPage], () => {
    loadMessages()
  })
  
  async function loadMessages() {
    try {
      const response = await messageStore.fetchMessages({
        ...filters.value,
        page: currentPage.value
      })
      
      messages.value = response.messages
      totalPages.value = response.totalPages
      totalMessages.value = response.totalMessages
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }
  
  async function resendMessage(message) {
    try {
      await messageStore.sendMessage({
        targetNumber: message.recipient,
        message: message.content,
        media: message.media
      })
      await loadMessages()
    } catch (error) {
      console.error('Error resending message:', error)
    }
  }
  
  function viewMessageDetails(message) {
    selectedMessage.value = message
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }
  </script>