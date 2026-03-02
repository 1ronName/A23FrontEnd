<template>
  <!-- 宽屏：左右分栏；小屏：选项卡 -->
  <div class="home-container">
    <!-- 宽屏模式：左右分栏 -->
    <div class="home-split">
      <!-- 左侧面板 -->
      <aside class="left-panel">
        <div class="left-header">
          <h2 class="app-title">📄 智能文档处理</h2>
          <div class="user-info">
            <el-avatar
              :size="32"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
            <span class="username">张三</span>
          </div>
        </div>

        <el-menu
          :default-active="activeTab"
          class="menu"
          @select="handleMenuSelect"
          :collapse="false"
          unique-opened
        >
          <el-menu-item index="documents">
            <el-icon><Folder /></el-icon>
            <span>文档库</span>
          </el-menu-item>
          <el-menu-item index="extract">
            <el-icon><Search /></el-icon>
            <span>信息提取</span>
          </el-menu-item>
          <el-menu-item index="fill">
            <el-icon><Document /></el-icon>
            <span>表格填写</span>
          </el-menu-item>
          <el-menu-item index="command">
            <el-icon><ChatDotRound /></el-icon>
            <span>智能指令</span>
          </el-menu-item>
        </el-menu>

        <div class="left-footer">
          <el-tag size="small" type="info" effect="plain">当前模型: GLM-4</el-tag>
          <p class="version">v1.0.0</p>
        </div>
      </aside>

      <!-- 右侧工作区 -->
      <main class="right-panel">
        <keep-alive>
          <component :is="activeComponent" class="workspace" />
        </keep-alive>
      </main>
    </div>

    <!-- 小屏模式：选项卡 -->
    <div class="home-tabs">
      <el-tabs v-model="activeTabName" class="tabs-container">
        <el-tab-pane label="工具" name="tools">
          <div class="mobile-menu-wrapper">
            <div class="mobile-header">
              <h2 class="app-title">📄 智能文档处理</h2>
              <div class="user-info">
                <el-avatar
                  :size="32"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                />
                <span class="username">张三</span>
              </div>
            </div>

            <el-menu
              :default-active="activeTab"
              class="menu"
              @select="handleMenuSelect"
              unique-opened
            >
              <el-menu-item index="documents">
                <el-icon><Folder /></el-icon>
                <span>文档库</span>
              </el-menu-item>
              <el-menu-item index="extract">
                <el-icon><Search /></el-icon>
                <span>信息提取</span>
              </el-menu-item>
              <el-menu-item index="fill">
                <el-icon><Document /></el-icon>
                <span>表格填写</span>
              </el-menu-item>
              <el-menu-item index="command">
                <el-icon><ChatDotRound /></el-icon>
                <span>智能指令</span>
              </el-menu-item>
            </el-menu>

            <div class="mobile-footer">
              <el-tag size="small" type="info" effect="plain">当前模型: GLM-4</el-tag>
              <p class="version">v1.0.0</p>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="工作区" name="workspace">
          <keep-alive>
            <component :is="activeComponent" class="workspace" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Folder, Search, Document, ChatDotRound } from '@element-plus/icons-vue'
import DocumentUpload from '@/pages/DocumentUpload.vue'
import Extraction from '@/pages/Extraction.vue'
import TableFill from '@/pages/TableFill.vue'
import CommandPage from '@/pages/CommandPage.vue'

const activeTab = ref('documents')
const activeTabName = ref('workspace')

const componentsMap: Record<string, any> = {
  documents: DocumentUpload,
  extract: Extraction,
  fill: TableFill,
  command: CommandPage,
}

const activeComponent = computed(() => componentsMap[activeTab.value] || DocumentUpload)

const handleMenuSelect = (key: string) => {
  activeTab.value = key
  // 小屏时自动切换到工作区选项卡
  activeTabName.value = 'workspace'
}
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
}

/* 宽屏：分栏模式 */
.home-split {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.left-panel {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
}

.left-header {
  padding: 0 1.25rem 1rem 1.25rem;
  border-bottom: 1px solid #f0f2f5;
}

.app-title {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.username {
  font-size: 0.95rem;
  color: #606266;
}

.menu {
  flex: 1;
  border: none;
  margin-top: 0.5rem;
}

.left-footer {
  padding: 1.25rem;
  border-top: 1px solid #f0f2f5;
  color: #909399;
  font-size: 0.85rem;
}

.version {
  margin-top: 0.5rem;
  color: #c0c4cc;
}

.right-panel {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* 小屏：选项卡模式 */
.home-tabs {
  display: none;
  width: 100%;
  height: 100%;
}

.tabs-container {
  width: 100%;
  height: 100%;
}

.mobile-menu-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.mobile-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f2f5;
}

.mobile-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f2f5;
  color: #909399;
  font-size: 0.85rem;
}

/* 响应式媒体查询（屏幕宽度 < 1024px 时切换为选项卡） */
@media (max-width: 1023px) {
  .home-split {
    display: none;
  }

  .home-tabs {
    display: flex;
  }
}
</style>
