<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
        <span class="sr-only">Open user menu</span>
        <div v-if="user?.avatar" class="h-8 w-8 rounded-full overflow-hidden">
          <img :src="user.avatar" :alt="user.username" class="h-full w-full object-cover">
        </div>
        <div v-else class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <span class="text-sm font-medium text-green-600">
            {{ userInitials }}
          </span>
        </div>
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
        <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
          <p class="font-medium">{{ user?.username }}</p>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>

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
          <NuxtLink
            to="/plans"
            :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
          >
            Subscription Plan
          </NuxtLink>
        </MenuItem>

        <div class="border-t border-gray-200">
          <MenuItem v-slot="{ active }">
            <button
              @click="handleLogout"
              :class="[active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700']"
            >
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.username) return ''
  return user.value.username
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>