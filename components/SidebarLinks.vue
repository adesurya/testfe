<!-- components/SidebarLinks.vue -->
<template>
    <div class="space-y-4">
      <!-- Main Navigation -->
      <div class="space-y-1">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
          :class="[
            route.path === item.to 
              ? 'bg-green-50 text-green-600' 
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          @click="$emit('click')"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.name }}
        </NuxtLink>
      </div>
  
      <!-- Profile Section -->
      <div class="pt-4 mt-4 border-t border-gray-200">
        <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Profile
        </h3>
        <div class="mt-2 space-y-1">
          <NuxtLink
            v-for="item in profileItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              route.path === item.to 
                ? 'bg-green-50 text-green-600' 
                : 'text-gray-700 hover:bg-gray-50'
            ]"
            @click="$emit('click')"
          >
            <component :is="item.icon" class="h-5 w-5 mr-3" />
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
  
      <!-- Logout Button -->
      <div class="pt-4 mt-4 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
        >
          <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { 
    HomeIcon, 
    ChatBubbleLeftRightIcon,
    UserIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon
  } from '@heroicons/vue/24/outline'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  
  const navigationItems = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
    { name: 'Messages', to: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  ]
  
  const profileItems = [
    { name: 'My Profile', to: '/profile', icon: UserIcon },
    { name: 'Settings', to: '/settings', icon: CogIcon },
  ]
  
  async function handleLogout() {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  </script>