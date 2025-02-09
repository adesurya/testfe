<template>
  <div class="space-y-6">
    <PageHeader 
      title="Bulk Message" 
      subtitle="Send messages to multiple recipients"
    />

    <UNotifications />

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
                    <!-- <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom1</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom2</th> -->
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(recipient, index) in recipients.slice(0, 5)" :key="index">
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">+{{ recipient.phone }}</td>
                    <!-- <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ recipient.name || '-' }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ recipient.custom1 || '-' }}</td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ recipient.custom2 || '-' }}</td> -->
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
                @click="insertFormat('*', '*')"
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
                @click="insertFormat('~', '~')"
                class="p-1.5 rounded hover:bg-gray-100"
                title="Strikethrough"
              >
                <span class="line-through">S</span>
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
              placeholder="Type your message template here..."
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

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Image (Optional)
        </label>
        <div class="mt-1 flex items-center">
            <input
              type="file"
              ref="fileInput"
              @change="handleImageUpload"
              accept="image/*"
              class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
        </div>
      <!-- Image Preview -->
      <div v-if="selectedImage" class="mt-2">
        <div class="relative inline-block">
          <img 
            :src="imagePreview" 
            alt="Selected image" 
            class="h-32 w-32 object-cover rounded-lg"
          />
          <button
            type="button"
            @click="removeImage"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <XCircleIcon class="h-5 w-5" />
          </button>
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
import { XCircleIcon } from '@heroicons/vue/24/outline'

// Define page layout
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const fileInput = ref(null)
const selectedImage = ref(null)
const messageStore = useMessageStore()
const authStore = useAuthStore()

// Tambahan computed property
const imagePreview = computed(() => {
  if (selectedImage.value) {
    return URL.createObjectURL(selectedImage.value)
  }
  return null
})
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

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Image size should not exceed 5MB'
      return
    }
    selectedImage.value = file
  }
}

function removeImage() {
  selectedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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
      const text = e.target.result.toString()
      const rows = text.split('\n')
      
      const headers = rows[0].toLowerCase().trim().split(',')
      const phoneIndex = headers.findIndex(h => h.includes('phone'))

      if (phoneIndex === -1) {
        error.value = 'CSV must contain a phone column'
        return
      }

      // Process rows
      recipients.value = rows
        .slice(1)
        .filter(row => row.trim())
        .map(row => {
          const columns = row.split(',').map(col => col.trim())
          // Ambil hanya angka dari kolom phone
          let phone = columns[phoneIndex]?.split(';')[0]?.replace(/^0+/, '') // Ambil bagian sebelum semicolon dan hapus leading zeros
          
          if (!phone) return null

          // Format nomor telepon
          if (!phone.startsWith('62')) {
            phone = `62${phone}`
          }

          return { phone }
        })
        .filter(recipient => recipient !== null)

      if (recipients.value.length === 0) {
        error.value = 'No valid phone numbers found in CSV'
        return
      }

      console.log('Processed recipients:', recipients.value)
      error.value = null

    } catch (err) {
      console.error('CSV processing error:', err)
      error.value = 'Error processing CSV file'
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

    // Create FormData
    const formData = new FormData()

    // Add each target number individually
    recipients.value.forEach(recipient => {
      formData.append('targetNumbers[]', recipient.phone)
    })

    // Add message
    formData.append('message', message.value)

    // Add image if exists
    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    // Debug log
    console.log('Sending bulk message with data:', {
      targetNumbers: recipients.value.map(r => r.phone),
      message: message.value,
      hasImage: !!selectedImage.value
    })

    const response = await messageStore.sendBulkMessages(formData)

    if (response.success) {
      // Reset form
      message.value = ''
      recipients.value = []
      selectedImage.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }

      useToast().add({
        title: 'Success',
        description: 'Bulk messages are being sent',
        color: 'green'
      })
    } else {
      throw new Error(response.error || 'Failed to send messages')
    }

  } catch (err) {
    console.error('Error sending bulk messages:', err)
    error.value = err.message
    showProgress.value = false
    useToast().add({
      title: 'Error',
      description: err.message,
      color: 'red'
    })
  } finally {
    sending.value = false
  }
}

function handleSuccess(response) {
  useToast().add({
    title: 'Success',
    description: 'Messages are being sent',
    color: 'green'
  })

  if (response.bulkId) {
    startProgressPolling(response.bulkId)
    // Reset form
    message.value = ''
    recipients.value = []
    selectedImage.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
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
  selectedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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