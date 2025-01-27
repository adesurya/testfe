<template>
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div class="mt-6">
        <div v-if="isAdmin">
          <AdminStats />
        </div>
        <div v-else>
          <UserStats />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'checkPlan']

  })
  
  const authStore = useAuthStore()
  const isAdmin = computed(() => authStore.isAdmin)
  </script>