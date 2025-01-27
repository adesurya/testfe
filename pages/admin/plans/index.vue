<template>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Plan Management</h1>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Create Plan
        </button>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="bg-white rounded-lg shadow"
        >
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">{{ plan.name }}</h3>
            <p class="mt-2 text-sm text-gray-500">{{ plan.description }}</p>
            <div class="mt-4">
              <p class="text-3xl font-bold text-gray-900">${{ plan.price }}</p>
              <p class="text-sm text-gray-500">for {{ plan.durationDays }} days</p>
            </div>
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-900">Features:</p>
              <ul class="mt-2 space-y-2">
                <li class="flex items-center text-sm text-gray-500">
                  <CheckIcon class="h-5 w-5 text-green-500 mr-2" />
                  {{ plan.messageLimit }} messages
                </li>
                <!-- Add more features -->
              </ul>
            </div>
            <div class="mt-6 flex space-x-3">
              <button
                @click="editPlan(plan)"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                @click="deletePlan(plan)"
                class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <Modal
        v-if="showCreateModal"
        :title="editingPlan ? 'Edit Plan' : 'Create Plan'"
        @close="closeModal"
      >
        <PlanForm
          :plan="editingPlan"
          @submit="handlePlanSubmit"
          @cancel="closeModal"
        />
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { PlusIcon, CheckIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const { authApi } = useApi()
  const plans = ref([])
  const showCreateModal = ref(false)
  const editingPlan = ref(null)
  
  onMounted(() => {
    loadPlans()
  })
  
  async function loadPlans() {
    try {
      const response = await authApi('/api/plans')
      plans.value = response.data
    } catch (error) {
      console.error('Error loading plans:', error)
    }
  }
  
  function editPlan(plan) {
    editingPlan.value = plan
    showCreateModal.value = true
  }
  
  async function deletePlan(plan) {
    if (!confirm(`Are you sure you want to delete ${plan.name}?`)) return
  
    try {
      await authApi(`/api/plans/${plan.id}`, {
        method: 'DELETE'
      })
      await loadPlans()
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }
  
  async function handlePlanSubmit(planData) {
    try {
      if (editingPlan.value) {
        await authApi(`/api/plans/${editingPlan.value.id}`, {
          method: 'PUT',
          body: planData
        })
      } else {
        await authApi('/api/plans', {
          method: 'POST',
          body: planData
        })
      }
      await loadPlans()
      closeModal()
    } catch (error) {
      console.error('Error saving plan:', error)
    }
  }
  
  function closeModal() {
    showCreateModal.value = false
    editingPlan.value = null
  }
  </script>