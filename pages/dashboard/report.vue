<!-- pages/dashboard/report.vue -->
<template>
    <div class="space-y-6">
    <!-- Header dengan button export -->
    <PageHeader 
      title="Message Reports"
      subtitle="View and export message history"
    >
      <template #actions>
        <button 
          @click="exportPDF"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
          Export PDF
        </button>
      </template>
    </PageHeader>
  
    <!-- Message Types Navigation -->
    <div class="bg-white p-4 shadow rounded-lg">
        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="currentTab = tab.id"
                :class="[
                currentTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
            >
                {{ tab.name }}
            </button>
            <!-- Export Button -->
            <button 
         @click="exportPDF"
         class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
       >
         <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
         Export Report
       </button>

            </nav>

        </div>
    </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white shadow rounded-lg p-6">
      <LoadingSpinner text="Loading messages..." />
    </div>
  
      <!-- Messages Table -->
    <!-- Messages Table -->
    <div v-else class="bg-white shadow rounded-lg">
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="msg in filteredMessages" :key="msg.created_at">
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatDate(msg.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ msg.target_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full',
                    msg.message_type === 'single' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  ]">
                    {{ msg.message_type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">{{ msg.message }}</td>
                <td class="px-6 py-4 text-sm">{{ msg.status }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="msg.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredMessages.length === 0" class="text-center py-6">
          <p class="text-gray-500">No messages found</p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredMessages.length > 0" class="mt-4 flex justify-between items-center">
          <p class="text-sm text-gray-700">
            Showing {{ ((currentPage-1) * perPage) + 1 }} to {{ Math.min(currentPage * perPage, totalItems) }} of {{ totalItems }}
          </p>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
  import jsPDF from 'jspdf'
  import 'jspdf-autotable'

  definePageMeta({
    layout: 'dashboard'
  })
  
  const authStore = useAuthStore()
  const userStore = useUserStore()
  
  const messages = ref([])
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalItems = ref(0)
  const totalPages = ref(0)
  const loading = ref(false)
  const currentTab = ref('all')
  
  const tabs = [
    { id: 'all', name: 'All Messages' },
    { id: 'single', name: 'Single Messages' },
    { id: 'bulk', name: 'Bulk Messages' }
  ]
  
  // Filter messages berdasarkan tab yang aktif
  const filteredMessages = computed(() => {
    if (currentTab.value === 'all') return messages.value
    return messages.value.filter(msg => msg.message_type === currentTab.value)
  })
  
  onMounted(async () => {
    await loadMessages()
  })
  
  async function loadMessages() {
    try {
      loading.value = true
      const userId = authStore.user?.id
      if (!userId) return
  
      const response = await userStore.fetchMessageHistory(userId, currentPage.value, perPage.value)
      console.log('Messages Response:', response) // Debug log
  
      if (response?.success) {
        messages.value = response.data
        totalItems.value = response.pagination.total
        totalPages.value = response.pagination.pages
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      loading.value = false
    }
  }
  
  async function exportPDF() {
  try {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(16)
    doc.text('Message Report', 14, 15)
    
    // Add filter info
    doc.setFontSize(11)
    doc.text(`Type: ${currentTab.value === 'all' ? 'All Messages' : `${currentTab.value.charAt(0).toUpperCase() + currentTab.value.slice(1)} Messages`}`, 14, 25)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32)
    
    // Define the columns
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Number', dataKey: 'number' },
      { header: 'Type', dataKey: 'type' },
      { header: 'Message', dataKey: 'message' },
      { header: 'Status', dataKey: 'status' }
    ]
    
    // Transform the data
    const tableData = filteredMessages.value.map(msg => ({
      date: formatDate(msg.created_at),
      number: msg.target_number,
      type: msg.message_type,
      message: msg.message,
      status: msg.status
    }))
    
    // Add the table
    doc.autoTable({
      startY: 40,
      columns: columns,
      body: tableData,
      headStyles: { fillColor: [46, 125, 50] },
      styles: { overflow: 'linebreak' },
      columnStyles: {
        message: { cellWidth: 60 }
      }
    })
    
    // Save the PDF
    doc.save(`message-report-${currentTab.value}-${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Failed to export PDF. Please try again.')
  }
}
  
  watch([currentPage, currentTab], () => {
    loadMessages()
  })
  
  function formatDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleString()
  }
  </script>