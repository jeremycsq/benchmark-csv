import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse } from '@/types/api'

export const useApiDataStore = defineStore('apiData', () => {
  const data = ref<ApiResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<Date | null>(null)

  const fetchData = async (month: string, country?: string) => {
    loading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        analysis_month: month,
      })

      if (country) {
        params.append('country', country)
      }

      const response = await fetch(`http://localhost:8000/api/traffic/benchmark-data?${params}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No data available for this month/country.')
        }
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const responseData = await response.json()

      data.value = responseData
      lastFetch.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'

    } finally {
      loading.value = false
    }
  }

  const clearData = () => {
    data.value = null
    error.value = null
    lastFetch.value = null
  }

  return {
    data,
    loading,
    error,
    lastFetch,
    fetchData,
    clearData,
  }
})
