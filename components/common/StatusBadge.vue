<template>
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="statusClasses"
    >
      <component
        :is="statusIcon"
        v-if="showIcon"
        class="-ml-0.5 mr-1.5 h-2 w-2"
      />
      {{ status }}
    </span>
  </template>
  
  <script setup lang="ts">
  import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon
  } from '@heroicons/vue/24/solid'
  
  const props = defineProps<{
    status: string
    showIcon?: boolean
  }>()
  
  const statusClasses = computed(() => {
    const classes = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      processing: 'bg-blue-100 text-blue-800'
    }
  
    const statusMap = {
      completed: 'success',
      failed: 'error',
      pending: 'pending',
      active: 'active',
      inactive: 'inactive',
      processing: 'processing',
      warning: 'warning'
    }
  
    const mappedStatus = statusMap[props.status.toLowerCase()] || 'pending'
    return classes[mappedStatus]
  })
  
  const statusIcon = computed(() => {
    const icons = {
      success: CheckCircleIcon,
      error: XCircleIcon,
      warning: ExclamationTriangleIcon,
      pending: ClockIcon,
      active: CheckCircleIcon,
      inactive: XCircleIcon,
      processing: ClockIcon
    }
  
    const statusMap = {
      completed: 'success',
      failed: 'error',
      pending: 'pending',
      active: 'active',
      inactive: 'inactive',
      processing: 'processing',
      warning: 'warning'
    }
  
    const mappedStatus = statusMap[props.status.toLowerCase()] || 'pending'
    return icons[mappedStatus]
  })
  </script>