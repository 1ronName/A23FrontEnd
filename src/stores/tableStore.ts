import { defineStore } from 'pinia'

interface TableState {
  templateFile: File | null
  generatedFileUrl: string | null
}

export const useTableStore = defineStore('table', {
  state: (): TableState => ({
    templateFile: null,
    generatedFileUrl: null,
  }),
  actions: {
    setTemplate(file: File) {
      this.templateFile = file
    },
    setGeneratedUrl(url: string) {
      this.generatedFileUrl = url
    },
    clear() {
      this.templateFile = null
      this.generatedFileUrl = null
    },
  },
})
