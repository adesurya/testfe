<template>
    <div class="max-w-3xl mx-auto py-6">
      <div class="space-y-6">
        <!-- Security Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
            
            <form @submit.prevent="updatePassword" class="mt-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
  
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="updating"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {{ updating ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Notification Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Notification Settings</h3>
            
            <div class="mt-6 space-y-6">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    v-model="notifications.email"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  >
                </div>
                <div class="ml-3">
                  <label class="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p class="text-sm text-gray-500">
                    Receive email notifications for important updates and messages
                  </p>
                </div>
              </div>
  
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    v-model="notifications.whatsapp"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  >
                </div>
                <div class="ml-3">
                  <label class="text-sm font-medium text-gray-700">
                    WhatsApp Notifications
                  </label>
                  <p class="text-sm text-gray-500">
                    Receive WhatsApp notifications for message delivery status
                  </p>
                </div>
              </div>
            </div>
  
            <div class="mt-6 flex justify-end">
              <button
                @click="updateNotifications"
                :disabled="updatingNotifications"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {{ updatingNotifications ? 'Saving...' : 'Save Preferences' }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Session Management -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">Active Sessions</h3>
            
            <div class="mt-6">
              <div v-for="session in sessions" :key="session.id" class="flex justify-between py-4 border-t border-gray-200">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ session.device }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Last active: {{ formatDate(session.lastActive) }}
                  </p>
                </div>
                <button
                  @click="revokeSession(session.id)"
                  class="text-sm text-red-600 hover:text-red-500"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: ['auth']
  })
  
  const { authApi } = useApi()
  const userStore = useUserStore()
  
  const updating = ref(false)
  const updatingNotifications = ref(false)
  
  const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const notifications = ref({
    email: true,
    whatsapp: true
  })
  
  const sessions = ref([])
  
  onMounted(async () => {
    await loadSessions()
    await loadNotificationPreferences()
  })
  
  async function updatePassword() {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      showErrorMessage('New passwords do not match')
      return
    }
  
    try {
      updating.value = true
      await userStore.updatePassword({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })
      showSuccessMessage('Password updated successfully')
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    } catch (error) {
      console.error('Error updating password:', error)
      showErrorMessage('Failed to update password')
    } finally {
      updating.value = false
    }
  }
  
  async function updateNotifications() {
    try {
      updatingNotifications.value = true
      await authApi('/api/user/notifications', {
        method: 'PUT',
        body: notifications.value
      })
      showSuccessMessage('Notification preferences updated')
    } catch (error) {
      console.error('Error updating notifications:', error)
      showErrorMessage('Failed to update notification preferences')
    } finally {
      updatingNotifications.value = false
    }
  }
  
  async function loadSessions() {
    try {
      const response = await authApi('/api/user/sessions')
      sessions.value = response.data
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }
  
  async function loadNotificationPreferences() {
    try {
      const response = await authApi('/api/user/notifications')
      notifications.value = response.data
    } catch (error) {
      console.error('Error loading notification preferences:', error)
    }
  }
  
  async function revokeSession(sessionId: string) {
    try {
      await authApi(`/api/user/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      await loadSessions()
      showSuccessMessage('Session revoked successfully')
    } catch (error) {
      console.error('Error revoking session:', error)
      showErrorMessage('Failed to revoke session')
    }
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString()
  }
  
  function showSuccessMessage(message: string) {
    // Implement toast notification
  }
  
  function showErrorMessage(message: string) {
    // Implement toast notification
  }
  </script>