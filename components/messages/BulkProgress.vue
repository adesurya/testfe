<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-500">Progress</div>
      <StatusBadge :status="progress.status" />
    </div>

    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="bg-green-600 h-2.5 rounded-full transition-all duration-500"
        :style="{ width: `${percentComplete}%` }"
      ></div>
    </div>

    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="bg-gray-50 rounded p-3">
        <div class="text-2xl font-bold text-gray-900">{{ progress.sent }}</div>
        <div class="text-sm text-gray-500">Sent</div>
      </div>
      <div class="bg-gray-50 rounded p-3">
        <div class="text-2xl font-bold text-gray-900">{{ progress.failed }}</div>
        <div class="text-sm text-gray-500">Failed</div>
      </div>
    </div>

    <div v-if="progress.failed > 0" class="bg-red-50 rounded p-4">
      <h4 class="text-sm font-medium text-red-800 mb-2">Failed Numbers:</h4>
      <ul class="text-sm text-red-700 space-y-1">
        <li v-for="number in progress.failedNumbers" :key="number">
          {{ number }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bulkId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['complete'])
const messageStore = useMessageStore()

const progress = ref({
  status: 'processing',
  total: 0,
  sent: 0,
  failed: 0,
  failedNumbers: []
})

const percentComplete = computed(() => {
  if (!progress.value.total) return 0
  return Math.round((progress.value.sent / progress.value.total) * 100)
})

// Poll progress every 2 seconds
let pollInterval = null

onMounted(() => {
  pollProgress()
  pollInterval = setInterval(pollProgress, 2000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

async function pollProgress() {
  try {
    const response = await messageStore.getBulkProgress(props.bulkId)
    progress.value = response

    if (['completed', 'failed'].includes(response.status)) {
      if (pollInterval) clearInterval(pollInterval)
      emit('complete')
    }
  } catch (error) {
    console.error('Error polling progress:', error)
  }
}
</script>