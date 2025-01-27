<template>
    <div class="fixed top-4 right-4 z-50">
      <TransitionGroup name="fade">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'mb-2 p-4 rounded-md shadow-lg max-w-sm',
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          ]"
        >
          <div class="flex items-center">
            <CheckCircleIcon
              v-if="toast.type === 'success'"
              class="h-5 w-5 text-white mr-2"
            />
            <XCircleIcon
              v-else
              class="h-5 w-5 text-white mr-2"
            />
            <p class="text-white">{{ toast.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
  
  interface Toast {
    id: number
    message: string
    type: 'success' | 'error'
  }
  
  const toasts = ref<Toast[]>([])
  
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }
  
  // Expose the addToast method to other components
  defineExpose({ addToast })
  </script>