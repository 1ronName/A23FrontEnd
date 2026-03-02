<template>
  <div>
    <pre>{{ data }}</pre>
    <a :href="downloadUrl" v-if="downloadUrl">下载文件</a>
  </div>
</template>
最简单版本：

仅展示后端返回的 JSON

或展示下载链接

等后期再做真正的 Excel 表格可视化。