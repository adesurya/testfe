<template>
    <Menu as="div" class="relative ml-3">
      <div>
        <MenuButton class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          <span class="sr-only">Open user menu</span>
          <UserCircleIcon class="h-8 w-8 text-gray-400" />
        </MenuButton>
      </div>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <MenuItem v-slot="{ active }">
            <div class="px-4 py-2 text-sm text-gray-700">
              {{ authStore.user?.username }}
            </div>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <NuxtLink
              to="/profile"
              :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
            >
              Your Profile
            </NuxtLink>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <NuxtLink
              to="/settings"
              :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
            >
              Settings
            </NuxtLink>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            
              @click="logout"
              :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer']"
            >
              Sign out
            </a>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </template>
  
  <script setup lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { UserCircleIcon } from '@heroicons/vue/24/outline'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  async function logout() {
    await authStore.logout()
    router.push('/login')
  }
  </script>