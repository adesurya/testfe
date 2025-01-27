<template>
    <div class="space-y-6">
      <!-- User Plan Info -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Current Plan</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ planInfo.name || 'No active plan' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Messages Remaining</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ planInfo.messagesRemaining || 0 }}
            </p>
          </div>
        </div>
        
        <div class="mt-4" v-if="planInfo.expiryDate">
          <p class="text-sm text-gray-500">
            Expires: {{ formatDate(planInfo.expiryDate) }}
          </p>
        </div>
  
        <div class="mt-6" v-if="!planInfo.name">
          <button @click="router.push('/plans')"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            Choose a Plan
          </button>
        </div>
      </div>
  
      <!-- Message Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <dt class="text-sm font-medium text-gray-500">Total Messages</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ stats.totalMessages }}
          </dd>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <dt class="text-sm font-medium text-gray-500">Success Rate</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ stats.successRate }}%
          </dd>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <dt class="text-sm font-medium text-gray-500">Active Sessions</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ stats.activeSessions }}
          </dd>
        </div>
      </div>
  
      <!-- Recent Messages -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900">Recent Messages</h3>
          <div class="mt-4">
            <MessageHistory :limit="5" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '~/stores/user'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  const planInfo = ref({
    name: '',
    messagesRemaining: 0,
    expiryDate: null
  })
  
  const stats = ref({
    totalMessages: 0,
    successRate: 0,
    activeSessions: 0
  })
  
  onMounted(async () => {
    await loadUserStats()
    await loadPlanInfo()
  })
  
  async function loadUserStats() {
    try {
      const userStats = await userStore.fetchStats()
      stats.value = userStats
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }
  
  async function loadPlanInfo() {
    try {
      const plan = await userStore.fetchCurrentPlan()
      planInfo.value = plan
    } catch (error) {
      console.error('Error loading plan info:', error)
    }
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }
  </script>