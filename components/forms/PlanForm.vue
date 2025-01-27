<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Plan Name</label>
        <input
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Message Limit</label>
        <input
          v-model.number="form.messageLimit"
          type="number"
          required
          min="1"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Price (USD)</label>
        <input
          v-model.number="form.price"
          type="number"
          required
          min="0"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Duration (Days)</label>
        <input
          v-model.number="form.durationDays"
          type="number"
          required
          min="1"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        >
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
        ></textarea>
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
          {{ editMode ? 'Update' : 'Create' }} Plan
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    plan?: {
      id: number
      name: string
      messageLimit: number
      price: number
      durationDays: number
      description: string
      status: string
    }
  }>()
  
  const emit = defineEmits<{
    (e: 'submit', data: any): void
    (e: 'cancel'): void
  }>()
  
  const editMode = computed(() => !!props.plan)
  
  const form = ref({
    name: props.plan?.name || '',
    messageLimit: props.plan?.messageLimit || 1000,
    price: props.plan?.price || 0,
    durationDays: props.plan?.durationDays || 30,
    description: props.plan?.description || '',
    status: props.plan?.status || 'active'
  })
  
  function handleSubmit() {
    emit('submit', form.value)
  }
  </script>