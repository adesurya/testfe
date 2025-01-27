<template>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <UserPlusIcon class="h-5 w-5 mr-2" />
          Create User
        </button>
      </div>
  
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <!-- Search and Filter -->
          <div class="flex items-center space-x-4 mb-6">
            <div class="flex-1">
              <input
                v-model="search"
                type="text"
                placeholder="Search users..."
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>
            <select
              v-model="filters.status"
              class="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
  
          <!-- Users Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="header in tableHeaders"
                    :key="header.key"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ header.label }}
                  </th>
                  <th class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ user.username }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <StatusBadge :status="user.status" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="editUser(user)"
                      class="text-green-600 hover:text-green-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <Pagination
            v-if="totalPages > 1"
            v-model:page="currentPage"
            :total-pages="totalPages"
            class="mt-6"
          />
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <Modal
        v-if="showCreateModal"
        :title="editingUser ? 'Edit User' : 'Create User'"
        @close="closeModal"
      >
        <UserForm
          :user="editingUser"
          @submit="handleUserSubmit"
          @cancel="closeModal"
        />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UserPlusIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const tableHeaders = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' }
  ]
  
  const { authApi } = useApi()
  const users = ref([])
  const search = ref('')
  const currentPage = ref(1)
  const totalPages = ref(1)
  const showCreateModal = ref(false)
  const editingUser = ref(null)
  const filters = ref({
    status: ''
  })
  
  onMounted(() => {
    loadUsers()
  })
  
  async function loadUsers() {
    try {
      const response = await authApi('/api/users', {
        params: {
          page: currentPage.value,
          search: search.value,
          status: filters.value.status
        }
      })
      users.value = response.data.users
      totalPages.value = response.data.totalPages
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }
  
  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      if (filters.value.status && user.status !== filters.value.status) {
        return false
      }
      if (search.value) {
        const searchLower = search.value.toLowerCase()
        return (
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  })
  
  function editUser(user) {
    editingUser.value = user
    showCreateModal.value = true
  }
  
  async function deleteUser(user) {
    if (!confirm(`Are you sure you want to delete ${user.username}?`)) return
  
    try {
      await authApi(`/api/users/${user.id}`, {
        method: 'DELETE'
      })
      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
  
  async function handleUserSubmit(userData) {
    try {
      if (editingUser.value) {
        await authApi(`/api/users/${editingUser.value.id}`, {
          method: 'PUT',
          body: userData
        })
      } else {
        await authApi('/api/users', {
          method: 'POST',
          body: userData
        })
      }
      await loadUsers()
      closeModal()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }
  
  function closeModal() {
    showCreateModal.value = false
    editingUser.value = null
  }
  
  watch([currentPage, search, filters], () => {
    loadUsers()
  })
  </script>