<template>
    <div class="space-y-6">
      <PageHeader 
        title="User Management" 
        subtitle="Manage system users"
      >
        <template #actions>
          <button 
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <UserPlusIcon class="h-5 w-5 mr-2" />
            Add User
          </button>
        </template>
      </PageHeader>
  
      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <input 
              v-model="filters.search"
              type="text"
              placeholder="Search users..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select 
              v-model="filters.role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select 
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Sort By</label>
            <select 
              v-model="filters.sortBy"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="created_at">Created Date</option>
              <option value="username">Username</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- Users Table -->
      <div class="bg-white shadow rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img 
                        v-if="user.avatar"
                        :src="user.avatar" 
                        :alt="user.username"
                        class="h-10 w-10 rounded-full"
                      >
                      <UserCircleIcon 
                        v-else
                        class="h-10 w-10 text-gray-400" 
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.username }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="user.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.plan?.name || 'No Plan' }}</div>
                  <div class="text-sm text-gray-500">
                    {{ user.plan?.messagesRemaining || 0 }} messages left
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editUser(user)"
                    class="text-green-600 hover:text-green-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="px-6 py-4 border-t border-gray-200">
          <Pagination
            v-model:page="currentPage"
            :total-pages="totalPages"
            :total-items="totalUsers"
          />
        </div>
      </div>
  
      <!-- Create/Edit User Modal -->
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
  
      <!-- Delete Confirmation Modal -->
      <Modal 
        v-if="showDeleteModal"
        title="Delete User"
        @close="showDeleteModal = false"
      >
        <div class="p-6">
          <p class="text-sm text-gray-500">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="deleteUser"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UserPlusIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const adminStore = useAdminStore()
  
  const filters = ref({
    search: '',
    role: '',
    status: '',
    sortBy: 'created_at'
  })
  
  const users = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalUsers = ref(0)
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  const editingUser = ref(null)
  const userToDelete = ref(null)
  
  onMounted(() => {
    loadUsers()
  })
  
  watch([filters, currentPage], () => {
    loadUsers()
  })
  
  async function loadUsers() {
    try {
      const response = await adminStore.fetchUsers({
        ...filters.value,
        page: currentPage.value
      })
      
      users.value = response.users
      totalPages.value = response.totalPages
      totalUsers.value = response.total
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }
  
  async function handleUserSubmit(userData) {
    try {
      if (editingUser.value) {
        await adminStore.updateUser(editingUser.value.id, userData)
      } else {
        await adminStore.createUser(userData)
      }
      
      await loadUsers()
      closeModal()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }
  
  function editUser(user) {
    editingUser.value = user
    showCreateModal.value = true
  }
  
  function confirmDelete(user) {
    userToDelete.value = user
    showDeleteModal.value = true
  }
  
  async function deleteUser() {
    try {
      await adminStore.deleteUser(userToDelete.value.id)
      await loadUsers()
      showDeleteModal.value = false
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
  
  function closeModal() {
    showCreateModal.value = false
    editingUser.value = null
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString()
  }
  </script>