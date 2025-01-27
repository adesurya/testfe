<template>
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Active Sessions</h3>
          <button
            @click="showBindModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Bind New Session
          </button>
        </div>
  
        <div class="mt-6">
          <div class="divide-y divide-gray-200">
            <div
              v-for="session in sessions"
              :key="session.id"
              class="py-4 flex justify-between items-center"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ session.phone_number }}
                </p>
                <p class="text-sm text-gray-500">
                  Connected since: {{ formatDate(session.created_at) }}
                </p>
              </div>
              <button
                @click="unbindSession(session.id)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Unbind
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <Modal v-if="showBindModal" @close="showBindModal = false">
        <BindSession @success="handleBindSuccess" />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  const { authApi } = useApi()
  const sessions = ref([])
  const showBindModal = ref(false)
  
  onMounted(() => {
    loadSessions()
  })
  
  async function loadSessions() {
    try {
      const userId = useAuthStore().user?.id
      sessions.value = await authApi(`/api/whatsapp/sessions/${userId}`)
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }
  
  async function unbindSession(sessionId) {
    if (!confirm('Are you sure you want to unbind this session?')) return
    
    try {
      await authApi(`/api/whatsapp/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      await loadSessions()
    } catch (error) {
      console.error('Error unbinding session:', error)
    }
  }
  
  function handleBindSuccess() {
    showBindModal.value = false
    loadSessions()
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleString()
  }
  </script>