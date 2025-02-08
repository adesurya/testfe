<!-- pages/dashboard/messages/single.vue -->
<template>
    <div ref="toastContainerRef"></div>
    <div class="space-y-6">
    <!-- Toast Container -->
    <ClientOnly>
      <div ref="toastContainerRef"></div>
    </ClientOnly>

      <PageHeader 
        title="Single Message" 
        subtitle="Send a message to individual recipient"
      />
      <UNotifications />

      <div class="bg-white shadow rounded-lg p-6">
        <form @submit.prevent="sendMessage" class="space-y-6">
          <!-- Phone Number Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div class="flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                +62
              </span>
              <input
                v-model="form.phoneNumber"
                type="text"
                placeholder="8123456789"
                required
                class="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Enter number without leading zero (0)</p>
          </div>
  
          <!-- Message Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Message
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
                  @click="insertFormat('~~', '~~')"
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
  
                <!-- Image Upload -->
                <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Image (Optional)
                </label>
                <div class="mt-1 flex items-center">
                    <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileSelect"
                    accept="image/*"
                    class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                    />
                </div>
              </div>
  
              <!-- Text Area -->
              <textarea
                v-model="form.message"
                rows="4"
                required
                class="block w-full p-3 border-0 focus:ring-0 sm:text-sm"
                placeholder="Type your message here..."
              ></textarea>
  
              <!-- Preview -->
              <div class="border-t p-3 bg-gray-50">
                <div class="text-sm font-medium text-gray-500 mb-2">Preview</div>
                <div class="prose prose-sm max-w-none whitespace-pre-wrap">
                  {{ previewMessage }}
                </div>
              </div>
              
            </div>
          </div>
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

  
     <!-- Error Alert -->
     <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error sending message
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Success
              </h3>
              <div class="mt-2 text-sm text-green-700">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
  
          <!-- Submit Button -->
          <div>
          <button
            type="submit"
            :disabled="sending || !form.message || !form.phoneNumber"
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
              Send Message
            </template>
          </button>
        </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>

import { ref, computed } from 'vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
  
definePageMeta({
  layout: 'dashboard'
})

  const messageStore = useMessageStore()
  const authStore = useAuthStore()
  const { toast } = useToast()


  const form = ref({
    phoneNumber: '',
    message: '',
    image: null
  })
  
  const fileInput = ref(null)
  const sending = ref(false)
  const showEmojiPicker = ref(false)
  const error = ref(null)
  const successMessage = ref(null)
  const selectedImage = ref(null)

  const toastContainerRef = ref(null)

// Emoji mapping
  const emojis = {
    ':smile:': '😊',
    ':heart:': '❤️',
    ':check:': '✅',
    ':x:': '❌',
    ':star:': '⭐',
    // Add more emojis as needed
  }
  
  // Message preview with emoji replacement
  const previewMessage = computed(() => {
    let text = form.value.message
    Object.entries(emojis).forEach(([code, emoji]) => {
      text = text.replace(new RegExp(code, 'g'), emoji)
    })
    return text
  })
  
  // Image preview URL
  const imagePreview = computed(() => {
  if (selectedImage.value) {
    return URL.createObjectURL(selectedImage.value)
  }
  return null
})
  
function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      error.value = 'Please select an image file'
      return
    }
    // Validasi ukuran file (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Image size should not exceed 5MB'
      return
    }
    selectedImage.value = file
  }
}

  function insertFormat(prefix, suffix) {
    const textarea = document.querySelector('textarea')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.value.message
    
    const selection = text.substring(start, end)
    const formatted = `${prefix}${selection}${suffix}`
    
    form.value.message = text.substring(0, start) + formatted + text.substring(end)
    
    // Reset cursor position
    nextTick(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    })
  }
  
  function insertEmoji(emoji) {
    const textarea = document.querySelector('textarea')
    const start = textarea.selectionStart
    form.value.message = form.value.message.slice(0, start) + emoji + form.value.message.slice(start)
    showEmojiPicker.value = false
  }
  
  function handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        error.value = 'Image size should not exceed 5MB'
        return
      }
      form.value.image = file
    }
  }
  
  function removeImage() {
  selectedImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
  
async function sendMessage() {
  if (!form.value.phoneNumber || !form.value.message) {
    error.value = 'Please fill in all required fields'
    return
  }

  try {
    error.value = null
    successMessage.value = null
    sending.value = true

    const payload = {
      userId: authStore.user.id.toString(),
      targetNumber: `62${form.value.phoneNumber.replace(/^0+/, '')}`,
      message: form.value.message,
      delay: 0,
      imagePath: selectedImage.value // File object jika ada
    }

    console.log('Sending payload:', payload) // Debug log

    const response = await messageStore.sendMessage(payload)

    if (response.success === false) {
      error.value = response.error || 'Failed to send message. Please check your input and try again.'
    } else {
      // Reset form
      form.value = {
        phoneNumber: '',
        message: ''
      }
      selectedImage.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      successMessage.value = 'Message sent successfully!'
    }

  } catch (err) {
    console.error('Error sending message:', err)
    error.value = err.message || 'Failed to send message. Please check your input and try again.'
  } finally {
    sending.value = false
  }
}
  </script>