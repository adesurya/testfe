<!-- components/messages/BulkMessageSender.vue -->
<template>
  <div class="space-y-6">
    <!-- CSV Import Section -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900">Import Recipients</h3>
        <div class="mt-4">
          <CSVImporter
            v-model="recipients"
            :validationSchema="recipientSchema"
            @error="handleImportError"
          />
        </div>
      </div>
    </div>

    <!-- Message Template Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900">Message Template</h3>
      <div class="mt-4 space-y-4">
        <!-- Message Editor Toolbar -->
        <div class="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50 rounded-t-lg">
          <!-- Text Formatting -->
          <button 
            v-for="format in textFormats"
            :key="format.id"
            @click="applyFormat(format.prefix, format.suffix)"
            class="p-1.5 rounded hover:bg-gray-100"
            :title="format.label"
          >
            <component :is="format.icon" class="h-4 w-4" />
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

          <!-- Image Upload -->
          <label class="p-1.5 rounded hover:bg-gray-100 cursor-pointer" title="Upload Image">
            <input 
              type="file" 
              ref="fileInput"
              class="hidden" 
              accept="image/*"
              @change="handleImageUpload"
            >
            📎
          </label>
        </div>

        <!-- Message Input -->
        <textarea
          ref="templateInput"
          v-model="template"
          rows="4"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Use {name} for recipient name, {custom1}, {custom2} for custom fields"
        ></textarea>

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

        <!-- Delay Settings -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Base Delay (seconds)</label>
            <input
              v-model.number="config.baseDelay"
              type="number"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Interval (seconds)</label>
            <input
              v-model.number="config.interval"
              type="number"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">{{ error }}</div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          @click="startBulkSend"
          :disabled="!canSend || sending"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {{ sending ? 'Sending...' : `Send to ${recipients.length} Recipients` }}
        </button>
      </div>
    </div>

    <!-- Progress Modal -->
    <Modal v-if="showProgress" title="Bulk Message Progress" @close="handleComplete">
      <div class="p-6 space-y-4">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">Progress</div>
          <StatusBadge :status="progress.status" />
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-green-600 h-2.5 rounded-full transition-all duration-500"
            :style="{ width: `${progressPercentage}%` }"
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
            <div class="text-2xl font-bold text-gray-900">{{ remainingMessages }}</div>
            <div class="text-sm text-gray-500">Pending</div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { useBulkMessageStore } from '~/stores/bulkMessage'

const bulkStore = useBulkMessageStore()
const authStore = useAuthStore()

// State
const recipients = ref([])
const template = ref('')
const error = ref(null)
const sending = ref(false)
const showProgress = ref(false)
const progress = ref({ sent: 0, failed: 0, status: 'pending' })
const showEmojiPicker = ref(false)
const fileInput = ref(null)
const selectedImage = ref(null)
const templateInput = ref(null)

// Config
const config = ref({
  baseDelay: 30,
  interval: 10
})

// Emoji map
const emojis = {
  ':smile:': '😊',
  ':heart:': '❤️',
  ':check:': '✅',
  ':x:': '❌',
  ':star:': '⭐',
  // Add more emojis as needed
}

// Text formatting options
const textFormats = [
  { id: 'bold', label: 'Bold', prefix: '*', suffix: '*' },
  { id: 'italic', label: 'Italic', prefix: '_', suffix: '_' },
  { id: 'strike', label: 'Strikethrough', prefix: '~', suffix: '~' }
]

// Computed
const canSend = computed(() => recipients.value.length > 0 && template.value.trim())
const imagePreview = computed(() => selectedImage.value ? URL.createObjectURL(selectedImage.value) : null)
const progressPercentage = computed(() => {
  const total = recipients.value.length
  return total > 0 ? (progress.value.sent / total) * 100 : 0
})
const remainingMessages = computed(() => recipients.value.length - progress.value.sent - progress.value.failed)

// Methods
function applyFormat(prefix, suffix) {
  if (!templateInput.value) return
  
  const start = templateInput.value.selectionStart
  const end = templateInput.value.selectionEnd
  const text = template.value
  
  const selection = text.substring(start, end)
  const formatted = `${prefix}${selection}${suffix}`
  
  template.value = text.substring(0, start) + formatted + text.substring(end)
  
  nextTick(() => {
    templateInput.value.focus()
    templateInput.value.setSelectionRange(start + prefix.length, end + prefix.length)
  })
}

function insertEmoji(emoji) {
  const input = templateInput.value
  const start = input.selectionStart
  template.value = template.value.slice(0, start) + emoji + template.value.slice(start)
  showEmojiPicker.value = false
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

async function startBulkSend() {
  try {
    error.value = null
    sending.value = true
    showProgress.value = true

    const payload = {
      userId: authStore.user.id.toString(),
      recipients: recipients.value,
      message: template.value,
      image: selectedImage.value,
      baseDelay: config.value.baseDelay,
      intervalDelay: config.value.interval
    }

    const response = await bulkStore.sendBulkMessages(payload)

    if (response.success) {
      // Reset form
      template.value = ''
      recipients.value = []
      selectedImage.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }

      // Show success notification
      useToast().add({
        title: 'Success',
        description: 'Bulk message sending has started',
        color: 'green'
      })
    } else {
      throw new Error(response.error || 'Failed to start bulk send')
    }

  } catch (err) {
    console.error('Bulk send error:', err)
    error.value = err.message
    useToast().add({
      title: 'Error',
      description: err.message,
      color: 'red'
    })
  } finally {
    sending.value = false
  }
}

function handleComplete() {
  showProgress.value = false
  progress.value = { sent: 0, failed: 0, status: 'pending' }
}
</script>