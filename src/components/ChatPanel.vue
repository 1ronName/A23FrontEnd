功能：

输入框

发送按钮

聊天记录展示

loading 状态

<template>
  <div class="chat-panel">
    <div class="messages">
      <div v-for="msg in messages" :key="msg.id">
        {{ msg.role }}: {{ msg.content }}
      </div>
    </div>

    <div class="input-area">
      <input v-model="input" />
      <button @click="send">发送</button>
    </div>
  </div>
</template>

store：

messages: { role: "user" | "assistant"; content: string }[]

API：

POST /api/chat