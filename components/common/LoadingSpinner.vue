<template>
    <div class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      <span v-if="text" class="ml-2 text-gray-500">{{ text }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    text?: string
  }>()
  </script>