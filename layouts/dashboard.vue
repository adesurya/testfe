<!-- layouts/dashboard.vue -->
<template>
  <div>
    <!-- Mobile Navigation Bar -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="isSidebarOpen = true" class="p-2 rounded-md text-gray-500">
          <Bars3Icon class="h-6 w-6" />
        </button>
        <h1 class="text-lg font-semibold text-green-600">WhatsApp Dashboard</h1>
        <UserMenu />
      </div>
    </div>

    <!-- Sidebar for Desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:border-r">
      <div class="flex flex-col h-full">
        <div class="flex h-16 items-center px-6 border-b">
          <span class="text-xl font-bold text-green-600">WhatsApp Dashboard</span>
        </div>
        <nav class="flex-1 p-4 space-y-4">
          <SidebarLinks />
        </nav>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <TransitionRoot as="template" :show="isSidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="isSidebarOpen = false">
        <!-- Backdrop -->
        <TransitionChild
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <!-- Sidebar Panel -->
        <div class="fixed inset-0 flex">
          <TransitionChild
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex flex-1 w-full max-w-xs">
              <div class="flex flex-col h-full bg-white">
                <div class="flex h-16 items-center px-6 border-b">
                  <span class="text-xl font-bold text-green-600">Menu</span>
                  <button 
                    @click="isSidebarOpen = false"
                    class="ml-auto p-2 rounded-md text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                <nav class="flex-1 p-4">
                  <SidebarLinks @click="isSidebarOpen = false" />
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <main class="min-h-screen pt-16 lg:pt-0">
        <div class="px-4 py-6 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isSidebarOpen = ref(false)
</script>