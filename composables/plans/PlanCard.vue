<template>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-6">
        <!-- Plan Header -->
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900">{{ plan.name }}</h3>
          <div class="mt-4">
            <span class="text-4xl font-extrabold text-gray-900">${{ plan.price }}</span>
            <span class="text-gray-500">/{{ plan.durationDays }} days</span>
          </div>
        </div>
  
        <!-- Plan Features -->
        <div class="mt-6">
          <ul class="space-y-4">
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-green-500" />
              <span class="ml-3 text-gray-500">{{ plan.messageLimit }} Messages</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-green-500" />
              <span class="ml-3 text-gray-500">{{ plan.durationDays }} Days Validity</span>
            </li>
            <li class="flex items-center">
              <CheckIcon class="h-5 w-5 text-green-500" />
              <span class="ml-3 text-gray-500">WhatsApp API Access</span>
            </li>
          </ul>
        </div>
  
        <!-- Action Button -->
        <div class="mt-8">
          <button
            @click="$emit('select', plan)"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-150"
          >
            Select Plan
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckIcon } from '@heroicons/vue/24/outline'
  
  defineProps(['plan'])
  defineEmits(['select'])
  </script>