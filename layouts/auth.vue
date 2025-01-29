<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Background pattern -->
      <div class="fixed inset-0 z-0 opacity-30">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50" />
        <div class="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary-100/50" />
      </div>
  
      <!-- Content -->
      <div class="relative z-10">
        <slot />
      </div>
  
      <!-- Footer -->
      <footer class="fixed bottom-0 w-full py-4 text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  const config = useRuntimeConfig()
  const appName = config.public.appName
  </script>