<template>
    <div :class="containerClass">
      <div
        class="animate-spin rounded-full border-t-2 border-b-2 border-green-500"
        :class="sizeClasses"
      ></div>
      <span v-if="text" class="ml-2 text-sm text-gray-500">{{ text }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    text?: string
    size?: 'sm' | 'md' | 'lg'
    centered?: boolean
  }>()
  
  const sizeClasses = computed(() => ({
    'sm': 'h-4 w-4',
    'md': 'h-8 w-8',
    'lg': 'h-12 w-12'
  }[props.size || 'md']))
  
  const containerClass = computed(() => ({
    'flex items-center': true,
    'justify-center': props.centered
  }))
  </script>