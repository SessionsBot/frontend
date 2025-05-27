import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/pages/landingPage.vue'
import LoginSuccess from '../components/pages/loginRedirect.vue'
import Dashboard from '../components/pages/dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/api/login-success',
    name: 'LoginSuccess',
    component: LoginSuccess
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
