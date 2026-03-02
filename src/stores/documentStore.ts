import { defineStore } from 'pinia'

export interface DocumentItem {
  id: string
  name: string
  size: number
  uploadedAt: string // ISO string for simplicity
  file: File
}

interface DocumentState {
  documents: DocumentItem[]
  uploadedIds: string[]
}

function makeId(file: File) {
  return `${Date.now()}-${file.name}`
}

export const useDocumentStore = defineStore('document', {
  state: (): DocumentState => ({
    documents: [],
    uploadedIds: [],
  }),
  actions: {
    addDocuments(files: File[]) {
      const items = files.map((f) => ({
        id: makeId(f),
        name: f.name,
        size: f.size,
        uploadedAt: new Date().toISOString(),
        file: f,
      }))
      this.documents.push(...items)
    },
    deleteDocument(id: string) {
      this.documents = this.documents.filter((d) => d.id !== id)
    },
    clearDocuments() {
      this.documents = []
    },
    getDocumentById(id: string) {
      return this.documents.find((d) => d.id === id)
    },
  },
})
