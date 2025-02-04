<!-- components/WhatsappSessionCard.vue -->
<template>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <DevicePhoneMobileIcon class="h-8 w-8 text-gray-400" />
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ session.phone_number }}
          </h3>
          <p class="text-sm text-gray-500">
            Last active: {{ formatDate(session.updated_at) }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <StatusBadge :status="session.status" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { DevicePhoneMobileIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    session: {
      type: Object,
      required: true
    }
  })
  
  function formatDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  </script>