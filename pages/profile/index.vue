<!-- pages/profile/index.vue -->
<template>
  <div class="space-y-8">
    <PageHeader 
      title="My Profile" 
      subtitle="View and manage your profile information"
    />

    <!-- Profile Overview Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="relative h-32 bg-gradient-to-r from-green-400 to-green-600">
        <!-- Profile Photo Overlay -->
        <div class="absolute -bottom-16 left-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-white p-2">
              <div v-if="userProfile?.avatar" class="w-full h-full rounded-full overflow-hidden">
                <img :src="userProfile.avatar" alt="Profile" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-3xl font-semibold text-green-600">
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <button 
              class="absolute bottom-0 right-0 p-1.5 rounded-full bg-white shadow-lg hover:bg-gray-50"
              @click="triggerFileInput"
            >
              <CameraIcon class="w-5 h-5 text-gray-500" />
            </button>
            <input 
              type="file"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="handleImageUpload"
            >
          </div>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="pt-20 pb-6 px-8">
        <h3 class="text-2xl font-bold text-gray-900">{{ userProfile?.username }}</h3>
        <p class="mt-1 text-gray-500">{{ userProfile?.email }}</p>
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Account Status</p>
            <p class="mt-1 font-medium text-gray-900">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Member Since</p>
            <p class="mt-1 font-medium text-gray-900">{{ formatMemberSince(userProfile?.created_at) }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-500">Last Login</p>
            <p class="mt-1 font-medium text-gray-900">{{ formatDate(userProfile?.lastLogin) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Profile Form -->
    <div class="bg-white rounded-lg shadow divide-y">
      <!-- Personal Information -->
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
        <p class="mt-1 text-sm text-gray-500">Update your personal information and contact details.</p>
        
        <form @submit.prevent="updateProfile" class="mt-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Username</label>
              <input
                v-model="form.username"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                :class="{ 'border-red-300': errors.username }"
              >
              <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                :class="{ 'border-red-300': errors.email }"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  +62
                </span>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  :class="{ 'border-red-300': errors.phone }"
                >
              </div>
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="updating"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <span v-if="updating">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Updating...
              </span>
              <span v-else>
                <CheckIcon class="w-4 h-4 mr-1.5" />
                Save Changes
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password Section -->
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900">Change Password</h3>
        <p class="mt-1 text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>

        <form @submit.prevent="updatePassword" class="mt-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="updatingPassword"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span v-if="updatingPassword">Updating Password...</span>
              <span v-else>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Success Notification -->
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showSuccess" class="fixed bottom-4 right-4 bg-green-50 p-4 rounded-lg shadow-lg">
      <div class="flex">
        <CheckCircleIcon class="h-6 w-6 text-green-400" />
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CameraIcon, CheckIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'dashboard'
})

const userStore = useUserStore()
const authStore = useAuthStore()

const fileInput = ref(null)
const updating = ref(false)
const updatingPassword = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const errors = ref({})

const userProfile = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!userProfile.value?.username) return ''
  return userProfile.value.username.substring(0, 2).toUpperCase()
})

const form = ref({
  username: userProfile.value?.username || '',
  email: userProfile.value?.email || '',
  phone: userProfile.value?.phone || '',
  createdat : userProfile.value?.created_at || ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: ''
})

function triggerFileInput() {
  fileInput.value.click()
}

async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    // Handle image upload logic
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

async function updateProfile() {
  try {
    errors.value = {}
    updating.value = true
    await userStore.updateProfile(form.value)
    showSuccessMessage('Profile updated successfully')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    console.error('Error updating profile:', error)
  } finally {
    updating.value = false
  }
}

async function updatePassword() {
  try {
    updatingPassword.value = true
    await userStore.updatePassword(passwordForm.value)
    passwordForm.value = { currentPassword: '', newPassword: '' }
    showSuccessMessage('Password updated successfully')
  } catch (error) {
    console.error('Error updating password:', error)
  } finally {
    updatingPassword.value = false
  }
}

function showSuccessMessage(message) {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatMemberSince(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>