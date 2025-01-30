<template>
  <div class="min-h-screen bg-gray-50">
    <header v-if="!isAuthPage" class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-green-600">
              {{ appName }}
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <div class="flex items-center space-x-4">
            <template v-if="!authStore.isAuthenticated">
              <NuxtLink 
                to="/login"
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </NuxtLink>
              <NuxtLink 
                to="/register"
                class="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const authStore = useAuthStore()
const appName = config.public.appName

// Check if current page is auth page (login/register)
const isAuthPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})
</script>