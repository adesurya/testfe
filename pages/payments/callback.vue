<template>
    <div class="p-4">
      <h1>Payment Callback</h1>
      <pre>{{ callbackData }}</pre>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const callbackData = ref(null)
  
  onMounted(async () => {
    try {
      const { authApi } = useApi()
      // Process callback data
      const response = await authApi('/api/payments/callback', {
        method: 'POST',
        body: callbackData.value
      })
      
      console.log('Callback processed:', response)
    } catch (error) {
      console.error('Error processing callback:', error)
    }
  })
  </script>