import request from '@/utils/request';

/**
 * 上传文件集合，formData 包含 `files` 字段，可多次 append
 */
export function uploadDocuments(formData: FormData) {
  return request.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getDocumentList() {
  return request.get('/documents');
}
