<template>
  <div class="space-y-6">
    <PageHeader 
      title="Messages" 
      subtitle="Send and manage your WhatsApp messages"
    />

    <!-- Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Single Message Card -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <div class="flex items-center">
            <ChatBubbleLeftIcon class="h-8 w-8 text-green-500" />
            <h3 class="ml-3 text-xl font-medium text-gray-900">Single Message</h3>
          </div>
          <p class="mt-2 text-gray-500">
            Send individual messages to specific recipients
          </p>
          <div class="mt-4">
            <NuxtLink
              to="/dashboard/messages/single"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Send Single Message
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bulk Message Card -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <div class="flex items-center">
            <ChatBubbleLeftRightIcon class="h-8 w-8 text-green-500" />
            <h3 class="ml-3 text-xl font-medium text-gray-900">Bulk Message</h3>
          </div>
          <p class="mt-2 text-gray-500">
            Send messages to multiple recipients at once
          </p>
          <div class="mt-4">
            <NuxtLink
              to="/dashboard/messages/bulk"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Send Bulk Message
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChatBubbleLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})
</script>