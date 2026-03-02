<template>
  <div class="command-page">
    <h3>🧠 智能指令</h3>
    <p class="desc">通过自然语言指令直接操作文档和表格，支持信息提取、格式调整、表格填充等任务。</p>

    <el-input
      type="textarea"
      v-model="input"
      placeholder="例如：提取最近上传文档的标题，或：从文档'合同1.docx'中提取合同金额，并保存为数据集'金额数据'"
      rows="4"
      resize="none"
    />
    <div class="action-bar">
      <el-button type="primary" @click="sendCommand" :loading="loading"> 执行指令 </el-button>
      <el-button @click="clearHistory" :disabled="!history.length"> 清空历史 </el-button>
    </div>

    <div class="history" v-if="history.length">
      <h3>📋 执行历史</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in history"
          :key="idx"
          :timestamp="item.time"
          placement="top"
        >
          <el-card shadow="hover">
            <p><strong>指令：</strong>{{ item.cmd }}</p>
            <p><strong>结果：</strong></p>
            <pre class="result-pre">{{ item.result }}</pre>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDocumentStore } from '@/stores/documentStore'
import { useExtractStore } from '@/stores/extractStore'
import { extractDocuments } from '@/api/extract'

interface HistoryItem {
  cmd: string
  result: string
  time: string
}

const input = ref('')
const loading = ref(false)
const history = ref<HistoryItem[]>([])

const docStore = useDocumentStore()
const extractStore = useExtractStore()

// 辅助：添加历史记录
function pushHistory(cmd: string, result: string) {
  history.value.unshift({
    cmd,
    result,
    time: new Date().toLocaleTimeString(),
  })
}

// 执行指令
async function sendCommand() {
  if (!input.value.trim()) {
    ElMessage.warning('请输入指令')
    return
  }

  loading.value = true
  const cmd = input.value.trim()
  try {
    // 简单指令解析示例（可扩展）
    // 1. 提取并保存为数据集：从文档"xxx"中提取...保存为数据集"yyy"
    const extractSaveMatch = cmd.match(
      /从文档["'‘](.+?)["'’]中提取[\s\S]*?保存为数据集["'‘](.+?)["'’]/,
    )
    if (extractSaveMatch) {
      const docName = extractSaveMatch[1]
      const dsName = extractSaveMatch[2]
      const doc = docStore.documents.find((d) => d.name.includes(docName))
      if (!doc) {
        pushHistory(cmd, `未找到包含“${docName}”的文档`)
      } else {
        const res = await extractDocuments({ ids: [doc.id], query: cmd })
        const data = res.data || []
        extractStore.addDataset(dsName, data)
        pushHistory(cmd, `已提取并保存数据集“${dsName}”，共 ${data.length} 条记录`)
      }
      input.value = ''
      return
    }

    // 2. 提取并立即用于表格填写（跳转到表格页）
    if (/提取/.test(cmd) && /表格填写|填充/.test(cmd)) {
      // 尝试获取文档ID
      const nameMatch = cmd.match(/文档["'‘](.+?)["'’]/)
      let ids: string[] = []
      if (nameMatch) {
        const doc = docStore.documents.find((d) => d.name.includes(nameMatch[1]))
        if (doc) ids = [doc.id]
      }
      const res = await extractDocuments({ ids, query: cmd })
      extractStore.setResult(res.data || [])
      pushHistory(cmd, `提取完成，结果已暂存，请前往“表格填写”页继续操作`)
      // 不自动跳转，保持当前页面，用户可手动切换
      input.value = ''
      return
    }

    // 3. 其他指令（模拟）
    pushHistory(cmd, '指令已接收，但暂未实现具体操作（可扩展自定义处理）')
    input.value = ''
  } catch (err) {
    console.error('指令执行失败', err)
    pushHistory(cmd, `执行出错：${err instanceof Error ? err.message : String(err)}`)
  } finally {
    loading.value = false
  }
}

function clearHistory() {
  history.value = []
}
</script>

<style scoped>
.action-bar {
  margin: 1rem 0 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.history {
  flex: 1;
  min-height: 0; /* 防止flex溢出 */
  overflow-y: auto;
  border-top: 1px solid #f0f2f5;
  padding-top: 1rem;
}

.history h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.result-pre {
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
}
</style>
