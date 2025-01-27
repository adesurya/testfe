<template>
    <div class="flex items-center justify-between px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="$emit('update:page', page - 1)"
          :disabled="page === 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click="$emit('update:page', page + 1)"
          :disabled="page === totalPages"
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startItem }}</span>
            to
            <span class="font-medium">{{ endItem }}</span>
            of
            <span class="font-medium">{{ total }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="$emit('update:page', page - 1)"
              :disabled="page === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            
            <button
              v-for="pageNumber in displayedPages"
              :key="pageNumber"
              @click="$emit('update:page', pageNumber)"
              :class="[
                page === pageNumber
                  ? 'relative z-10 inline-flex items-center bg-green-600 px-4 py-2 text-sm font-semibold text-white'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ pageNumber }}
            </button>
  
            <button
              @click="$emit('update:page', page + 1)"
              :disabled="page === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
  
  const props = defineProps<{
    page: number
    perPage: number
    total: number
  }>()
  
  defineEmits<{
    (e: 'update:page', page: number): void
  }>()
  
  const totalPages = computed(() => Math.ceil(props.total / props.perPage))
  const startItem = computed(() => ((props.page - 1) * props.perPage) + 1)
  const endItem = computed(() => Math.min(props.page * props.perPage, props.total))
  
  const displayedPages = computed(() => {
    const pages = []
    let start = Math.max(1, props.page - 2)
    let end = Math.min(totalPages.value, props.page + 2)
  
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  
    if (end < totalPages.value) {
      if (end < totalPages.value - 1) pages.push('...')
      pages.push(totalPages.value)
    }
  
    return pages
  })
  </script>