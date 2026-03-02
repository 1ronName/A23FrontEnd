<template>
  <div class="extraction-page">
    <h3>🔍 信息提取</h3>
    <p class="desc">从已上传的文档中提取关键信息，形成结构化数据集。</p>

    <el-row class="content-row" :gutter="20">
      <!-- 左侧文档列表 -->
      <el-col :span="8">
        <h3>文档列表</h3>
        <el-table
          :data="documents"
          height="300"
          style="width: 100%"
          @row-click="onDocClick"
          :row-class-name="getRowClass"
        >
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="uploadedAt" label="上传时间" width="110" />
          <el-table-column label="已选" width="50" align="center">
            <template #default="{ row }">
              <span v-if="selectedIds.includes(row.id)">✅</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="btn-group">
          <el-button type="primary" size="small" plain @click="clearSelection">
            清除选择
          </el-button>
        </div>
      </el-col>

      <!-- 右侧配置区 -->
      <el-col :span="16">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="自然语言提取" name="nl">
            <el-input
              type="textarea"
              v-model="nlQuery"
              placeholder="例如：提取所有合同的甲方名称、签订日期和合同金额"
              rows="3"
              :disabled="!canExtract"
            />
            <el-button
              type="primary"
              @click="executeNl"
              :disabled="!canExtract"
              :loading="loading"
              class="extract-btn"
            >
              执行提取
            </el-button>
          </el-tab-pane>

          <el-tab-pane label="表单配置提取" name="form">
            <div class="field-configs">
              <div class="field-row" v-for="(f, idx) in fields" :key="idx">
                <el-input v-model="f.name" placeholder="字段名" size="small" />
                <el-select v-model="f.type" placeholder="类型" size="small">
                  <el-option label="文本" value="text" />
                  <el-option label="日期" value="date" />
                  <el-option label="数字" value="number" />
                </el-select>
                <el-button type="text" :icon="Delete" @click="removeField(idx)" />
              </div>
              <el-button type="text" @click="addField">+ 添加字段</el-button>
            </div>
            <el-button
              type="primary"
              @click="executeForm"
              :disabled="!canExtract"
              :loading="loading"
              class="extract-btn"
            >
              开始提取
            </el-button>
          </el-tab-pane>
        </el-tabs>

        <!-- 提取结果展示区 -->
        <div class="result" v-if="result.length">
          <h3>提取结果</h3>
          <el-table :data="result" height="200" style="width: 100%">
            <el-table-column
              v-for="col in resultColumns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              show-overflow-tooltip
            />
          </el-table>
          <div class="save-actions">
            <el-input
              v-model="datasetName"
              placeholder="数据集名称"
              size="small"
              style="width: 200px"
            />
            <el-button type="success" size="small" @click="saveDataset" :disabled="!datasetName">
              保存为数据集
            </el-button>
            <el-button type="primary" size="small" @click="useForTable" :disabled="!result">
              立即用于表格填写
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { useExtractStore } from '@/stores/extractStore'
import { useDocumentStore } from '@/stores/documentStore'
import { extractDocuments } from '@/api/extract'
import { useRouter } from 'vue-router'
import type { DocumentItem } from '@/stores/documentStore'

// Stores
const extractStore = useExtractStore()
const docStore = useDocumentStore()
const router = useRouter()

// Data
const documents = ref<DocumentItem[]>([]) // 实际应从 docStore 获取
const loading = ref(false)
const selectedIds = ref<string[]>([])

// 提取配置
const activeTab = ref('nl')
const nlQuery = ref('')
const fields = ref<{ name: string; type: string }[]>([])

// 提取结果
const result = ref<any[]>([])
const resultColumns = ref<{ prop: string; label: string }[]>([])
const datasetName = ref('')

// 从文档 store 加载文档列表
onMounted(() => {
  // 假设 docStore.documents 是响应式的
  documents.value = docStore.documents
})

// 计算属性：是否允许提取
const canExtract = computed(() => selectedIds.value.length > 0)

// 文档行点击选择
function onDocClick(row: DocumentItem) {
  const idx = selectedIds.value.indexOf(row.id)
  if (idx === -1) selectedIds.value.push(row.id)
  else selectedIds.value.splice(idx, 1)
}

// 获取行样式（用于高亮选中的行）
function getRowClass({ row }: { row: DocumentItem }) {
  return selectedIds.value.includes(row.id) ? 'selected-row' : ''
}

function clearSelection() {
  selectedIds.value = []
}

function addField() {
  fields.value.push({ name: '', type: 'text' })
}

function removeField(idx: number) {
  fields.value.splice(idx, 1)
}

// 执行自然语言提取
async function executeNl() {
  if (!canExtract.value) return
  loading.value = true
  try {
    const payload = { ids: selectedIds.value, query: nlQuery.value }
    const res = await extractDocuments(payload)
    result.value = res.data || []
    buildColumns()
  } catch (err) {
    console.error('提取失败', err)
  } finally {
    loading.value = false
  }
}

// 执行表单配置提取
async function executeForm() {
  if (!canExtract.value) return
  loading.value = true
  try {
    const payload = { ids: selectedIds.value, fields: fields.value }
    const res = await extractDocuments(payload)
    result.value = res.data || []
    buildColumns()
  } catch (err) {
    console.error('提取失败', err)
  } finally {
    loading.value = false
  }
}

// 根据结果构建表格列
function buildColumns() {
  resultColumns.value = []
  if (result.value.length) {
    const keys = Object.keys(result.value[0])
    resultColumns.value = keys.map((key) => ({ prop: key, label: key }))
  }
}

// 保存为数据集
function saveDataset() {
  if (!datasetName.value) return
  extractStore.addDataset(datasetName.value, result.value)
  ElMessage.success('数据集保存成功')
  datasetName.value = ''
}

// 跳转到表格填写页（并传递结果）
function useForTable() {
  extractStore.setResult(result.value) // 假设 store 有此方法
  router.push('/fill')
}
</script>

<style scoped>
.content-row {
  flex: 1;
}
.btn-group {
  margin-top: 0.75rem;
  text-align: right;
}
.field-configs {
  margin-bottom: 1rem;
}
.field-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.extract-btn {
  margin-top: 1rem;
  width: 100%;
}
.result {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}
.save-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
</style>

<style>
/* 全局样式：高亮选中的行 */
.el-table .selected-row {
  background-color: #ecf5ff;
}
</style>
