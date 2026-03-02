import { defineStore } from 'pinia'

interface Dataset {
  id: string
  name: string
  data: any[]
}

interface ExtractState {
  extractedData: any
  loading: boolean
  datasets: Dataset[]
}

function makeId() {
  return Date.now().toString()
}

export const useExtractStore = defineStore('extract', {
  state: (): ExtractState => ({
    extractedData: null,
    loading: false,
    datasets: [],
  }),
  actions: {
    setResult(data: any) {
      this.extractedData = data
    },
    setLoading(flag: boolean) {
      this.loading = flag
    },
    addDataset(name: string, data: any[]) {
      this.datasets.push({ id: makeId(), name, data })
    },
    getDatasetById(id: string) {
      return this.datasets.find((d) => d.id === id)
    },
  },
})
