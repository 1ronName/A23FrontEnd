<template>
  <div class="result-page">
    <div class="main">
      <h2>提取结果</h2>

      <div v-if="!data">暂无结果，请先执行提取。</div>

      <div v-else>
        <h3>结构化数据</h3>
        <pre>{{ formatted }}</pre>

        <h4>准确率（占位）</h4>
        <el-progress :percentage="accuracy" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExtractStore } from '@/stores/extractStore'

const store = useExtractStore()
const data = computed(() => store.extractedData)
const formatted = computed(() => (data.value ? JSON.stringify(data.value, null, 2) : ''))

// 暂用固定占位值，后续可由后端返回
const accuracy = 85
</script>

<style scoped>
.result-page {
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
.main pre {
  background: #fafafa;
  padding: 1rem;
  border-radius: 6px;
  overflow: auto;
}
</style>
