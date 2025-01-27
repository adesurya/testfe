<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/dashboard" class="text-xl font-bold text-green-600">
                WhatsApp Dashboard
              </NuxtLink>
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigationItems"
                :key="item.name"
                :to="item.href"
                :class="[
                  route.path === item.href
                    ? 'border-green-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>

    <div class="py-10">
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

const navigationItems = computed(() => {
  const items = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Messages', href: '/dashboard/messages' },
    { name: 'WhatsApp Sessions', href: '/dashboard/sessions' }
  ]

  if (authStore.isAdmin) {
    items.push(
      { name: 'Users', href: '/admin/users' },
      { name: 'Plans', href: '/admin/plans' },
      { name: 'Reports', href: '/admin/reports' }
    )
  }

  return items
})
</script>