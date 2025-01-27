<template>
    <div class="space-y-6">
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
  
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900">Message Template</h3>
        <div class="mt-4 space-y-4">
          <MessageFormatBar @format="applyFormat" />
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Template Message</label>
            <textarea
              ref="templateInput"
              v-model="template"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Use {name} for recipient name, {custom1}, {custom2} for custom fields"
            ></textarea>
          </div>
  
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
  
          <button
            @click="startBulkSend"
            :disabled="!canSend"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Start Bulk Send
          </button>
        </div>
      </div>
  
      <BulkProgress
        v-if="currentBulkId"
        :bulkId="currentBulkId"
        @complete="handleComplete"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { z } from 'zod'
  import { useBulkMessageStore } from '~/stores/bulkMessage'
  
  const recipientSchema = z.object({
    phone: z.string().regex(/^\+?[\d\s-]+$/),
    name: z.string().optional(),
    custom1: z.string().optional(),
    custom2: z.string().optional()
  })
  
  const bulkStore = useBulkMessageStore()
  const recipients = ref([])
  const template = ref('')
  const currentBulkId = ref(null)
  const templateInput = ref()
  
  const config = ref({
    baseDelay: 30,
    interval: 10
  })
  
  const canSend = computed(() => 
    recipients.value.length > 0 && 
    template.value.trim() && 
    !currentBulkId.value
  )
  
  async function startBulkSend() {
    try {
      const response = await bulkStore.sendBulk({
        recipients: recipients.value,
        template: template.value,
        config: config.value
      })
      currentBulkId.value = response.bulkId
    } catch (error) {
      console.error('Bulk send error:', error)
    }
  }
  
  function handleComplete() {
    currentBulkId.value = null
    recipients.value = []
    template.value = ''
  }
  
  function handleImportError(error) {
    // Handle CSV import errors
  }
  
  function applyFormat(format: string) {
    // Apply text formatting to template
  }
  </script>