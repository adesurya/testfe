<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Username</label>
        <input
          v-model="form.username"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="form.password"
          type="password"
          :required="!editMode"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
        <p v-if="editMode" class="mt-1 text-sm text-gray-500">
          Leave blank to keep current password
        </p>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select
          v-model="form.status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
  
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          {{ editMode ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    user?: {
      id: number
      username: string
      email: string
      status: string
    }
  }>()
  
  const emit = defineEmits<{
    (e: 'submit', data: any): void
    (e: 'cancel'): void
  }>()
  
  const editMode = computed(() => !!props.user)
  
  const form = ref({
    username: props.user?.username || '',
    email: props.user?.email || '',
    password: '',
    status: props.user?.status || 'active'
  })
  
  function handleSubmit() {
    const formData = { ...form.value }
    if (editMode.value && !formData.password) {
      delete formData.password
    }
    emit('submit', formData)
  }
  </script>