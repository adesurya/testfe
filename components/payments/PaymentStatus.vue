<template>
    <div class="bg-white shadow rounded-lg p-6">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full" :class="statusIconClass">
          <component 
            :is="statusIcon" 
            class="h-6 w-6 text-white" 
            aria-hidden="true" 
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">
          {{ statusTitle }}
        </h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ statusMessage }}
        </p>
      </div>
  
      <div class="mt-6">
        <div class="bg-gray-50 rounded-lg p-4">
          <dl class="grid grid-cols-1 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ payment.transactionId }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Amount</dt>
              <dd class="mt-1 text-sm text-gray-900">${{ payment.amount.toFixed(2) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payment Method</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ payment.paymentMethod }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Date</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(payment.createdAt) }}</dd>
            </div>
          </dl>
        </div>
      </div>
  
      <div class="mt-6 space-y-4">
        <button
          v-if="payment.status === 'pending'"
          @click="checkStatus"
          :disabled="checking"
          class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <RefreshIcon v-if="checking" class="animate-spin -ml-1 mr-2 h-4 w-4" />
          {{ checking ? 'Checking Status...' : 'Check Status' }}
        </button>
  
        <button
          v-if="payment.status === 'failed'"
          @click="$emit('retry')"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Try Again
        </button>
  
        <button
          v-if="payment.status === 'completed'"
          @click="$emit('continue')"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Continue
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    RefreshIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps<{
    payment: {
      transactionId: string
      amount: number
      paymentMethod: string
      status: 'pending' | 'completed' | 'failed'
      createdAt: string
    }
  }>()
  
  const emit = defineEmits<{
    (e: 'retry'): void
    (e: 'continue'): void
    (e: 'statusUpdate', status: string): void
  }>()
  
  const { authApi } = useApi()
  const checking = ref(false)
  
  const statusConfig = computed(() => ({
    pending: {
      icon: ClockIcon,
      iconClass: 'bg-yellow-500',
      title: 'Payment Pending',
      message: 'Your payment is being processed. This may take a few minutes.'
    },
    completed: {
      icon: CheckCircleIcon,
      iconClass: 'bg-green-500',
      title: 'Payment Successful',
      message: 'Your payment has been processed successfully.'
    },
    failed: {
      icon: XCircleIcon,
      iconClass: 'bg-red-500',
      title: 'Payment Failed',
      message: 'There was an error processing your payment. Please try again.'
    }
  }))
  
  const statusIcon = computed(() => statusConfig.value[props.payment.status].icon)
  const statusIconClass = computed(() => statusConfig.value[props.payment.status].iconClass)
  const statusTitle = computed(() => statusConfig.value[props.payment.status].title)
  const statusMessage = computed(() => statusConfig.value[props.payment.status].message)
  
  async function checkStatus() {
    if (checking.value) return
  
    try {
      checking.value = true
      const response = await authApi(`/api/payments/status/${props.payment.transactionId}`)
      emit('statusUpdate', response.data.status)
    } catch (error) {
      console.error('Error checking payment status:', error)
    } finally {
      checking.value = false
    }
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString()
  }
  
  // Auto-check status for pending payments
  let statusInterval: number | null = null
  
  onMounted(() => {
    if (props.payment.status === 'pending') {
      statusInterval = setInterval(checkStatus, 10000) // Check every 10 seconds
    }
  })
  
  onUnmounted(() => {
    if (statusInterval) {
      clearInterval(statusInterval)
    }
  })
  </script>