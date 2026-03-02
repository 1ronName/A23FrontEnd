<template>
  <div class="doc-upload">
    <h3>📁 文档库</h3>
    <el-upload
      class="upload-area"
      drag
      multiple
      action="#"
      :auto-upload="false"
      :on-change="handleChange"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">支持格式：docx, md, xlsx, txt（单个文件≤10MB）</div>
      </template>
    </el-upload>

    <el-table :data="fileList" style="margin-top: 1.5rem">
      <el-table-column prop="name" label="文件名" />
      <el-table-column prop="size" label="大小" width="120" />
      <el-table-column prop="time" label="上传时间" width="180" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="preview(row)">预览</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const fileList = ref<any[]>([])

const handleChange = (file: any) => {
  // 实际处理上传逻辑，这里仅演示
  fileList.value.push({
    name: file.name,
    size: (file.size / 1024).toFixed(2) + ' KB',
    time: new Date().toLocaleString(),
    raw: file,
  })
}
const preview = (row: any) => {
  // 预览逻辑
}
const remove = (row: any) => {
  const index = fileList.value.indexOf(row)
  fileList.value.splice(index, 1)
}
</script>

<style scoped>
.upload-area {
  margin-top: 1rem;
}
</style>
