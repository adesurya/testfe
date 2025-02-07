<template>
  <div class="space-y-6">
    <PageHeader 
      title="Bulk Message" 
      subtitle="Send messages to multiple recipients"
    />

    <div class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="sendBulkMessage" class="space-y-6">
        <!-- CSV Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Upload Recipients (CSV)
          </label>
          <div class="flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-12h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                  <span>Upload a file</span>
                  <input 
                    type="file"
                    class="sr-only" 
                    accept=".csv"
                    @change="handleFileUpload"
                  >
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV file only</p>
            </div>
          </div>

          <!-- CSV Format Example -->
          <div class="mt-2">
            <details class="text-sm text-gray-500">
              <summary class="cursor-pointer hover:text-gray-700">
                View CSV format example
              </summary>
              <div class="mt-2 bg-gray-50 p-4 rounded-md">
                <p class="font-medium mb-2">CSV Format:</p>
                <pre class="text-xs bg-white p-2 rounded border">phone,name,custom1,custom2
8123456789,John Doe,VIP Customer,Region A
8234567890,Jane Smith,Regular,Region B
8345678901,Bob Wilson,VIP,Region C</pre>
                <ul class="mt-2 space-y-1 list-disc list-inside text-xs">
                  <li>Phone numbers should be without leading zero or country code</li>
                  <li>Country code (+62) will be added automatically</li>
                  <li>Name and custom fields are optional</li>
                  <li>Use {name}, {custom1}, {custom2} in message to personalize</li>
                </ul>
                <button 
                  @click="downloadSampleCsv"
                  class="mt-2 inline-flex items-center text-green-600 hover:text-green-500"
                >
                  <DownloadIcon class="h-4 w-4 mr-1" />
                  Download sample CSV
                </button>
              </div>
            </details>
          </div>
        </div>

        <!-- Recipients Preview -->
        <div v-if="recipients.length > 0">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700">Recipients Preview</h3>
            <span class="text-sm text-gray-500">
              Total: {{ recipients.length }} numbers
            </span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="max-h-40 overflow-y-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom1</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom2</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(recipient, index) in recipients.slice(0, 5)" :key="index">
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">+62{{ recipient.phone }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ recipient.name || '-' }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ recipient.custom1 || '-' }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ recipient.custom2 || '-' }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="recipients.length > 5" class="pt-2 text-sm text-gray-500 text-center">
                And {{ recipients.length - 5 }} more...
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Message Template
          </label>
          <div class="border rounded-lg shadow-sm">
            <!-- Toolbar -->
            <div class="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50">
              <!-- Text Formatting -->
              <button 
                type="button"
                @click="insertFormat('**', '**')"
                class="p-1.5 rounded hover:bg-gray-100"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button 
                type="button"
                @click="insertFormat('_', '_')"
                class="p-1.5 rounded hover:bg-gray-100"
                title="Italic"
              >
                <i>I</i>
              </button>
              <button 
                type="button"
                @click="insertFormat('~~', '~~')"
                class="p-1.5 rounded hover:bg-gray-100"
                title="Strikethrough"
              >
                <span class="line-through">S</span>
              </button>

              <div class="w-px h-5 bg-gray-300"></div>

              <!-- Template Variables -->
              <button 
                type="button"
                @click="insertTemplate('{name}')"
                class="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                title="Insert recipient name"
              >
                {name}
              </button>
              <button 
                type="button"
                @click="insertTemplate('{custom1}')"
                class="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                title="Insert custom field 1"
              >
                {custom1}
              </button>
              <button 
                type="button"
                @click="insertTemplate('{custom2}')"
                class="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                title="Insert custom field 2"
              >
                {custom2}
              </button>

              <div class="w-px h-5 bg-gray-300"></div>

              <!-- Emoji Picker -->
              <div class="relative">
                <button 
                  type="button"
                  @click="showEmojiPicker = !showEmojiPicker"
                  class="p-1.5 rounded hover:bg-gray-100"
                  title="Insert Emoji"
                >
                  😊
                </button>
                <div 
                  v-if="showEmojiPicker" 
                  v-click-outside="() => showEmojiPicker = false"
                  class="absolute z-50 mt-1 w-64 p-2 bg-white rounded-lg shadow-lg border"
                >
                  <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    <button
                      v-for="(emoji, code) in emojis"
                      :key="code"
                      type="button"
                      @click="insertEmoji(emoji)"
                      class="p-1 text-xl hover:bg-gray-100 rounded"
                      :title="code"
                    >
                      {{ emoji }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Text Area -->
            <textarea
              v-model="message"
              rows="6"
              required
              class="block w-full p-3 border-0 focus:ring-0 sm:text-sm"
              placeholder="Type your message template here...&#10;Use {name}, {custom1}, {custom2} to personalize the message"
            ></textarea>

            <!-- Preview -->
            <div class="border-t p-3 bg-gray-50">
              <div class="text-sm font-medium text-gray-500 mb-2">Preview (with sample data)</div>
              <div class="prose prose-sm max-w-none whitespace-pre-wrap">
                {{ previewMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error sending messages
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="sending || !message || recipients.length === 0"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            <template v-if="sending">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </template>
            <template v-else>
              Send to {{ recipients.length }} Recipients
            </template>
          </button>
        </div>
      </form>
    </div>

    <!-- Progress Modal -->
    <Modal v-if="showProgress" @close="handleComplete">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Sending Progress</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">Progress</div>
            <StatusBadge :status="progress.status" />
          </div>

          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-green-600 h-2.5 rounded-full transition-all duration-500"
              :style="{ width: `${(progress.sent / recipients.length) * 100}%` }"
            ></div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-gray-50 rounded p-3">
              <div class="text-2xl font-bold text-gray-900">{{ progress.sent }}</div>
              <div class="text-sm text-gray-500">Sent</div>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <div class="text-2xl font-bold text-gray-900">{{ progress.failed }}</div>
              <div class="text-sm text-gray-500">Failed</div>
            </div>
            <div class="bg-gray-50 rounded p-3">
              <div class="text-2xl font-bold text-gray-900">{{ recipients.length - progress.sent - progress.failed }}</div>
              <div class="text-sm text-gray-500">Pending</div>
            </div>
          </div>

          <div v-if="progress.failed > 0" class="bg-red-50 rounded p-4">
            <h4 class="text-sm font-medium text-red-800 mb-2">Failed Numbers:</h4>
            <ul class="text-sm text-red-700 space-y-1">
              <li v-for="number in progress.failedNumbers" :key="number">
                {{ number }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DownloadIcon, XCircleIcon } from '@heroicons/vue/24/outline'

// Define page layout
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const messageStore = useMessageStore()

// Form state
const message = ref('')
const recipients = ref([])
const sending = ref(false)
const showEmojiPicker = ref(false)
const showProgress = ref(false)
const error = ref(null)

// Progress state
const progress = ref({
  status: 'pending',
  sent: 0,
  failed: 0,
  failedNumbers: []
})

// Emoji mapping
const emojis = {
  ':fire:': '🔥',
  ':smile:': '😊',
  ':heart:': '❤️',
  ':check:': '✅',
  ':x:': '❌',
  ':star:': '⭐',
  ':laugh:': '😂',
  ':wink:': '😉',
  ':cry:': '😢',
  ':angry:': '😠',
  ':cool:': '😎',
  ':love:': '😍',
  ':thinking:': '🤔',
  ':clap:': '👏',
  ':pray:': '🙏',
  ':rocket:': '🚀',
  ':warning:': '⚠️',
  ':info:': 'ℹ️',
  ':phone:': '📱',
  ':mail:': '📧',
  ':calendar:': '📅',
  ':time:': '⌚',
  ':money:': '💰',
  ':ok:': '👌'
}

// Sample data for preview
const sampleData = {
  name: 'John Doe',
  custom1: 'VIP Customer',
  custom2: 'Region A'
}

// Message preview with template variables and emoji replacement
const previewMessage = computed(() => {
  let text = message.value
  
  // Replace template variables with sample data
  Object.entries(sampleData).forEach(([key, value]) => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), value)
  })
  
  // Replace emoji codes with actual emojis
  Object.entries(emojis).forEach(([code, emoji]) => {
    text = text.replace(new RegExp(code, 'g'), emoji)
  })
  
  return text
})

// File handling functions
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target.result
      const rows = text.split('\n')
      
      // Find the headers
      const headers = rows[0].toLowerCase().trim().split(',')
      const phoneIndex = headers.findIndex(h => h.includes('phone'))
      const nameIndex = headers.findIndex(h => h.includes('name'))
      const custom1Index = headers.findIndex(h => h.includes('custom1'))
      const custom2Index = headers.findIndex(h => h.includes('custom2'))

      if (phoneIndex === -1) {
        error.value = 'CSV must contain a phone column'
        return
      }

      // Process rows
      const processedRecipients = rows
        .slice(1) // Skip header row
        .filter(row => row.trim()) // Remove empty rows
        .map(row => {
          const columns = row.split(',').map(col => col.trim())
          const phone = columns[phoneIndex]?.replace(/^0+/, '') // Remove leading zeros
          
          if (!phone) return null

          return {
            phone: phone.startsWith('62') ? phone : `62${phone}`,
            name: nameIndex !== -1 ? columns[nameIndex] || '' : '',
            custom1: custom1Index !== -1 ? columns[custom1Index] || '' : '',
            custom2: custom2Index !== -1 ? columns[custom2Index] || '' : ''
          }
        })
        .filter(recipient => recipient !== null)

      if (processedRecipients.length === 0) {
        error.value = 'No valid phone numbers found in CSV'
        return
      }

      recipients.value = processedRecipients
      error.value = null
    } catch (err) {
      error.value = 'Error processing CSV file'
      console.error('CSV processing error:', err)
    }
  }

  reader.onerror = () => {
    error.value = 'Error reading CSV file'
  }

  reader.readAsText(file)
}

function downloadSampleCsv() {
  const csvContent = `phone,name,custom1,custom2
8123456789,John Doe,VIP Customer,Region A
8234567890,Jane Smith,Regular Customer,Region B
8345678901,Bob Wilson,VIP Customer,Region C`

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'sample_recipients.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Editor functions
function insertFormat(prefix, suffix) {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = message.value
  
  const selection = text.substring(start, end)
  const formatted = `${prefix}${selection}${suffix}`
  
  message.value = text.substring(0, start) + formatted + text.substring(end)
  
  // Reset cursor position
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, end + prefix.length)
  })
}

function insertTemplate(template) {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  message.value = message.value.slice(0, start) + template + message.value.slice(start)
  
  // Place cursor after template
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + template.length, start + template.length)
  })
}

function insertEmoji(emoji) {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  message.value = message.value.slice(0, start) + emoji + message.value.slice(start)
  showEmojiPicker.value = false
  
  // Place cursor after emoji
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + emoji.length, start + emoji.length)
  })
}

// Message sending functions
async function sendBulkMessage() {
  if (!message.value || recipients.value.length === 0) return

  try {
    error.value = null
    sending.value = true
    showProgress.value = true

    const response = await messageStore.sendBulkMessages({
      targetNumbers: recipients.value.map(r => r.phone),
      message: message.value,
      baseDelay: 5,
      intervalDelay: 5
    })

    if (response.bulkId) {
      startProgressPolling(response.bulkId)
    } else {
      throw new Error('No bulk ID received from server')
    }

  } catch (err) {
    error.value = err.message
    showProgress.value = false
    useToast().error('Failed to send messages')
  } finally {
    sending.value = false
  }
}

let pollInterval = null

function startProgressPolling(bulkId) {
  if (pollInterval) clearInterval(pollInterval)

  pollInterval = setInterval(async () => {
    try {
      const status = await messageStore.getBulkProgress(bulkId)
      progress.value = status

      if (['completed', 'failed'].includes(status.status)) {
        clearInterval(pollInterval)
        if (status.status === 'completed') {
          useToast().success('All messages sent successfully')
        }
      }
    } catch (err) {
      console.error('Error polling progress:', err)
      clearInterval(pollInterval)
      error.value = 'Error checking message status'
    }
  }, 2000) // Poll every 2 seconds
}

function handleComplete() {
  showProgress.value = false
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
  
  progress.value = {
    status: 'pending',
    sent: 0,
    failed: 0,
    failedNumbers: []
  }
  
  message.value = ''
  recipients.value = []
  error.value = null
}

// Event listeners
onMounted(() => {
  // Close emoji picker when clicking outside
  document.addEventListener('click', (event) => {
    if (showEmojiPicker.value && !event.target.closest('.emoji-picker')) {
      showEmojiPicker.value = false
    }
  })
})

onUnmounted(() => {
  // Clean up interval if component is unmounted
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>