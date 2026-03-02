<template>
  <div class="table-fill-page">
    <div class="main">
      <h2>表格填写</h2>

      <div class="upload-area">
        <input type="file" class="file-input" @change="onFileChange" />
        <div v-if="templateName">已选择：{{ templateName }}</div>
      </div>

      <el-button type="primary" :loading="loading" @click="submitFill" :disabled="!file"
        >生成并下载</el-button
      >

      <div v-if="downloadUrl" class="result">
        <p>生成完毕：<a :href="downloadUrl" target="_blank">下载链接</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fillTable } from '@/api/table'

const file = ref<File | null>(null)
const templateName = ref('')
const loading = ref(false)
const downloadUrl = ref('')

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    file.value = input.files[0]
    templateName.value = file.value.name
  }
}

async function submitFill() {
  if (!file.value) return
  loading.value = true
  const form = new FormData()
  form.append('template', file.value)
  try {
    const res = await fillTable(form)
    // 假设后端返回 { url: '...' }
    downloadUrl.value = res.data?.url || ''
  } catch (err) {
    console.error('填写失败', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.table-fill-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.main {
  width: 100%;
  max-width: 900px;
}
.upload-area {
  margin-bottom: 1rem;
}
.file-input {
  display: block;
}
</style>
