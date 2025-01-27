<template>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">WhatsApp Sessions</h1>
        <button
          @click="showBindModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          New Session
        </button>
      </div>
  
      <div class="bg-white shadow rounded-lg">
        <SessionList :sessions="sessions" @refresh="loadSessions" />
      </div>
  
      <Modal
        v-if="showBindModal"
        title="Bind New WhatsApp Session"
        @close="showBindModal = false"
      >
        <BindSession @success="handleBindSuccess" />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { PlusIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth']
  })
  
  const { authApi } = useApi()
  const authStore = useAuthStore()
  const sessions = ref([])
  const showBindModal = ref(false)
  
  onMounted(() => {
    loadSessions()
  })
  
  async function loadSessions() {
    try {
      const response = await authApi(`/api/whatsapp/sessions/${authStore.user.id}`)
      sessions.value = response.data
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }
  
  function handleBindSuccess() {
    showBindModal.value = false
    loadSessions()
  }
  </script>