<template>
    <div class="space-y-6">
      <PageHeader 
        title="Messages" 
        subtitle="Send and manage your WhatsApp messages"
      />
  
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="currentTab = tab.name"
            :class="[
              currentTab === tab.name
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
  
      <!-- Message Composer -->
      <div v-if="currentTab === 'compose'">
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <form @submit.prevent="sendMessage" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Recipient Number
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    +
                  </span>
                  <input
                    v-model="messageForm.recipientNumber"
                    type="text"
                    required
                    placeholder="1234567890"
                    class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300"
                  >
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div class="mt-1">
                  <MessageFormatBar @format="applyFormat" />
                  <textarea
                    v-model="messageForm.content"
                    rows="4"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Type your message here..."
                  ></textarea>
                  <p class="mt-2 text-sm text-gray-500">
                    Available formats: **bold**, *italic*, ~strikethrough~
                  </p>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Media Attachment
                </label>
                <div class="mt-1">
                  <input
                    type="file"
                    @change="handleFileUpload"
                    accept="image/*,video/*"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  >
                </div>
              </div>
  
              <div class="flex items-center">
                <input
                  v-model="messageForm.scheduled"
                  type="checkbox"
                  class="h-4 w-4 text-green-600 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-900">
                  Schedule Message
                </label>
              </div>
  
              <div v-if="messageForm.scheduled">
                <label class="block text-sm font-medium text-gray-700">
                  Schedule Time
                </label>
                <input
                  v-model="messageForm.scheduleTime"
                  type="datetime-local"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  :min="minScheduleTime"
                >
              </div>
  
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="sending"
                  class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {{ sending ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Message History -->
      <div v-else-if="currentTab === 'history'">
        <MessageHistory />
      </div>
  
      <!-- Templates -->
      <div v-else-if="currentTab === 'templates'">
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Message Templates</h3>
              <button
                @click="showCreateTemplate = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon class="h-5 w-5 mr-2" />
                Create Template
              </button>
            </div>
  
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="template in templates" :key="template.id"
                class="border rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ template.name }}
                  </h4>
                  <div class="flex space-x-2">
                    <button
                      @click="useTemplate(template)"
                      class="text-green-600 hover:text-green-700"
                    >
                      Use
                    </button>
                    <button
                      @click="editTemplate(template)"
                      class="text-gray-600 hover:text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteTemplate(template)"
                      class="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  {{ template.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { PlusIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'plan', 'session']
  })
  
  const messageStore = useMessageStore()
  
  const tabs = [
    { name: 'compose', label: 'Compose Message' },
    { name: 'history', label: 'Message History' },
    { name: 'templates', label: 'Templates' }
  ]
  
  const currentTab = ref('compose')
  const sending = ref(false)
  const templates = ref([])
  const showCreateTemplate = ref(false)
  
  const messageForm = ref({
    recipientNumber: '',
    content: '',
    media: null,
    scheduled: false,
    scheduleTime: null
  })
  
  const minScheduleTime = computed(() => {
    const date = new Date()
    date.setMinutes(date.getMinutes() + 5)
    return date.toISOString().slice(0, 16)
  })
  
  onMounted(async () => {
    await loadTemplates()
  })
  
  async function loadTemplates() {
    try {
      const response = await messageStore.fetchTemplates()
      templates.value = response
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }
  
  function applyFormat(format) {
    const textarea = document.querySelector('textarea')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const content = messageForm.value.content
  
    const formats = {
      bold: '**',
      italic: '*',
      strikethrough: '~'
    }
  
    const markup = formats[format]
    messageForm.value.content = 
      content.substring(0, start) + 
      markup + 
      content.substring(start, end) + 
      markup + 
      content.substring(end)
  }
  
  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (file) {
      messageForm.value.media = file
    }
  }
  
  async function sendMessage() {
    try {
      sending.value = true
      await messageStore.sendMessage({
        recipientNumber: messageForm.value.recipientNumber,
        content: messageForm.value.content,
        media: messageForm.value.media,
        scheduleTime: messageForm.value.scheduled ? messageForm.value.scheduleTime : null
      })
  
      // Reset form
      messageForm.value = {
        recipientNumber: '',
        content: '',
        media: null,
        scheduled: false,
        scheduleTime: null
      }
  
      // Show success message
    } catch (error) {
      console.error('Error sending message:', error)
      // Show error message
    } finally {
      sending.value = false
    }
  }
  
  function useTemplate(template) {
    messageForm.value.content = template.content
    currentTab.value = 'compose'
  }
  
  function editTemplate(template) {
    // Implement template editing
  }
  
  function deleteTemplate(template) {
    // Implement template deletion
  }
  </script>