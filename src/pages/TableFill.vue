<template>
  <div class="table-fill-page">
    <h3>🧾 表格填写</h3>
    <p class="desc">
      上传 Word/Excel 模板并选择数据源（已保存数据集或文档库）。系统将智能填充并提供下载链接。
    </p>

    <!-- 模板上传区域 -->
    <div class="upload-area">
      <el-upload
        class="template-upload"
        drag
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleFileChange"
        accept=".doc,.docx,.xls,.xlsx"
      >
        <template #default>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽模板文件到此处或 <em>点击上传</em></div>
        </template>
        <template #tip>
          <div class="el-upload__tip">支持 Word/Excel 格式，文件大小不超过 10MB</div>
        </template>
      </el-upload>

      <div v-if="templateFile" class="template-info">
        <el-tag type="info" closable @close="clearTemplate">
          <el-icon><Document /></el-icon>
          {{ templateFile.name }}
        </el-tag>
        <el-button type="text" size="small" @click="selectFromDocs">从文档库选择</el-button>
      </div>

      <!-- 从文档库选择模板（快捷方式） -->
      <div v-if="showDocSelector" class="doc-selector">
        <el-select
          v-model="selectedTemplateDocId"
          placeholder="选择文档库中的文件作为模板"
          size="small"
          style="width: 100%"
          @change="useDocAsTemplate"
        >
          <el-option v-for="doc in documents" :key="doc.id" :label="doc.name" :value="doc.id" />
        </el-select>
      </div>
    </div>

    <!-- 数据源选择 -->
    <div class="source-area">
      <el-radio-group v-model="sourceMode">
        <el-radio label="dataset">📊 使用已保存数据集</el-radio>
        <el-radio label="documents">📁 直接分析文档</el-radio>
      </el-radio-group>

      <div v-if="sourceMode === 'dataset'" class="dataset-select">
        <el-select
          v-model="selectedDatasetId"
          placeholder="选择数据集"
          style="width: 100%"
          clearable
        >
          <el-option v-for="ds in datasets" :key="ds.id" :label="ds.name" :value="ds.id" />
        </el-select>
      </div>

      <div v-else class="doc-select">
        <el-table
          :data="documents"
          height="200"
          @selection-change="onDocSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column prop="name" label="文档名称" show-overflow-tooltip />
        </el-table>
      </div>
    </div>

    <!-- 执行按钮 -->
    <div class="action-area">
      <el-button
        type="primary"
        :loading="loading"
        @click="submitFill"
        :disabled="!canSubmit"
        size="large"
      >
        执行填充
      </el-button>
    </div>

    <!-- 生成结果 -->
    <div v-if="downloadUrl" class="result-area">
      <el-alert title="填充完成" type="success" :closable="false" show-icon>
        <template #default>
          文件已生成，<a :href="downloadUrl" target="_blank" class="download-link">点击下载</a>
        </template>
      </el-alert>
    </div>

    <!-- 填充历史 -->
    <div v-if="fillHistory.length" class="history-area">
      <h3>📋 填充记录</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in fillHistory"
          :key="idx"
          :timestamp="item.time + 'ms'"
          placement="top"
        >
          <el-card>
            <p>
              模板：{{ item.templateName }}，
              <a :href="item.url" target="_blank">下载</a>
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UploadFilled, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fillTable } from '@/api/table'
import { useDocumentStore } from '@/stores/documentStore'
import { useExtractStore } from '@/stores/extractStore'

// Stores
const docStore = useDocumentStore()
const extractStore = useExtractStore()

// 文档列表 & 数据集列表
const documents = computed(() => docStore.documents)
const datasets = computed(() => extractStore.datasets) // 假设每个数据集有 id 和 name

// 模板文件
const templateFile = ref<File | null>(null)
const showDocSelector = ref(false)
const selectedTemplateDocId = ref<string | null>(null)

// 数据源模式
const sourceMode = ref<'dataset' | 'documents'>('dataset')
const selectedDatasetId = ref<string | null>(null)
const selectedDocIds = ref<string[]>([])

// 执行状态
const loading = ref(false)
const downloadUrl = ref('')

// 填充历史（简单本地记录）
const fillHistory = ref<{ templateName: string; url: string; time: number }[]>([])

// 处理文件上传组件变更
const handleFileChange = (file: any) => {
  templateFile.value = file.raw
  showDocSelector.value = false // 关闭文档库选择器
}

// 清空模板
const clearTemplate = () => {
  templateFile.value = null
}

// 从文档库选择模板（切换显示）
const selectFromDocs = () => {
  showDocSelector.value = !showDocSelector.value
}

// 使用选中的文档作为模板
const useDocAsTemplate = (docId: string) => {
  const doc = docStore.documents.find((d) => d.id === docId)
  if (doc) {
    // 假设文档对象中保存了原始文件（可能需要通过接口获取）
    // 这里简化：模拟一个 File 对象
    templateFile.value = new File([], doc.name, { type: 'application/octet-stream' })
    templateFile.value = doc.file // 如果 store 里存了 File 对象
    showDocSelector.value = false
    selectedTemplateDocId.value = null
  }
}

// 文档列表多选变化
const onDocSelectionChange = (selection: any[]) => {
  selectedDocIds.value = selection.map((item) => item.id)
}

// 是否可执行填充
const canSubmit = computed(() => {
  if (!templateFile.value) return false
  if (sourceMode.value === 'dataset') {
    return !!selectedDatasetId.value
  } else {
    return selectedDocIds.value.length > 0
  }
})

// 提交填充
const submitFill = async () => {
  if (!canSubmit.value) return

  loading.value = true
  const start = Date.now()
  const formData = new FormData()
  formData.append('template', templateFile.value!)

  // 构建请求体（根据后端接口要求调整）
  const requestData: any = {
    sourceMode: sourceMode.value,
  }
  if (sourceMode.value === 'dataset') {
    requestData.datasetId = selectedDatasetId.value
  } else {
    requestData.docIds = selectedDocIds.value
  }
  // 将 JSON 数据作为第二个参数传递（可能需要后端支持 multipart 混合）
  formData.append('data', JSON.stringify(requestData))

  try {
    const res = await fillTable(formData)
    if (res.data?.url) {
      const url = res.data.url
      const time = Date.now() - start
      downloadUrl.value = url
      fillHistory.value.unshift({
        templateName: templateFile.value!.name,
        url,
        time,
      })
      ElMessage.success('填充成功')
      // 清空当前选择（可选）
      // templateFile.value = null
      // selectedDatasetId.value = null
      // selectedDocIds.value = []
    } else {
      ElMessage.error('填充失败，请稍后重试')
    }
  } catch (err) {
    console.error('填充出错', err)
    ElMessage.error('网络错误，请检查后端服务')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-area {
  margin-bottom: 1.5rem;
}

.template-upload {
  width: 100%;
}

.template-info {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.doc-selector {
  margin-top: 0.5rem;
}

.source-area {
  margin-bottom: 1.5rem;
}

.source-area .el-radio-group {
  margin-bottom: 1rem;
}

.dataset-select,
.doc-select {
  margin-top: 0.5rem;
}

.action-area {
  margin-bottom: 1.5rem;
  text-align: right;
}

.result-area {
  margin-bottom: 1.5rem;
}

.download-link {
  font-weight: 600;
  text-decoration: underline;
}

.history-area {
  margin-top: 1rem;
  border-top: 1px solid #f0f2f5;
  padding-top: 1rem;
}

.history-area h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
</style>
