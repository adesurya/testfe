<template>
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg">
        <nav class="bg-white p-4 border-b">
          <ul class="flex space-x-4">
            <li v-for="tab in tabs" :key="tab.id">
              <button
                @click="currentTab = tab.id"
                :class="[
                  currentTab === tab.id 
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700',
                  'px-3 py-2 font-medium text-sm'
                ]"
              >
                {{ tab.name }}
              </button>
            </li>
          </ul>
        </nav>
  
        <div class="p-6">
          <Suspense>
            <template #default>
              <div v-if="currentTab === 'send'">
                <MessageSender />
              </div>
              <div v-else-if="currentTab === 'bulk'">
                <BulkMessageSender />
              </div>
              <div v-else-if="currentTab === 'history'">
                <MessageHistory />
              </div>
              <div v-else-if="currentTab === 'bind'">
                <WhatsAppBinder />
              </div>
            </template>
            <template #fallback>
              <div class="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const tabs = [
    { id: 'send', name: 'Send Message' },
    { id: 'bulk', name: 'Bulk Messages' },
    { id: 'history', name: 'History' },
    { id: 'bind', name: 'WhatsApp Binding' }
  ]
  
  const currentTab = ref('send')
  </script>