<template>
  <div class="csv-uploader">
    <div class="upload-section">
      <h3 class="text-lg font-semibold mb-4">CSV File Upload</h3>

      <!-- Drop zone -->
      <div
        class="upload-zone"
        :class="{ dragover: isDragOver, uploading: uploading }"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="hidden"
        />

        <div class="upload-content">
          <div class="upload-icon">
            <svg
              class="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
          </div>

          <div class="upload-text">
            <p class="text-lg font-medium text-gray-700">
              {{ uploading ? 'Uploading...' : 'Drag and drop your CSV file here' }}
            </p>
            <p class="text-sm text-gray-500 mt-1">or click to select a file</p>
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div v-if="uploading" class="progress-bar mt-4">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        <span class="progress-text">{{ progress }}%</span>
      </div>

      <!-- Template button -->
      <div class="template-section mt-4">
        <button @click="downloadTemplate" class="template-btn" :disabled="uploading">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Download CSV Template
        </button>
      </div>
    </div>

    <!-- Results -->
    <div v-if="uploadResult" class="result-section mt-6">
      <div class="result-card" :class="uploadResult.success ? 'success' : 'error'">
        <div class="result-header">
          <div class="result-icon">
            <svg
              v-if="uploadResult.success"
              class="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <div class="result-title">
            {{ uploadResult.success ? 'Upload successful' : 'Upload error' }}
          </div>
        </div>

        <div class="result-message">
          {{ uploadResult.message }}
        </div>

        <div v-if="uploadResult.inserted > 0" class="result-stats">
          {{ uploadResult.inserted }} record(s) inserted
        </div>

        <div v-if="uploadResult.errors.length > 0" class="result-errors">
          <h4 class="error-title">Errors detected:</h4>
          <ul class="error-list">
            <li v-for="error in uploadResult.errors" :key="error" class="error-item">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCsvUpload, type CsvUploadResult } from '../composables/useCsvUpload'

// Props
const props = defineProps<{
  tableName?: string
}>()

const { uploading, progress, uploadCsvFile, downloadTemplate } = useCsvUpload(
  props.tableName || 'traffic',
)

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploadResult = ref<CsvUploadResult | null>(null)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = async (file: File) => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    uploadResult.value = {
      success: false,
      message: 'Please select a CSV file',
      inserted: 0,
      errors: [],
    }
    return
  }

  try {
    uploadResult.value = null
    const result = await uploadCsvFile(file)
    uploadResult.value = result
  } catch (error) {
    uploadResult.value = {
      success: false,
      message: 'Error during file upload',
      inserted: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}
</script>

<style scoped>
.csv-uploader {
  @apply max-w-2xl mx-auto p-6;
}

.upload-zone {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors;
}

.upload-zone:hover {
  @apply border-gray-400 bg-gray-50;
}

.upload-zone.dragover {
  @apply border-blue-500 bg-blue-50;
}

.upload-zone.uploading {
  @apply border-gray-200 bg-gray-100 cursor-not-allowed;
}

.upload-content {
  @apply flex flex-col items-center;
}

.upload-icon {
  @apply mb-4;
}

.upload-text {
  @apply text-center;
}

.progress-bar {
  @apply relative bg-gray-200 rounded-full h-4 overflow-hidden;
}

.progress-fill {
  @apply bg-blue-500 h-full transition-all duration-300 ease-out;
}

.progress-text {
  @apply absolute inset-0 flex items-center justify-center text-xs font-medium text-white;
}

.template-section {
  @apply text-center;
}

.template-btn {
  @apply inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.result-section {
  @apply mt-6;
}

.result-card {
  @apply rounded-lg p-4 border;
}

.result-card.success {
  @apply bg-green-50 border-green-200;
}

.result-card.error {
  @apply bg-red-50 border-red-200;
}

.result-header {
  @apply flex items-center mb-2;
}

.result-icon {
  @apply mr-2;
}

.result-title {
  @apply font-semibold;
}

.result-card.success .result-title {
  @apply text-green-800;
}

.result-card.error .result-title {
  @apply text-red-800;
}

.result-message {
  @apply mb-2;
}

.result-card.success .result-message {
  @apply text-green-700;
}

.result-card.error .result-message {
  @apply text-red-700;
}

.result-stats {
  @apply text-sm font-medium text-green-600 mb-2;
}

.result-errors {
  @apply mt-3;
}

.error-title {
  @apply font-medium text-red-800 mb-2;
}

.error-list {
  @apply list-disc list-inside space-y-1;
}

.error-item {
  @apply text-sm text-red-700;
}
</style>
