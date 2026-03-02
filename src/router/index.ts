import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../pages/HomePage.vue') },
    { path: '/documents', component: () => import('../pages/DocumentUpload.vue') },
    { path: '/extract', component: () => import('../pages/Extraction.vue') },
    { path: '/fill', component: () => import('../pages/TableFill.vue') },
    { path: '/result', component: () => import('../pages/ResultPage.vue') },
    { path: '/command', component: () => import('../pages/CommandPage.vue') },
  ],
})

export default router
