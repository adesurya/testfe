<template>
    <div class="min-h-[400px] flex flex-col items-center justify-center">
      <InboxIcon class="h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ title }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
      <div class="mt-6">
        <button
          v-if="actionLabel"
          @click="$emit('action')"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          {{ actionLabel }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { InboxIcon } from '@heroicons/vue/24/outline'
  
  defineProps<{
    title?: string
    message?: string
    actionLabel?: string
  }>()
  
  defineEmits<{
    (e: 'action'): void
  }>()
  </script>