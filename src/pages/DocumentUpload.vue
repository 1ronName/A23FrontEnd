<template>
  <div class="document-upload">
    <div class="upload-main">
      <h2>上传文档</h2>

      <div class="dropzone" @drop.prevent="onDrop" @dragover.prevent @dragenter.prevent>
        <p>将文件拖放到此处，或点击选择文件</p>
        <input type="file" multiple class="file-input" @change="onFilesChange" />
      </div>

      <div class="file-list" v-if="files.length">
        <ul class="plain-list">
          <li v-for="(file, idx) in files" :key="file.name">
            <span>{{ file.name }}</span>
            <el-button type="text" @click="removeFile(idx)">移除</el-button>
          </li>
        </ul>
      </div>

      <div class="actions">
        <el-button type="primary" :disabled="!files.length || uploading" @click="submitUpload">
          {{ uploading ? '上传中...' : '提交上传' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { uploadDocuments } from '@/api/document'
import { useDocumentStore } from '@/stores/documentStore'

const files = ref<File[]>([])
const uploading = ref(false)
const store = useDocumentStore()

function addFiles(fileList: FileList | File[]) {
  const arr: File[] = fileList instanceof FileList ? Array.from(fileList) : [...fileList]
  files.value.push(...arr)
  store.addDocuments(arr)
}

function onFilesChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    addFiles(input.files)
  }
}

function onDrop(e: DragEvent) {
  if (e.dataTransfer && e.dataTransfer.files) {
    addFiles(e.dataTransfer.files)
  }
}

function removeFile(index: number) {
  files.value.splice(index, 1)
  // 简单同步 store（重写 store.documents）
  store.documents = [...files.value]
}

async function submitUpload() {
  if (!files.value.length) return
  uploading.value = true
  const form = new FormData()
  files.value.forEach((f) => form.append('files', f))
  try {
    const res = await uploadDocuments(form)
    if (res && res.data) {
      store.uploadedIds = res.data.ids || []
    }
    files.value = []
    store.clearDocuments()
  } catch (err) {
    console.error('上传失败', err)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.document-upload {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.upload-main {
  width: 100%;
  max-width: 800px;
}

.dropzone {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  position: relative;
  background: #fafafa;
}

.dropzone p {
  margin: 0;
  color: #666;
}

.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-list {
  margin-top: 1rem;
}

.plain-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.plain-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.actions {
  margin-top: 1rem;
  text-align: right;
}
</style>
