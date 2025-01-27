<template>
    <div class="space-y-4">
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
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
                <div class="text-sm text-gray-900">{{ message.recipientNumber }}</div>
                <div class="text-sm text-gray-500">{{ message.recipientName }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ message.content }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="message.status" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ message.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewDetails(message)"
                  class="text-green-600 hover:text-green-900"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <Pagination
        v-if="totalPages > 1"
        v-model:page="currentPage"
        :total-pages="totalPages"
      />
  
      <!-- Message Details Modal -->
      <Modal
        v-if="selectedMessage"
        title="Message Details"
        @close="selectedMessage = null"
      >
        <div class="p-6 space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Recipient</h4>
            <p class="mt-1 text-sm text-gray-900">
              {{ selectedMessage.recipientNumber }}
              ({{ selectedMessage.recipientName }})
            </p>
          </div>
  
          <div>
            <h4 class="text-sm font-medium text-gray-500">Message Content</h4>
            <p class="mt-1 text-sm text-gray-900">{{ selectedMessage.content }}</p>
          </div>
  
          <div>
            <h4 class="text-sm font-medium text-gray-500">Status History</h4>
            <div class="mt-1 space-y-2">
              <div
                v-for="(status, index) in selectedMessage.statusHistory"
                :key="index"
                class="flex items-center space-x-2"
              >
                <StatusBadge :status="status.status" />
                <span class="text-sm text-gray-500">
                  {{ formatDate(status.timestamp) }}
                </span>
              </div>
            </div>
          </div>
  
          <div v-if="selectedMessage.media">
            <h4 class="text-sm font-medium text-gray-500">Media Attachments</h4>
            <div class="mt-2">
              <img
                :src="selectedMessage.media"
                alt="Attachment"
                class="max-w-full h-auto rounded"
              >
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  const props = defineProps<{
    limit?: number
  }>()
  
  const { authApi } = useApi()
  const messages = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const selectedMessage = ref(null)
  
  onMounted(() => {
    loadMessages()
  })
  
  async function loadMessages() {
    try {
      const response = await authApi('/api/messages/history', {
        params: {
          page: currentPage.value,
          limit: props.limit
        }
      })
      messages.value = response.data.messages
      totalPages.value = response.data.totalPages
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }
  
  function viewDetails(message) {
    selectedMessage.value = message
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }
  
  watch(currentPage, () => {
    loadMessages()
  })
  </script>