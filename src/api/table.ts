import request from '@/utils/request'

export function fillTable(formData: FormData) {
  return request.post('/table/fill', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export default {
  fillTable,
}
// fillTable()
