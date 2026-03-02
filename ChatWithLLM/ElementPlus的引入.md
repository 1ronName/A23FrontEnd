按步骤做即可。

---

# 一、安装 Element Plus

在项目根目录执行：

```bash
npm install element-plus
```

---

# 二、在 main.ts 中注册

```ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"

import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount("#app")
```

完成后，全局组件即可使用。

---

# 三、（推荐）按需引入 + 自动导入

如果想优化打包体积，安装：

```bash
npm install -D unplugin-auto-import unplugin-vue-components
```

然后在 `vite.config.ts` 添加：

```ts
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ]
})
```

这样：

* 不需要手动 import 组件
* 自动 tree-shaking
* 更适合比赛项目

---

# 四、常用组件（你现在会用到的）

## 1️⃣ 文件上传

```vue
<el-upload
  action="/api/upload"
  multiple
  :auto-upload="false"
>
  <el-button type="primary">选择文件</el-button>
</el-upload>
```

---

## 2️⃣ 表格展示

```vue
<el-table :data="tableData">
  <el-table-column prop="name" label="名称" />
  <el-table-column prop="value" label="值" />
</el-table>
```

---

## 3️⃣ loading

```ts
import { ElLoading } from "element-plus"

const loading = ElLoading.service({
  fullscreen: true
})
```

---

## 4️⃣ 消息提示

```ts
import { ElMessage } from "element-plus"

ElMessage.success("上传成功")
ElMessage.error("解析失败")
```

---

# 五、建议你现在这样做

第一步只做：

✔ 安装
✔ main.ts 注册
✔ 用 el-button 测试

例如在 Home.vue：

```vue
<template>
  <el-button type="primary">测试按钮</el-button>
</template>
```

如果页面正常显示蓝色按钮，说明配置成功。

---

# 六、后续建议

你这个比赛系统非常适合用 Element Plus，因为你需要：

* 上传组件
* 表格
* Dialog
* Drawer
* Tabs
* Loading
* Form

后期 UI 基本不用自己写。