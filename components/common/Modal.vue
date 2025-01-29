<template>
  <TransitionRoot appear :show="true" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel 
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
              :class="{ 'max-w-lg': size === 'lg', 'max-w-xl': size === 'xl' }"
            >
              <div class="bg-white">
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                    {{ title }}
                  </DialogTitle>
                  <button
                    type="button"
                    class="bg-white rounded-md text-gray-400 hover:text-gray-500"
                    @click="$emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionRoot, 
  TransitionChild 
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
  size?: 'md' | 'lg' | 'xl'
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>