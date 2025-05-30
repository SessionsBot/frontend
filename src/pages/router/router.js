import { createRouter, createWebHistory } from 'vue-router'
import Home from '../landingPage.vue'
import Dashboard from '../dashboard.vue'
import LoginRedirect from '../loginRedirect.vue'
import ApiTesting from '../apiTesting.vue'

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: Home
  },

  {
    path: '/api/login-redirect',
    name: 'login-redirect',
    component: LoginRedirect
  },
  
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },

  {
    path: '/api/internal-testing',
    name: 'internal-testing',
    component: ApiTesting
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
