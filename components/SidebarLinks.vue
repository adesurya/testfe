<template>
  <div class="space-y-4">
    <!-- Main Navigation -->
    <div class="space-y-1">
      <template v-for="item in navigationItems" :key="item.name">
        <!-- Regular Menu Item -->
        <NuxtLink
          v-if="!item.children"
          :to="item.to"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
          :class="[
            isActive(item.to)
              ? 'bg-green-50 text-green-600'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          @click="$emit('click')"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.name }}
        </NuxtLink>

                  <!-- Menu Item with Submenu -->
        <div v-else>
          <!-- Parent Menu Button -->
          <button
            @click="toggleSubmenu(item.name)"
            class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              hasActiveChild(item)
                ? 'bg-green-50 text-green-600'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center min-w-0 flex-1">
              <component :is="item.icon" class="h-5 w-5 mr-3 flex-shrink-0" />
              <span class="truncate">{{ item.name }}</span>
            </div>
            <ChevronDownIcon 
              class="h-5 w-5 transform transition-transform duration-200 ml-2 flex-shrink-0"
              :class="{ 'rotate-180': openSubmenus.includes(item.name) }"
            />
          </button>

          <!-- Submenu Items -->
          <div
            v-show="openSubmenus.includes(item.name)"
            class="mt-1 space-y-1 ml-8"
          >
            <NuxtLink
              v-for="subItem in item.children"
              :key="subItem.name"
              :to="subItem.to"
              class="block px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                isActive(subItem.to)
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
              @click="handleSubmenuClick(subItem)"
            >
              {{ subItem.name }}
            </NuxtLink>
          </div>
        </div>
      </template>
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
            isActive(item.to)
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
import { ref } from 'vue'
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon,
  UserIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  DocumentChartBarIcon,
  ChevronDownIcon,
  ChartBarIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const openSubmenus = ref([])

const navigationItems = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { 
    name: 'Messages', 
    to: '/dashboard/messages', 
    icon: ChatBubbleLeftRightIcon,
    children: [
      { name: 'Single Message', to: '/dashboard/messages/single' },
      { name: 'Bulk Message', to: '/dashboard/messages/bulk' }
    ]
  },
  { name: 'Reports', to: '/dashboard/report', icon: DocumentChartBarIcon },
  { name: 'User Statistics', to: '/dashboard/stats', icon: ChartBarIcon },
  { name: 'WA Session', to: '/dashboard/sessions/bind', icon: ChatBubbleLeftEllipsisIcon }
]

const profileItems = [
  { name: 'My Profile', to: '/profile', icon: UserIcon },
  { name: 'Settings', to: '/settings', icon: CogIcon },
]

function isActive(path) {
  if (path === '/dashboard' && route.path === '/dashboard') {
    return true
  }
  return route.path.startsWith(path) && path !== '/dashboard'
}

function hasActiveChild(item) {
  if (!item.children) return false
  return item.children.some(child => isActive(child.to))
}

function toggleSubmenu(name) {
  const index = openSubmenus.value.indexOf(name)
  if (index === -1) {
    openSubmenus.value.push(name)
  } else {
    openSubmenus.value.splice(index, 1)
  }
}

function handleSubmenuClick(item) {
  router.push(item.to)
  // Emit click event to close mobile sidebar
  emit('click')
}

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const emit = defineEmits(['click'])
</script>