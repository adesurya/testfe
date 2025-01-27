<template>
    <div class="min-h-screen bg-gray-50">
      <header v-if="authStore.isAuthenticated" class="bg-white shadow">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <NuxtLink to="/dashboard" class="text-xl font-bold text-green-600">
                  WhatsApp Dashboard
                </NuxtLink>
              </div>
            </div>
            <div class="flex items-center">
              <UserMenu />
            </div>
          </div>
        </nav>
      </header>
  
      <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
  
      <Toast />
    </div>
  </template>
  
  <script setup lang="ts">
  const authStore = useAuthStore()
  </script>