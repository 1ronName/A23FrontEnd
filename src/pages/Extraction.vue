<template>
  <div class="extraction-page">
    <div class="main">
      <h2>信息提取</h2>
      <p>从已上传的文档中提取结构化信息。</p>

      <el-button type="primary" :loading="loading" @click="startExtract">开始解析</el-button>

      <div class="result" v-if="result">
        <h3>提取结果（JSON）</h3>
        <pre>{{ formatted }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useExtractStore } from '@/stores/extractStore'
import { extractDocuments } from '@/api/extract'
import { useRouter } from 'vue-router'

const store = useExtractStore()
const loading = ref(false)
const router = useRouter()

const result = computed(() => store.extractedData)
const formatted = computed(() => (result.value ? JSON.stringify(result.value, null, 2) : ''))

async function startExtract() {
  loading.value = true
  try {
    // 简单调用：后端根据已上传文件进行提取
    const res = await extractDocuments({})
    store.setResult(res.data || null)
    router.push('/result')
  } catch (err) {
    console.error('提取失败', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.extraction-page {
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
.result pre {
  background: #fafafa;
  padding: 1rem;
  border-radius: 6px;
  overflow: auto;
}
</style>
