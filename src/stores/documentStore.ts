import { defineStore } from 'pinia';

interface DocumentState {
  documents: File[];
  uploadedIds: string[];
}

export const useDocumentStore = defineStore('document', {
  state: (): DocumentState => ({
    documents: [],
    uploadedIds: [],
  }),
  actions: {
    addDocuments(files: File[]) {
      this.documents.push(...files);
    },
    clearDocuments() {
      this.documents = [];
    },
  },
});
