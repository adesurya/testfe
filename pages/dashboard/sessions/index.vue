<!-- pages/dashboard/sessions/index.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { DevicePhoneMobileIcon, PlusIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

const authStore = useAuthStore()
const userStore = useUserStore()
const sessions = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  await loadSessions()
})

async function loadSessions() {
  try {
    loading.value = true
    const userId = authStore.user?.id
    if (!userId) throw new Error('User ID not found')

    const response = await userStore.fetchUserSessions(userId)
    console.log('Sessions response:', response) // Untuk debugging
    sessions.value = response
  } catch (err) {
    console.error('Error loading sessions:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader 
      title="WhatsApp Sessions" 
      subtitle="Manage your WhatsApp connections"
    >
      <template #actions>
        <NuxtLink
          to="/dashboard/sessions/bind"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          New Session
        </NuxtLink>
      </template>
    </PageHeader>

    <!-- Sessions List -->
    <div class="bg-white shadow rounded-lg">
      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <LoadingSpinner text="Loading sessions..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6">
        <div class="bg-red-50 p-4 rounded-md">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>

          <!-- Sessions List -->
          <div v-else>
        <div v-if="sessions && sessions.length > 0" class="divide-y divide-gray-200">
          <div v-for="session in sessions" :key="session.id" class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <DevicePhoneMobileIcon class="h-8 w-8 text-gray-400" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ session.phone_number }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    Last active: {{ formatDate(session.updated_at) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <StatusBadge :status="session.status" />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-6 text-center">
          <DevicePhoneMobileIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No active sessions</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by connecting a new WhatsApp session.
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/dashboard/sessions/bind"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Connect WhatsApp
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>