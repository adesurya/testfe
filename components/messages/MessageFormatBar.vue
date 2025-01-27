<template>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="format in formats"
        :key="format.id"
        @click="$emit('format', format.id)"
        class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <component :is="format.icon" class="h-4 w-4 mr-2" />
        {{ format.label }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Bold, Italic, Strikethrough, Code } from 'lucide-vue-next'
  
  const formats = [
    { id: 'bold', label: 'Bold', icon: Bold },
    { id: 'italic', label: 'Italic', icon: Italic },
    { id: 'strike', label: 'Strikethrough', icon: Strikethrough },
    { id: 'code', label: 'Code', icon: Code }
  ]
  </script>