当前前端技术栈已经确定：

* **Vue.js**
* **TypeScript**
* **Vue Router**
* **Pinia**
* **Prettier**

结合赛题要求（文档上传、信息提取、表格填写、AI交互），建议前端结构如下。

---

# 一、推荐项目结构

```
src
 ├─ api              # 后端接口封装
 │   ├─ document.ts
 │   ├─ extract.ts
 │   └─ table.ts
 │
 ├─ assets           # 静态资源
 │
 ├─ components       # 通用组件
 │   ├─ FileUploader.vue
 │   ├─ ChatPanel.vue
 │   ├─ TablePreview.vue
 │   └─ Loading.vue
 │
 ├─ views            # 页面
 │   ├─ Home.vue
 │   ├─ DocumentUpload.vue
 │   ├─ Extraction.vue
 │   ├─ TableFill.vue
 │   └─ Result.vue
 │
 ├─ router
 │   └─ index.ts
 │
 ├─ store
 │   ├─ documentStore.ts
 │   └─ resultStore.ts
 │
 ├─ utils
 │   ├─ request.ts
 │   └─ file.ts
 │
 ├─ App.vue
 └─ main.ts
```

---

# 二、核心页面设计

根据题目三个模块拆 UI。

## 1 文档上传模块

功能：

* 上传 docx / md / txt / xlsx
* 批量上传
* 显示文件列表

组件：

```
FileUploader.vue
```

界面：

```
[上传文件]
--------------------
doc1.docx
doc2.xlsx
doc3.md
```

调用接口：

```
POST /api/upload
```

---

## 2 信息提取模块

功能：

* 调用 AI 解析文档
* 显示提取信息
* 用户确认

UI：

```
Extraction.vue

左侧：文档内容
右侧：提取结构化数据
```

示例：

```
合同名称：xxx
客户：xxx
金额：xxx
日期：xxx
```

接口：

```
POST /api/extract
```

---

## 3 表格填写模块

功能：

* 上传模板表格
* 自动填充
* 预览结果

UI：

```
TableFill.vue
```

流程：

```
上传模板
     ↓
系统匹配数据
     ↓
生成Excel
     ↓
下载
```

接口：

```
POST /api/fill-table
```

---

# 三、Router 设计

`router/index.ts`

```
/                首页
/upload          文档上传
/extract         信息提取
/fill            表格填写
/result          结果
```

示例：

```ts
const routes = [
  { path: "/", component: () => import("../views/Home.vue") },
  { path: "/upload", component: () => import("../views/DocumentUpload.vue") },
  { path: "/extract", component: () => import("../views/Extraction.vue") },
  { path: "/fill", component: () => import("../views/TableFill.vue") },
  { path: "/result", component: () => import("../views/Result.vue") }
]
```

---

# 四、Pinia 状态设计

### documentStore

存储上传文档

```
documents[]
```

### resultStore

存储提取结果

```
entities
tableResult
```

---

# 五、HTTP封装

`utils/request.ts`

用 axios：

```ts
import axios from "axios"

export const request = axios.create({
  baseURL: "/api",
  timeout: 10000
})
```

---

# 六、UI组件建议

为了节省时间，建议直接用组件库：

推荐：

* **Element Plus**
* 或 **Naive UI**

可快速获得：

* 上传组件
* 表格组件
* loading
* message

---

# 七、建议先完成的最小 Demo

比赛 Demo 不需要做复杂 UI。

优先实现：

1. 上传文档
2. 调用 AI 提取
3. 生成 Excel
4. 下载

流程：

```
上传文档
   ↓
点击“解析”
   ↓
显示提取结果
   ↓
上传模板
   ↓
生成Excel
```

---

如果需要，我可以继续给你：

* **完整 Vue3 + TS 项目初始化模板**
* **前端 API 设计（和后端对接格式）**
* **比赛 Demo 的 UI 原型图**
* **文档上传 + AI 调用的完整代码示例**。
