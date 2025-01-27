<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Bulk Progress</h3>
          <StatusBadge :status="status.status" />
        </div>
  
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Messages"
            :value="status.totalMessages"
          />
          <StatCard
            label="Sent"
            :value="status.sentMessages"
          />
          <StatCard
            label="Failed"
            :value="status.failedMessages"
          />
          <StatCard
            label="Pending"
            :value="status.pendingMessages"
          />
        </div>
  
        <div class="relative pt-1">
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              :style="`width: ${progress}%`"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            />
          </div>
        </div>
  
        <div v-if="status.failedNumbers?.length" class="mt-4">
          <h4 class="text-sm font-medium text-gray-900">Failed Numbers</h4>
          <div class="mt-2 max-h-40 overflow-y-auto">
            <ul class="divide-y divide-gray-200">
              <li 
                v-for="number in status.failedNumbers"
                :key="number"
                class="py-2 text-sm text-gray-500"
              >
                {{ number }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    bulkId: number
  }>()
  
  const emit = defineEmits<{
    (e: 'complete'): void
  }>()
  
  const bulkStore = useBulkMessageStore()
  const status = ref({})
  const progress = computed(() => {
    if (!status.value.totalMessages) return 0
    return (status.value.sentMessages / status.value.totalMessages) * 100
  })
  
  let pollInterval
  
  onMounted(() => {
    pollStatus()
    pollInterval = setInterval(pollStatus, 5000)
  })
  
  onUnmounted(() => {
    clearInterval(pollInterval)
  })
  
  async function pollStatus() {
    try {
      status.value = await bulkStore.getBulkStatus(props.bulkId)
      if (['completed', 'failed'].includes(status.value.status)) {
        clearInterval(pollInterval)
        emit('complete')
      }
    } catch (error) {
      console.error('Status polling error:', error)
      clearInterval(pollInterval)
    }
  }
  </script>