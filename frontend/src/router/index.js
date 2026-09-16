import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue')
      },
      {
        path: 'solicitudes',
        name: 'requests',
        component: () => import('../views/RequestsView.vue')
      },
      {
        path: 'solicitudes/nueva',
        name: 'new-request',
        component: () => import('../views/NewRequestView.vue')
      },
      {
        path: 'solicitudes/:id',
        name: 'request-detail',
        component: () => import('../views/RequestDetailView.vue')
      },
      {
        path: 'monitor',
        name: 'monitor',
        component: () => import('../views/MonitorView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
