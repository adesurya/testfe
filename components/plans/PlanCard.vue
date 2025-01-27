<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="px-6 py-8">
        <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
        <p class="mt-4 text-gray-500">{{ plan.description }}</p>
        <p class="mt-8">
          <span class="text-4xl font-extrabold text-gray-900">${{ plan.price }}</span>
          <span class="text-base font-medium text-gray-500">/month</span>
        </p>
        <ul role="list" class="mt-6 space-y-4">
          <li v-for="feature in plan.features" :key="feature" class="flex">
            <CheckIcon class="flex-shrink-0 h-6 w-6 text-green-500" />
            <span class="ml-3 text-base text-gray-500">{{ feature }}</span>
          </li>
        </ul>
        <button
          @click="selectPlan"
          class="mt-8 block w-full bg-indigo-600 py-3 px-6 border border-transparent rounded-md text-center font-medium text-white hover:bg-indigo-700"
        >
          Select Plan
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps<{
    plan: {
      id: number
      name: string
      price: number
      description: string
      features: string[]
    }
  }>()
  
  const emit = defineEmits<{
    (e: 'select', planId: number): void
  }>()
  
  function selectPlan() {
    emit('select', props.plan.id)
  }
  </script>