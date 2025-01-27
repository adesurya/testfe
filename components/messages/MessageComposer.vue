<template>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Message Format</label>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            v-for="format in formats"
            :key="format.type"
            @click="applyFormat(format)"
            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium"
            :class="format.buttonClass"
          >
            {{ format.label }}
          </button>
        </div>
      </div>
  
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Target Number</label>
          <input 
            v-model="message.targetNumber"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            v-model="message.content"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          ></textarea>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Image (optional)</label>
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="mt-1 block w-full"
          >
        </div>
  
        <button
          @click="sendMessage"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Send Message
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const { authApi } = useApi()
  
  const message = ref({
    targetNumber: '',
    content: '',
    imagePath: ''
  })
  
  const formats = [
    { type: 'bold', label: 'Bold', buttonClass: 'bg-gray-100 hover:bg-gray-200', wrapper: '**' },
    { type: 'italic', label: 'Italic', buttonClass: 'bg-gray-100 hover:bg-gray-200', wrapper: '__' },
    { type: 'strike', label: 'Strikethrough', buttonClass: 'bg-gray-100 hover:bg-gray-200', wrapper: '~~' }
  ]
  
  function applyFormat(format) {
    const textarea = document.querySelector('textarea')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = message.value.content
  
    message.value.content = 
      text.substring(0, start) + 
      format.wrapper + 
      text.substring(start, end) + 
      format.wrapper + 
      text.substring(end)
  }
  
  async function handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      
      try {
        const response = await authApi('/api/upload', {
          method: 'POST',
          body: formData
        })
        message.value.imagePath = response.path
      } catch (error) {
        console.error('Upload error:', error)
      }
    }
  }
  
  async function sendMessage() {
    try {
      await authApi('/api/messages/send', {
        method: 'POST',
        body: {
          targetNumber: message.value.targetNumber,
          message: message.value.content,
          imagePath: message.value.imagePath
        }
      })
      // Reset form
      message.value = { targetNumber: '', content: '', imagePath: '' }
    } catch (error) {
      console.error('Send error:', error)
    }
  }
  </script>