<template>
    <div class="space-y-6">
      <PageHeader 
        title="System Settings" 
        subtitle="Configure system-wide settings and preferences"
      />
  
      <div class="grid grid-cols-1 gap-6">
        <!-- General Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">General Settings</h3>
            
            <form @submit.prevent="saveGeneralSettings" class="mt-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  System Name
                </label>
                <input
                  v-model="generalSettings.systemName"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  v-model="generalSettings.contactEmail"
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Support Phone
                </label>
                <input
                  v-model="generalSettings.supportPhone"
                  type="tel"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    v-model="generalSettings.maintenanceMode"
                    type="checkbox"
                    class="h-4 w-4 text-green-600 rounded border-gray-300"
                  >
                  <label class="ml-2 block text-sm text-gray-900">
                    Maintenance Mode
                  </label>
                </div>
                <button
                  type="submit"
                  :disabled="savingGeneral"
                  class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {{ savingGeneral ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Message Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">Message Settings</h3>
            
            <form @submit.prevent="saveMessageSettings" class="mt-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Default Delay (seconds)
                </label>
                <input
                  v-model.number="messageSettings.defaultDelay"
                  type="number"
                  min="0"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Max Bulk Messages
                </label>
                <input
                  v-model.number="messageSettings.maxBulkMessages"
                  type="number"
                  min="1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Max Media Size (MB)
                </label>
                <input
                  v-model.number="messageSettings.maxMediaSize"
                  type="number"
                  min="1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="savingMessage"
                  class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {{ savingMessage ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Security Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">Security Settings</h3>
            
            <form @submit.prevent="saveSecuritySettings" class="mt-6 space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <input
                  v-model.number="securitySettings.sessionTimeout"
                  type="number"
                  min="5"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Max Login Attempts
                </label>
                <input
                  v-model.number="securitySettings.maxLoginAttempts"
                  type="number"
                  min="1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Password Requirements
                </label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center">
                    <input
                      v-model="securitySettings.passwordRequirements.minLength"
                      type="number"
                      min="6"
                      class="block w-20 rounded-md border-gray-300 shadow-sm"
                    >
                    <span class="ml-2 text-sm text-gray-500">Minimum Length</span>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="securitySettings.passwordRequirements.requireNumbers"
                      type="checkbox"
                      class="h-4 w-4 text-green-600 rounded border-gray-300"
                    >
                    <span class="ml-2 text-sm text-gray-500">Require Numbers</span>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="securitySettings.passwordRequirements.requireSymbols"
                      type="checkbox"
                      class="h-4 w-4 text-green-600 rounded border-gray-300"
                    >
                    <span class="ml-2 text-sm text-gray-500">Require Symbols</span>
                  </div>
                </div>
              </div>
  
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="savingSecurity"
                  class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {{ savingSecurity ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Notification Settings -->
        <div class="bg-white shadow rounded-lg">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">Notification Settings</h3>
            
            <form @submit.prevent="saveNotificationSettings" class="mt-6 space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Email Notifications</h4>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center">
                    <input
                      v-model="notificationSettings.email.newUser"
                      type="checkbox"
                      class="h-4 w-4 text-green-600 rounded border-gray-300"
                    >
                    <span class="ml-2 text-sm text-gray-500">New User Registration</span>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="notificationSettings.email.failedPayment"
                      type="checkbox"
                      class="h-4 w-4 text-green-600 rounded border-gray-300"
                    >
                    <span class="ml-2 text-sm text-gray-500">Failed Payments</span>
                  </div>
                  <div class="flex items-center">
                    <input
                      v-model="notificationSettings.email.systemErrors"
                      type="checkbox"
                      class="h-4 w-4 text-green-600 rounded border-gray-300"
                    >
                    <span class="ml-2 text-sm text-gray-500">System Errors</span>
                  </div>
                </div>
              </div>
  
              <div>
                <h4 class="text-sm font-medium text-gray-900">SMTP Settings</h4>
                <div class="mt-2 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      SMTP Host
                    </label>
                    <input
                      v-model="notificationSettings.smtp.host"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      SMTP Port
                    </label>
                    <input
                      v-model="notificationSettings.smtp.port"
                      type="number"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      SMTP Username
                    </label>
                    <input
                      v-model="notificationSettings.smtp.username"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      SMTP Password
                    </label>
                    <input
                      v-model="notificationSettings.smtp.password"
                      type="password"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                  </div>
                </div>
              </div>
  
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="savingNotification"
                  class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {{ savingNotification ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const adminStore = useAdminStore()
  
  // General Settings
  const generalSettings = ref({
    systemName: '',
    contactEmail: '',
    supportPhone: '',
    maintenanceMode: false
  })
  
  const messageSettings = ref({
    defaultDelay: 30,
    maxBulkMessages: 1000,
    maxMediaSize: 10
  })
  
  const securitySettings = ref({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordRequirements: {
      minLength: 8,
      requireNumbers: true,
      requireSymbols: true
    }
  })
  
  const notificationSettings = ref({
    email: {
      newUser: true,
      failedPayment: true,
      systemErrors: true
    },
    smtp: {
      host: '',
      port: 587,
      username: '',
      password: ''
    }
  })
  
  const savingGeneral = ref(false)
  const savingMessage = ref(false)
  const savingSecurity = ref(false)
  const savingNotification = ref(false)
  
  onMounted(async () => {
    await loadSettings()
  })
  
  async function loadSettings() {
    try {
      const settings = await adminStore.fetchSettings()
      generalSettings.value = settings.general
      messageSettings.value = settings.message
      securitySettings.value = settings.security
      notificationSettings.value = settings.notification
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
  
  async function saveGeneralSettings() {
    try {
      savingGeneral.value = true
      await adminStore.updateSettings('general', generalSettings.value)
      // Show success message
    } catch (error) {
      console.error('Error saving general settings:', error)
      // Show error message
    } finally {
      savingGeneral.value = false
    }
  }
  
  async function saveMessageSettings() {
    try {
      savingMessage.value = true
      await adminStore.updateSettings('message', messageSettings.value)
      // Show success message
    } catch (error) {
      console.error('Error saving message settings:', error)
      // Show error message
    } finally {
      savingMessage.value = false
    }
  }
  
  async function saveSecuritySettings() {
    try {
      savingSecurity.value = true
      await adminStore.updateSettings('security', securitySettings.value)
      // Show success message
    } catch (error) {
      console.error('Error saving security settings:', error)
      // Show error message
    } finally {
      savingSecurity.value = false
    }
  }
  
  async function saveNotificationSettings() {
    try {
      savingNotification.value = true
      await adminStore.updateSettings('notification', notificationSettings.value)
      // Show success message
    } catch (error) {
      console.error('Error saving notification settings:', error)
      // Show error message
    } finally {
      savingNotification.value = false
    }
  }
  </script>