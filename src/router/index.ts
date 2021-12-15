import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/EA',
    },
    {
      path: '/:area',
      name: 'Main',
      props: true,
      component: () => import('../views/MainView.vue'),
    },
  ],
})

export default router
