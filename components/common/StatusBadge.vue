<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    <component 
      :is="statusIcon" 
      v-if="showIcon"
      class="-ml-0.5 mr-1.5 h-2 w-2" 
      :class="iconClasses"
    />
    {{ formattedStatus }}
  </span>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/solid'

const props = defineProps<{
  status: string
  showIcon?: boolean
}>()

const statusConfig = {
  active: {
    color: 'green',
    icon: CheckCircleIcon,
    label: 'Active'
  },
  inactive: {
    color: 'gray',
    icon: XCircleIcon,
    label: 'Inactive'
  },
  pending: {
    color: 'yellow',
    icon: ClockIcon,
    label: 'Pending'
  },
  failed: {
    color: 'red',
    icon: XCircleIcon,
    label: 'Failed'
  },
  warning: {
    color: 'yellow',
    icon: ExclamationCircleIcon,
    label: 'Warning'
  },
  completed: {
    color: 'green',
    icon: CheckCircleIcon,
    label: 'Completed'
  },
  processing: {
    color: 'blue',
    icon: ClockIcon,
    label: 'Processing'
  },
  expired: {
    color: 'red',
    icon: XCircleIcon,
    label: 'Expired'
  },
  cancelled: {
    color: 'gray',
    icon: XCircleIcon,
    label: 'Cancelled'
  }
}

const currentStatus = computed(() => {
  const status = props.status.toLowerCase()
  return statusConfig[status] || statusConfig.pending
})

const statusClasses = computed(() => ({
  [`bg-${currentStatus.value.color}-100 text-${currentStatus.value.color}-800`]: true
}))

const iconClasses = computed(() => ({
  [`text-${currentStatus.value.color}-400`]: true
}))

const formattedStatus = computed(() => {
  return currentStatus.value.label
})
</script>