<!-- 简单入口页

需要：

跳转按钮

去上传

去提取

去填表 -->
<el-upload
  action="/api/upload"
  multiple
  :auto-upload="false"
>
  <el-button type="primary">选择文件</el-button>
</el-upload>