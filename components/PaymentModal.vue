# components/PaymentModal.vue
<template>
  <div class="fixed inset-0 z-50">
    <!-- Backdrop with blur -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
    
    <!-- Modal Container with Scroll -->
    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
            <h3 class="text-lg font-medium text-gray-900">Select Payment Method</h3>
          </div>

          <!-- Modal Body with Scroll -->
          <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <!-- Plan Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-500">Selected Plan</p>
                  <p class="font-medium text-gray-900">{{ plan.name }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Amount</p>
                  <p class="font-medium text-gray-900">Rp {{ formatPrice(plan.price) }}</p>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-3">
              <template v-for="(group, category) in groupedPaymentMethods" :key="category">
                <p class="text-sm font-medium text-gray-700 mb-2">{{ category }}</p>
                <button
                  v-for="method in group"
                  :key="method.id"
                  @click="selectMethod(method)"
                  class="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  :class="{
                    'border-green-500 bg-green-50': selectedMethod?.id === method.id,
                    'border-gray-200': selectedMethod?.id !== method.id
                  }"
                >
                  <div class="flex items-center">
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ method.name }}</p>
                      <p class="text-sm text-gray-500">{{ method.description }}</p>
                    </div>
                    <div v-if="selectedMethod?.id === method.id" 
                      class="w-5 h-5 text-green-500">
                      <CheckIcon class="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </template>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl">
            <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
              {{ error }}
            </div>

            <div class="flex space-x-3">
              <button
                @click="$emit('close')"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                :disabled="processing"
              >
                Cancel
              </button>
              <button
                @click="handlePayment"
                :disabled="!selectedMethod || processing"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="processing">
                  <span class="inline-block animate-spin mr-2">⌛</span>
                  Processing...
                </span>
                <span v-else>Continue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const paymentStore = usePaymentStore()

const selectedMethod = ref(null)
const processing = ref(false)
const error = ref('')

const paymentMethods = [
  {
    id: 'BC',
    name: 'Credit Card / Debit Card',
    description: 'Pay with Visa, Mastercard, or JCB',
    category: 'Cards'
  },
  {
    id: 'M2',
    name: 'Mandiri Virtual Account',
    description: 'Pay via Mandiri Virtual Account',
    category: 'Virtual Account'
  },
  {
    id: 'BT',
    name: 'Permata Bank',
    description: 'Pay via Permata Bank Virtual Account',
    category: 'Virtual Account'
  },
  {
    id: 'B1',
    name: 'CIMB Niaga',
    description: 'Pay via CIMB Niaga Virtual Account',
    category: 'Virtual Account'
  },
  {
    id: 'A1',
    name: 'ATM Bersama',
    description: 'Pay through ATM Bersama Network',
    category: 'Virtual Account'
  },
  {
    id: 'I1',
    name: 'BNI Virtual Account',
    description: 'Pay via BNI Virtual Account',
    category: 'Virtual Account'
  },
  {
    id: 'BR',
    name: 'BRI Virtual Account',
    description: 'Pay via BRI Virtual Account',
    category: 'Virtual Account'
  },
  {
    id: 'OV',
    name: 'OVO',
    description: 'Pay with your OVO balance',
    category: 'E-Wallet'
  },
  {
    id: 'SA',
    name: 'ShopeePay',
    description: 'Pay with ShopeePay',
    category: 'E-Wallet'
  },
  {
    id: 'LQ',
    name: 'LinkAja',
    description: 'Pay with LinkAja',
    category: 'E-Wallet'
  }
]

// Group payment methods by category
const groupedPaymentMethods = computed(() => {
  return paymentMethods.reduce((groups, method) => {
    const category = method.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(method)
    return groups
  }, {})
})

function selectMethod(method) {
  selectedMethod.value = method
  error.value = ''
}

function formatPrice(price) {
  return new Intl.NumberFormat('id-ID').format(price)
}

async function handlePayment() {
  if (!selectedMethod.value) return

  try {
    processing.value = true
    error.value = ''

    const response = await paymentStore.createPayment({
      planId: props.plan.id,
      paymentMethod: selectedMethod.value.id
    })

    // Handle the redirect to Duitku
    if (response.data?.paymentUrl) {
      // Open in new tab
      window.open(response.data.paymentUrl, '_self')
      // Close the modal
      emit('close')
    } else {
      throw new Error('Payment URL not received')
    }
  } catch (err) {
    console.error('Payment error:', err)
    error.value = err.message || 'Failed to process payment. Please try again.'
  } finally {
    processing.value = false
  }
}
</script>