<template>
  <div
    aria-live="assertive"
    class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                  v-if="toast.type === 'success'"
                  class="h-6 w-6 text-green-400"
                />
                <XCircleIcon
                  v-else-if="toast.type === 'error'"
                  class="h-6 w-6 text-red-400"
                />
                <ExclamationCircleIcon
                  v-else
                  class="h-6 w-6 text-yellow-400"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ toast.title }}
                </p>
                <p v-if="toast.message" class="mt-1 text-sm text-gray-500">
                  {{ toast.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid'

interface Toast {
  id: number
  type: 'success' | 'error' | 'warning'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])

function addToast(toast: Omit<Toast, 'id'>) {
  const id = Date.now()
  const duration = toast.duration || 5000

  toasts.value.push({
    ...toast,
    id
  })

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// Expose the addToast method to other components
defineExpose({
  addToast: (toast: {
    type: 'success' | 'error' | 'warning'
    title: string
    message?: string
    duration?: number
  }) => {
    const id = Date.now()
    const duration = toast.duration || 5000

    toasts.value.push({
      ...toast,
      id
    })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
})
</script>