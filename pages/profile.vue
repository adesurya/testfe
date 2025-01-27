<template>
    <div class="max-w-3xl mx-auto py-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Profile Settings</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Profile Image -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UserCircleIcon v-if="!userProfile.avatar" class="h-16 w-16 text-gray-400" />
                <img
                  v-else
                  :src="userProfile.avatar"
                  alt="Profile"
                  class="h-16 w-16 rounded-full"
                >
              </div>
              <div class="ml-4">
                <div class="flex items-center space-x-4">
                  <button
                    type="button"
                    class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Change Photo
                  </button>
                  <button
                    v-if="userProfile.avatar"
                    type="button"
                    class="text-sm text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Basic Information -->
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  v-model="userProfile.username"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  v-model="userProfile.email"
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  v-model="userProfile.phone"
                  type="tel"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
            </div>
  
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="updating"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {{ updating ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UserCircleIcon } from '@heroicons/vue/24/solid'
  
  definePageMeta({
    middleware: ['auth']
  })
  
  const { authApi } = useApi()
  const userStore = useUserStore()
  
  const userProfile = ref({
    username: '',
    email: '',
    phone: '',
    avatar: null
  })
  
  const updating = ref(false)
  
  onMounted(async () => {
    try {
      const response = await authApi('/api/user/profile')
      userProfile.value = response.data
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  })
  
  async function updateProfile() {
    try {
      updating.value = true
      await userStore.updateProfile(userProfile.value)
      showSuccessMessage('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      showErrorMessage('Failed to update profile')
    } finally {
      updating.value = false
    }
  }
  
  function showSuccessMessage(message: string) {
    // Implement toast notification
  }
  
  function showErrorMessage(message: string) {
    // Implement toast notification
  }
  </script>