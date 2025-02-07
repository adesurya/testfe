<template>
  <div class="border rounded-lg shadow-sm bg-white">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 p-2 border-b">
      <!-- Format Buttons -->
      <button
        v-for="format in formats"
        :key="format.id"
        @click="applyFormat(format.markup)"
        class="p-2 hover:bg-gray-100 rounded"
        :title="format.label"
      >
        <component :is="format.icon" class="h-4 w-4 text-gray-600" />
      </button>

      <!-- Divider -->
      <div class="w-px h-6 bg-gray-200 mx-2"></div>

      <!-- Emoji Picker -->
      <div class="relative">
        <button
          @click="showEmojiPicker = !showEmojiPicker"
          class="p-2 hover:bg-gray-100 rounded"
          title="Insert Emoji"
        >
          <SmileIcon class="h-4 w-4 text-gray-600" />
        </button>

        <div
          v-if="showEmojiPicker"
          v-click-outside="() => showEmojiPicker = false"
          class="absolute z-50 mt-1 bg-white border rounded-lg shadow-lg p-4 w-[320px]"
        >
          <div class="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            <button
              v-for="(emoji, code) in emojiMap"
              :key="code"
              @click="insertEmoji(emoji)"
              class="p-1 hover:bg-gray-100 rounded text-lg"
              :title="code"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Media Upload -->
      <div v-if="allowMedia">
        <button
          @click="triggerFileInput"
          class="p-2 hover:bg-gray-100 rounded"
          title="Upload Image"
        >
          <ImageIcon class="h-4 w-4 text-gray-600" />
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        >
      </div>
    </div>

    <!-- Editor Area -->
    <textarea
      ref="textarea"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="6"
      :placeholder="placeholder"
      class="w-full p-4 focus:outline-none resize-none"
    ></textarea>

    <!-- Preview -->
    <div class="border-t p-4 bg-gray-50">
      <div class="text-sm font-medium text-gray-500 mb-2">Preview</div>
      <div class="prose prose-sm max-w-none whitespace-pre-wrap">{{ previewText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SmileIcon, ImageIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Type your message here...'
  },
  allowMedia: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'media-upload'])

const textarea = ref(null)
const fileInput = ref(null)
const showEmojiPicker = ref(false)

// Format buttons configuration
const formats = [
  { id: 'bold', label: 'Bold', markup: '**' },
  { id: 'italic', label: 'Italic', markup: '_' },
  { id: 'strikethrough', label: 'Strikethrough', markup: '~~' },
]

// Emoji mapping
const emojiMap = {
  ':fire:': '🔥',
  ':smile:': '😊',
  ':heart:': '❤️',
  ':check:': '✅',
  ':x:': '❌',
  ':star:': '⭐',
  ':laugh:': '😂',
  ':wink:': '😉',
  ':cry:': '😢',
  ':angry:': '😠',
  ':cool:': '😎',
  ':love:': '😍',
  ':thinking:': '🤔',
  ':clap:': '👏',
  ':pray:': '🙏',
  ':rocket:': '🚀',
  ':warning:': '⚠️',
  ':info:': 'ℹ️',
  ':phone:': '📱',
  ':mail:': '📧',
  ':ok:': '👌'
}

// Preview with emoji replacement
const previewText = computed(() => {
  let content = props.modelValue
  
  // Replace emoji codes with actual emojis
  Object.entries(emojiMap).forEach(([code, emoji]) => {
    content = content.replace(new RegExp(code, 'g'), emoji)
  })
  
  return content
})

// Format text functions
function applyFormat(format) {
  const start = textarea.value.selectionStart
  const end = textarea.value.selectionEnd
  const text = props.modelValue
  
  const selection = text.substring(start, end)
  const formatted = `${format}${selection}${format}`
  const newText = text.substring(0, start) + formatted + text.substring(end)
  emit('update:modelValue', newText)
}

// Emoji functions
function insertEmoji(emoji) {
  const start = textarea.value.selectionStart
  const newText = props.modelValue.slice(0, start) + emoji + props.modelValue.slice(start)
  emit('update:modelValue', newText)
  showEmojiPicker.value = false
}

// File upload functions
function triggerFileInput() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    emit('media-upload', file)
  }
  fileInput.value.value = '' // Reset file input
}
</script>

<style scoped>
.prose img {
  max-width: 100%;
  height: auto;
}
</style>