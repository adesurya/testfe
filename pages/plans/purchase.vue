<template>
    <div class="space-y-6">
      <PageHeader 
        title="Complete Purchase" 
        subtitle="Review and complete your plan purchase"
      />
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Plan Details -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900">Plan Details</h3>
            
            <div class="mt-6">
              <div class="flex justify-between items-center pb-4 border-b">
                <div>
                  <h4 class="text-xl font-bold text-gray-900">{{ selectedPlan.name }}</h4>
                  <p class="mt-1 text-sm text-gray-500">{{ selectedPlan.description }}</p>
                </div>
                <p class="text-2xl font-bold text-gray-900">${{ selectedPlan.price }}</p>
              </div>
  
              <dl class="mt-4 space-y-4">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Duration</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ selectedPlan.durationDays }} days</dd>
                </div>
                
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Message Limit</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ selectedPlan.messageLimit }} messages</dd>
                </div>
  
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-500">Features</dt>
                  <dd class="text-sm font-medium text-gray-900">
                    <ul class="space-y-1 text-right">
                      <li v-for="feature in selectedPlan.features" :key="feature">
                        {{ feature }}
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
  
          <!-- Payment Methods -->
          <div class="mt-6 bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900">Payment Method</h3>
            
            <div class="mt-6 space-y-4">
              <div v-for="method in paymentMethods" :key="method.id"
                class="relative flex items-center p-4 border rounded-lg cursor-pointer"
                :class="selectedPaymentMethod?.id === method.id ? 'border-green-500 bg-green-50' : 'border-gray-300'"
                @click="selectPaymentMethod(method)"
              >
                <div class="flex items-center h-5">
                  <input
                    type="radio"
                    :checked="selectedPaymentMethod?.id === method.id"
                    class="h-4 w-4 text-green-600 border-gray-300"
                  >
                </div>
                <div class="ml-3 flex items-center justify-between flex-1">
                  <div>
                    <label class="text-sm font-medium text-gray-900">
                      {{ method.name }}
                    </label>
                    <p class="text-sm text-gray-500">
                      {{ method.description }}
                    </p>
                  </div>
                  <img :src="method.icon" :alt="method.name" class="h-8 w-8">
                </div>
              </div>
            </div>
  
            <!-- Payment Form -->
            <div v-if="selectedPaymentMethod" class="mt-6">
              <template v-if="selectedPaymentMethod.type === 'card'">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      v-model="paymentForm.cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        v-model="paymentForm.expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        v-model="paymentForm.cvv"
                        type="text"
                        placeholder="123"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      >
                    </div>
                  </div>
                </div>
              </template>
  
              <template v-else-if="selectedPaymentMethod.type === 'bank_transfer'">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900">Bank Transfer Instructions</h4>
                  <ul class="mt-2 text-sm text-gray-600 space-y-2">
                    <li>Bank Name: {{ selectedPaymentMethod.bankDetails.name }}</li>
                    <li>Account Number: {{ selectedPaymentMethod.bankDetails.accountNumber }}</li>
                    <li>Account Name: {{ selectedPaymentMethod.bankDetails.accountName }}</li>
                  </ul>
                </div>
              </template>
            </div>
          </div>
        </div>
  
        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6 sticky top-6">
            <h3 class="text-lg font-medium text-gray-900">Order Summary</h3>
            
            <dl class="mt-6 space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Plan Price</dt>
                <dd class="text-sm font-medium text-gray-900">${{ selectedPlan.price }}</dd>
              </div>
  
              <div v-if="discount" class="flex justify-between text-green-600">
                <dt class="text-sm">Discount</dt>
                <dd class="text-sm font-medium">-${{ discount }}</dd>
              </div>
  
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Tax</dt>
                <dd class="text-sm font-medium text-gray-900">${{ tax }}</dd>
              </div>
  
              <div class="pt-4 border-t border-gray-200">
                <div class="flex justify-between">
                  <dt class="text-base font-medium text-gray-900">Total</dt>
                  <dd class="text-base font-medium text-gray-900">${{ total }}</dd>
                </div>
              </div>
            </dl>
  
            <div class="mt-6">
              <button
                @click="processPayment"
                :disabled="!canProceed || processing"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {{ processing ? 'Processing...' : 'Complete Purchase' }}
              </button>
            </div>
  
            <p class="mt-4 text-sm text-gray-500 text-center">
              By completing this purchase you agree to our
              <a href="#" class="text-green-600 hover:text-green-500">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
  
      <!-- Success Modal -->
      <Modal v-if="showSuccessModal" @close="handleSuccess">
        <div class="p-6 text-center">
          <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">Payment Successful</h3>
          <p class="mt-2 text-sm text-gray-500">
            Your plan has been activated successfully. You can now start sending messages.
          </p>
          <div class="mt-6">
            <button
              @click="handleSuccess"
              class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircleIcon } from '@heroicons/vue/24/outline'
  
  definePageMeta({
    middleware: ['auth']
  })
  
  const route = useRoute()
  const router = useRouter()
  const paymentStore = usePaymentStore()
  
  const selectedPlan = ref(null)
  const paymentMethods = ref([])
  const selectedPaymentMethod = ref(null)
  const processing = ref(false)
  const showSuccessModal = ref(false)
  
  const paymentForm = ref({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  
  // Computed values for order summary
  const discount = computed(() => 0) // Implement discount logic if needed
  const tax = computed(() => selectedPlan.value ? selectedPlan.value.price * 0.1 : 0)
  const total = computed(() => {
    if (!selectedPlan.value) return 0
    return selectedPlan.value.price + tax.value - discount.value
  })
  
  const canProceed = computed(() => {
    if (!selectedPaymentMethod.value || !selectedPlan.value) return false
    
    if (selectedPaymentMethod.value.type === 'card') {
      return paymentForm.value.cardNumber && 
             paymentForm.value.expiryDate && 
             paymentForm.value.cvv
    }
    
    return true
  })
  
  onMounted(async () => {
    // Load plan details from route params
    const planId = route.query.planId
    if (!planId) {
      router.push('/plans')
      return
    }
  
    try {
      const [planResponse, methodsResponse] = await Promise.all([
        loadPlanDetails(planId),
        loadPaymentMethods(planId)
      ])
      
      selectedPlan.value = planResponse
      paymentMethods.value = methodsResponse
    } catch (error) {
      console.error('Error loading purchase data:', error)
      router.push('/plans')
    }
  })
  
  async function loadPlanDetails(planId) {
    const { authApi } = useApi()
    const response = await authApi(`/api/plans/${planId}`)
    return response.data
  }
  
  async function loadPaymentMethods(planId) {
    const { authApi } = useApi()
    const response = await authApi(`/api/payments/methods/${planId}`)
    return response.data
  }
  
  function selectPaymentMethod(method) {
    selectedPaymentMethod.value = method
  }
  
  async function processPayment() {
    if (!canProceed.value || processing.value) return
  
    try {
      processing.value = true
      
      const paymentData = {
        planId: selectedPlan.value.id,
        paymentMethod: selectedPaymentMethod.value.id,
        amount: total.value,
        paymentDetails: selectedPaymentMethod.value.type === 'card' ? paymentForm.value : null
      }
  
      const response = await paymentStore.createPayment(paymentData)
  
      if (response.redirectUrl) {
        // Redirect to external payment page if needed
        window.location.href = response.redirectUrl
      } else {
        showSuccessModal.value = true
      }
    } catch (error) {
      console.error('Payment processing error:', error)
    } finally {
      processing.value = false
    }
  }
  
  function handleSuccess() {
    router.push('/dashboard')
  }
  </script>