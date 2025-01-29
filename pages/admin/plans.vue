<template>
    <div class="space-y-6">
      <PageHeader 
        title="Plan Management" 
        subtitle="Manage subscription plans"
      >
        <template #actions>
          <button 
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Create Plan
          </button>
        </template>
      </PageHeader>
  
      <!-- Plans Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="plan in plans" :key="plan.id"
          class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ plan.name }}
              </h3>
              <StatusBadge :status="plan.status" />
            </div>
            
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                {{ plan.description }}
              </p>
            </div>
  
            <div class="mt-4">
              <p class="text-3xl font-bold text-gray-900">${{ plan.price }}</p>
              <p class="text-sm text-gray-500">for {{ plan.durationDays }} days</p>
            </div>
  
            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-900">Features:</h4>
              <ul class="mt-2 space-y-2">
                <li v-for="feature in plan.features" :key="feature"
                  class="flex items-start"
                >
                  <CheckIcon class="h-5 w-5 text-green-500 mr-2" />
                  <span class="text-sm text-gray-500">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
  
          <div class="px-4 py-4 sm:px-6">
            <div class="flex justify-end space-x-3">
              <button
                @click="editPlan(plan)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-green-600 hover:text-green-700"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(plan)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Plan Modal -->
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
  
      <!-- Delete Confirmation Modal -->
      <Modal 
        v-if="showDeleteModal"
        title="Delete Plan"
        @close="showDeleteModal = false"
      >
        <div class="p-6">
          <p class="text-sm text-gray-500">
            Are you sure you want to delete this plan? This action cannot be undone
            and may affect users currently subscribed to this plan.
          </p>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="deletePlan"
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
  import { PlusIcon, CheckIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  const adminStore = useAdminStore()
  
  const plans = ref([])
  const showCreateModal = ref(false)
  const showDeleteModal = ref(false)
  // ... lanjutan script sebelumnya
const editingPlan = ref(null)
const planToDelete = ref(null)

onMounted(async () => {
  await loadPlans()
})

async function loadPlans() {
  try {
    const response = await adminStore.fetchPlans()
    plans.value = response
  } catch (error) {
    console.error('Error loading plans:', error)
  }
}

async function handlePlanSubmit(planData) {
  try {
    if (editingPlan.value) {
      await adminStore.updatePlan(editingPlan.value.id, planData)
    } else {
      await adminStore.createPlan(planData)
    }
    
    await loadPlans()
    closeModal()
  } catch (error) {
    console.error('Error saving plan:', error)
  }
}

function editPlan(plan) {
  editingPlan.value = plan
  showCreateModal.value = true
}

function confirmDelete(plan) {
  planToDelete.value = plan
  showDeleteModal.value = true
}

async function deletePlan() {
  try {
    await adminStore.deletePlan(planToDelete.value.id)
    await loadPlans()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error deleting plan:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  editingPlan.value = null
}
</script>