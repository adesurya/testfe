<template>
    <div class="space-y-4">
      <!-- Filters -->
      <div class="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search messages..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
        </div>
        <div class="w-40">
          <select
            v-model="filters.status"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="read">Read</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div class="w-40">
          <select
            v-model="filters.type"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">All Types</option>
            <option value="text">Text</option>
            <option value="media">Media</option>
            <option value="template">Template</option>
          </select>
        </div>
        <button
          @click="clearFilters"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear Filters
        </button>
      </div>
  
      <!-- Message List -->
      <div class="bg-white shadow rounded-lg">
        <div class="divide-y divide-gray-200">
          <div
            v-for="message in filteredMessages"
            :key="message.id"
            class="p-4 hover:bg-gray-50 cursor-pointer"
            @click="selectMessage(message)"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-sm font-medium text-gray-900">
                  {{ message.recipientNumber }}
                </h4>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                  {{ message.content }}
                </p>
              </div>
              <div class="flex flex-col items-end">
                <StatusBadge :status="message.status" />
                <span class="mt-1 text-xs text-gray-500">
                  {{ formatDate(message.createdAt) }}
                </span>
              </div>
            </div>
            <div v-if="message.media" class="mt-2">
              <img
                :src="message.media"
                alt="Media attachment"
                class="h-20 w-20 object-cover rounded"
              >
            </div>
          </div>
        </div>
  
        <div
          v-if="filteredMessages.length === 0"
          class="p-8 text-center text-gray-500"
        >
          No messages found
        </div>
      </div>
  
      <!-- Pagination -->
      <Pagination
        v-if="totalPages > 1"
        v-model:page="currentPage"
        :total-pages="totalPages"
      />
  
      <!-- Message Detail Modal -->
      <Modal
        v-if="selectedMessage"
        title="Message Details"
        @close="selectedMessage = null"
      >
        <MessageDetail
          :message="selectedMessage"
          @resend="resendMessage"
          @delete="deleteMessage"
        />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  const props = defineProps<{
    messages: any[]
    totalPages: number
  }>()
  
  const emit = defineEmits<{
    (e: 'update:page', page: number): void
    (e: 'resend', messageId: string): void
    (e: 'delete', messageId: string): void
  }>()
  
  const filters = ref({
    search: '',
    status: '',
    type: ''
  })
  
  const selectedMessage = ref(null)
  const currentPage = ref(1)
  
  const filteredMessages = computed(() => {
    return props.messages.filter(message => {
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        const contentMatch = message.content.toLowerCase().includes(searchLower)
        const numberMatch = message.recipientNumber.includes(searchLower)
        if (!contentMatch && !numberMatch) return false
      }
      
      if (filters.value.status && message.status !== filters.value.status) {
        return false
      }
      
      if (filters.value.type && message.type !== filters.value.type) {
        return false
      }
      
      return true
    })
  })
  
  function clearFilters() {
    filters.value = {
      search: '',
      status: '',
      type: ''
    }
  }
  
  function selectMessage(message) {
    selectedMessage.value = message
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }
  
  async function resendMessage(messageId: string) {
    emit('resend', messageId)
    selectedMessage.value = null
  }
  
  async function deleteMessage(messageId: string) {
    emit('delete', messageId)
    selectedMessage.value = null
  }
  
  watch(currentPage, (newPage) => {
    emit('update:page', newPage)
  })
  </script>