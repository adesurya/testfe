<template>
    <div class="bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose your plan
          </h2>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Select a plan that best fits your needs
          </p>
        </div>
        <div class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          <PlanCard
            v-for="plan in plans"
            :key="plan.id"
            :plan="plan"
            @select="handlePlanSelect"
          />
        </div>
      </div>
      <PaymentModal
        v-if="showPaymentModal"
        :plan="selectedPlan"
        @close="showPaymentModal = false"
        @success="handlePaymentSuccess"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  const { authApi } = useApi()
  const router = useRouter()
  
  const plans = ref([])
  const selectedPlan = ref(null)
  const showPaymentModal = ref(false)
  
  onMounted(async () => {
    try {
      const data = await authApi('/api/plans')
      plans.value = data
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  })
  
  function handlePlanSelect(planId: number) {
    selectedPlan.value = plans.value.find(p => p.id === planId)
    showPaymentModal.value = true
  }
  
  function handlePaymentSuccess() {
    showPaymentModal.value = false
    router.push('/dashboard')
  }
  </script>