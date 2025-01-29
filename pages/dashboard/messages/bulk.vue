<template>
    <div class="space-y-6">
      <PageHeader 
        title="Bulk Message Sender" 
        subtitle="Send messages to multiple recipients" 
      />
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Message Composer -->
        <div class="lg:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow">
            <form @submit.prevent="sendMessages" class="space-y-6">
              <!-- Target Numbers -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Upload Recipients (CSV)
                </label>
                <div class="mt-1">
                  <input
                    type="file"
                    accept=".csv"
                    @change="handleFileUpload"
                    class="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
                  >
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  CSV should contain a column named "phone" with WhatsApp numbers
                </p>
              </div>
  
              <!-- Message Template -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Message Template
                </label>
                <div class="mt-1">
                  <textarea
                    v-model="form.message"
                    rows="4"
                    class="block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Use {name} for recipient name, {custom1}, {custom2} for custom fields"
                  ></textarea>
                </div>
              </div>
  
              <!-- Delay Settings -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Base Delay (seconds)
                  </label>
                  <input
                    v-model.number="form.baseDelay"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Interval Delay (seconds)
                  </label>
                  <input
                    v-model.number="form.intervalDelay"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                </div>
              </div>
  
              <button
                type="submit"
                :disabled="!canSend || sending"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {{ sending ? 'Sending...' : 'Send Messages' }}
              </button>
            </form>
          </div>
        </div>
  
        <!-- Preview & Stats -->
        <div class="space-y-6">
          <!-- Recipients Preview -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Recipients</h3>
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                Total Recipients: {{ recipients.length }}
              </p>
              <div class="mt-2 max-h-48 overflow-y-auto">
                <ul class="divide-y divide-gray-200">
                  <li 
                    v-for="(recipient, index) in recipients.slice(0, 5)" 
                    :key="index"
                    class="py-2 text-sm text-gray-500"
                  >
                    {{ recipient.phone }}
                    <span v-if="recipient.name" class="text-gray-400">
                      ({{ recipient.name }})
                    </span>
                  </li>
                </ul>
                <p v-if="recipients.length > 5" class="mt-2 text-sm text-gray-500">
                  And {{ recipients.length - 5 }} more...
                </p>
              </div>
            </div>
          </div>
  
          <!-- Message Preview -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-medium text-gray-900">Message Preview</h3>
            <div class="mt-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-900 whitespace-pre-wrap">
                  {{ previewMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Bulk Progress Modal -->
      <Modal v-if="showProgress" @close="handleComplete">
        <BulkProgress
          :bulkId="currentBulkId"
          @complete="handleComplete"
        />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import Papa from 'papaparse'
  
  definePageMeta({
    middleware: ['auth', 'plan', 'session']
  })
  
  const messageStore = useMessageStore()
  
  const form = ref({
    message: '',
    baseDelay: 30,
    intervalDelay: 10
  })
  
  const recipients = ref([])
  const sending = ref(false)
  const showProgress = ref(false)
  const currentBulkId = ref(null)
  
  const canSend = computed(() => 
    recipients.value.length > 0 && 
    form.value.message.trim() && 
    !sending.value
  )
  
  const previewMessage = computed(() => {
    if (!form.value.message || !recipients.value.length) return ''
    
    let message = form.value.message
    const firstRecipient = recipients.value[0]
    
    // Replace template variables
    Object.entries(firstRecipient).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value as string)
    })
    
    return message
  })
  
  function handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return
  
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        recipients.value = results.data
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
      }
    })
  }
  
  async function sendMessages() {
    if (!canSend.value) return
  
    try {
      sending.value = true
      const response = await messageStore.sendBulkMessages({
        targetNumbers: recipients.value.map(r => r.phone),
        message: form.value.message,
        baseDelay: form.value.baseDelay,
        intervalDelay: form.value.intervalDelay
      })
  
      currentBulkId.value = response.bulkId
      showProgress.value = true
    } catch (error) {
      console.error('Error sending bulk messages:', error)
    } finally {
      sending.value = false
    }
  }
  
  function handleComplete() {
    showProgress.value = false
    currentBulkId.value = null
    // Reset form
    form.value = {
      message: '',
      baseDelay: 30,
      intervalDelay: 10
    }
    recipients.value = []
  }
  </script>