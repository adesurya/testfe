# components/payments/PaymentMethodList.vue
<template>
  <div class="space-y-4">
    <h4 class="font-medium text-gray-900">Choose Payment Method</h4>
    <div class="grid gap-3">
      <button
        v-for="method in methods"
        :key="method.id"
        @click="$emit('select', method)"
        class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        :class="{
          'border-green-500 bg-green-50': selectedMethodId === method.id,
          'border-gray-200': selectedMethodId !== method.id
        }"
      >
        <div class="flex items-center flex-1">
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ method.name }}</p>
            <p v-if="method.description" class="text-sm text-gray-500">
              {{ method.description }}
            </p>
          </div>
        </div>
        <CheckIcon 
          v-if="selectedMethodId === method.id"
          class="h-5 w-5 text-green-500 ml-4" 
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  selectedMethodId: String
})

defineEmits(['select'])

const methods = [
  { 
    id: 'BC', 
    name: 'Credit Card / Debit Card',
    description: 'Pay securely with your credit or debit card'
  },
  { 
    id: 'M2', 
    name: 'Mandiri Virtual Account',
    description: 'Pay via Mandiri Virtual Account'
  },
  { 
    id: 'BT', 
    name: 'Permata Bank Virtual Account',
    description: 'Pay via Permata Bank Virtual Account'
  },
  { 
    id: 'B1', 
    name: 'CIMB Niaga Virtual Account',
    description: 'Pay via CIMB Niaga Virtual Account'
  },
  { 
    id: 'A1', 
    name: 'ATM Bersama',
    description: 'Pay via ATM Bersama network'
  },
  { 
    id: 'I1', 
    name: 'BNI Virtual Account',
    description: 'Pay via BNI Virtual Account'
  },
  { 
    id: 'BR', 
    name: 'BRI Virtual Account',
    description: 'Pay via BRI Virtual Account'
  },
  { 
    id: 'OV', 
    name: 'OVO',
    description: 'Pay with your OVO balance'
  },
  { 
    id: 'SA', 
    name: 'ShopeePay',
    description: 'Pay with your ShopeePay balance'
  },
  { 
    id: 'LQ', 
    name: 'LinkAja',
    description: 'Pay with your LinkAja balance'
  }
]
</script>