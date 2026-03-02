import { defineStore } from 'pinia'

interface ExtractState {
  extractedData: any
  loading: boolean
}

export const useExtractStore = defineStore('extract', {
  state: (): ExtractState => ({
    extractedData: null,
    loading: false,
  }),
  actions: {
    setResult(data: any) {
      this.extractedData = data
    },
    setLoading(flag: boolean) {
      this.loading = flag
    },
  },
})
