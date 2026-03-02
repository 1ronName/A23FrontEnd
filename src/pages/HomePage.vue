<template>
  <div class="home-container">
    <div class="home-main">
      <h1 class="title">文档智能处理系统</h1>

      <el-row :gutter="20" class="card-row">
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="always" class="home-card">
            <h3>📁 文档上传</h3>
            <p>当前已选：{{ documentStore.documents.length }} 个文件</p>
            <el-button type="primary" @click="go('/upload')">前往上传</el-button>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="always" class="home-card">
            <h3>🔍 信息提取</h3>
            <p>
              最近一次提取：
              <span v-if="extractStore.extractedData">已完成</span>
              <span v-else>未开始</span>
            </p>
            <el-button type="success" @click="go('/extract')">去提取</el-button>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="always" class="home-card">
            <h3>🧾 表格填写</h3>
            <p>
              模板已上传：
              <span v-if="tableStore.templateFile">{{ tableStore.templateFile.name }}</span>
              <span v-else>无</span>
            </p>
            <el-button type="warning" @click="go('/fill')">去填写</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDocumentStore } from '@/stores/documentStore'
import { useExtractStore } from '@/stores/extractStore'
import { useTableStore } from '@/stores/tableStore'

const router = useRouter()

const documentStore = useDocumentStore()
const extractStore = useExtractStore()
const tableStore = useTableStore()

const go = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.home-main {
  width: 100%;
  max-width: 1000px;
  text-align: center;
}

.title {
  margin-bottom: 1.5rem;
}

.card-row {
  margin: 0 auto;
}

.home-card {
  padding: 1rem;
}
</style>
