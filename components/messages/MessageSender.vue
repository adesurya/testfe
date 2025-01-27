<template>
    <div class="space-y-6">
      <MessageFormatBar @format="applyFormat" />
      
      <form @submit.prevent="sendMessage" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Target Number</label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              +
            </span>
            <input
              v-model="form.targetNumber"
              type="text"
              required
              class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300"
              placeholder="1234567890"
            >
          </div>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            ref="messageInput"
            v-model="form.message"
            rows="4"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">
            Available formats: **bold**, _italic_, ~strike~, ```code```
          </p>
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Attachment</label>
          <MediaUploader v-model="form.media" />
        </div>
  
        <div class="flex items-center justify-between pt-4">
          <div class="flex items-center space-x-2">
            <input
              v-model="form.scheduleEnabled"
              type="checkbox"
              class="rounded border-gray-300 text-green-600"
            >
            <span class="text-sm text-gray-700">Schedule message</span>
          </div>
          
          <DateTimePicker
            v-if="form.scheduleEnabled"
            v-model="form.scheduleTime"
            :min="minScheduleTime"
          />
        </div>
  
        <button
          type="submit"
          :disabled="sending"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {{ sending ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
  
      <MessagePreview
        v-if="form.message"
        :message="form.message"
        :media="form.media"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useMessageStore } from '~/stores/message'
  import type { MessageForm } from '~/types'
  
  const messageStore = useMessageStore()
  const messageInput = ref<HTMLTextAreaElement>()
  const sending = ref(false)
  
  const form = ref<MessageForm>({
    targetNumber: '',
    message: '',
    media: null,
    scheduleEnabled: false,
    scheduleTime: null
  })
  
  const minScheduleTime = computed(() => {
    const date = new Date()
    date.setMinutes(date.getMinutes() + 5)
    return date
  })
  
  function applyFormat(format: string) {
    if (!messageInput.value) return
    
    const start = messageInput.value.selectionStart
    const end = messageInput.value.selectionEnd
    const textBefore = form.value.message.substring(0, start)
    const textAfter = form.value.message.substring(end)
    const selectedText = form.value.message.substring(start, end)
  
    const formatters = {
      bold: `**${selectedText}**`,
      italic: `_${selectedText}_`,
      strike: `~${selectedText}~`,
      code: '```' + selectedText + '```'
    }
  
    form.value.message = textBefore + formatters[format] + textAfter
  }
  
  async function sendMessage() {
    try {
      sending.value = true
      await messageStore.sendMessage({
        ...form.value,
        targetNumber: '+' + form.value.targetNumber.replace(/\D/g, '')
      })
      form.value = {
        targetNumber: '',
        message: '',
        media: null,
        scheduleEnabled: false,
        scheduleTime: null
      }
    } catch (error) {
      console.error('Send error:', error)
    } finally {
      sending.value = false
    }
  }
  </script>