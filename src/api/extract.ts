import request from '@/utils/request'

export function extractDocuments(payload: any) {
  // payload 可以是 { ids: string[] } 或 formData，根据后端约定
  return request.post('/documents/extract', payload)
}

export default {
  extractDocuments,
}
// extractDocuments()
