<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Username</label>
        <input 
          v-model="form.username" 
          type="text" 
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input 
          v-model="form.password" 
          type="password" 
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
      </div>
      <button 
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Login
      </button>
    </form>
  </template>
  
  <script setup lang="ts">
  const authStore = useAuthStore()
  const router = useRouter()
  
  const form = ref({
    username: '',
    password: ''
  })
  
  async function handleSubmit() {
    const success = await authStore.login(form.username, form.password)
    if (success) {
      router.push('/dashboard')
    }
  }
  </script>