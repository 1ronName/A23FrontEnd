import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: "/", component: () => import("../pages/Home.vue") },
  { path: "/upload", component: () => import("../pages/DocumentUpload.vue") },
  { path: "/extract", component: () => import("../pages/Extraction.vue") },
  { path: "/fill", component: () => import("../pages/TableFill.vue") },
  { path: "/result", component: () => import("../pages/Result.vue") }],
})

export default router
