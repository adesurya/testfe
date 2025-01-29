<template>
  <div class="space-y-4">
    <!-- Optional Filters -->
    <div v-if="!hideFilters" class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search messages..."
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
      </div>
      <select
        v-model="filters.status"
        class="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      >
        <option value="">All Status</option>
        <option value="sent">Sent</option>
        <option value="delivered">Delivered</option>
        <option value="failed">Failed</option>
      </select>
      <select
        v-model="filters.type"
        class="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
      >
        <option value="">All Types</option>
        <option value="text">Text</option>
        <option value="media">Media</option>
        <option value="template">Template</option>
      </select>
    </div>

    <!-- Messages List -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="message in displayedMessages" :key="message.id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <UserCircleIcon v-if="!message.recipientAvatar" class="h-8 w-8 text-gray-400" />
                  <img
                    v-else
                    :src="message.recipientAvatar"
                    alt=""
                    class="h-8 w-8 rounded-full"
                  >
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ message.recipientNumber }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(message.createdAt) }}
                  </div>
                </div>
              </div>
              <div>
                <StatusBadge :status="message.status" />
              </div>
            </div>
            <div class="mt-2">
              <div class="text-sm text-gray-900">
                {{ message.content }}
              </div>
              <div v-if="message.media" class="mt-2">
                <img
                  :src="message.media"
                  alt="Message media"
                  class="h-20 w-20 object-cover rounded"
                >
              </div>
            </div>
            <div class="mt-2 flex justify-end space-x-2">
              <button
                v-if="message.status === 'failed'"
                @click="resendMessage(message)"
                class="text-sm text-green-600 hover:text-green-500"
              >
                Resend
              </button>
              <button
                @click="showMessageDetails(message)"
                class="text-sm text-gray-600 hover:text-gray-500"
              >
                View Details
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Empty State -->
      <div v-if="displayedMessages.length === 0" class="text-center py-12">
        <ChatBubbleLeftRightIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No messages</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by sending your first message.
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!hideFilters && totalPages > 1" class="flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ paginationStart }}</span>
            to
            <span class="font-medium">{{ paginationEnd }}</span>
            of
            <span class="font-medium">{{ totalMessages }}</span>
            results
          </p>
        </div>
        <Pagination
          v-model:page="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </div>

    <!-- Message Details Modal -->
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
              {{ selectedMessage.recipientNumber }}
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
                class="max-w-full h-auto rounded"
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
            <dt class="text-sm font-medium text-gray-500">Session</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ selectedMessage.sessionId }}
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
import { ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  limit?: number
  hideFilters?: boolean
}>()

const messageStore = useMessageStore()

const filters = ref({
  search: '',
  status: '',
  type: ''
})

const currentPage = ref(1)
const totalPages = ref(1)
const totalMessages = ref(0)
const messages = ref([])
const selectedMessage = ref(null)

const displayedMessages = computed(() => {
  if (props.limit) {
    return messages.value.slice(0, props.limit)
  }
  return messages.value
})
// ... lanjutan script sebelumnya

const paginationStart = computed(() => {
  return ((currentPage.value - 1) * pageSize) + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize, totalMessages.value)
})

const pageSize = 10

watch([filters, currentPage], () => {
  if (!props.hideFilters) {
    loadMessages()
  }
})

onMounted(() => {
  loadMessages()
})

async function loadMessages() {
  try {
    const params = {
      ...filters.value,
      page: currentPage.value,
      limit: props.limit || pageSize
    }

    const response = await messageStore.fetchMessages(params)
    messages.value = response.messages
    totalPages.value = response.totalPages
    totalMessages.value = response.total
  } catch (error) {
    console.error('Error loading messages:', error)
  }
}

async function resendMessage(message) {
  try {
    await messageStore.sendMessage({
      targetNumber: message.recipientNumber,
      content: message.content,
      media: message.media
    })
    await loadMessages()
  } catch (error) {
    console.error('Error resending message:', error)
  }
}

function showMessageDetails(message) {
  selectedMessage.value = message
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}
</script>