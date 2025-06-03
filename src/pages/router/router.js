import { createRouter, createWebHistory } from 'vue-router'
import Home from '../homepage.vue'
import Dashboard from '../dashboard.vue'
import LoginRedirect from '../loginRedirect.vue'
import ApiTesting from '../apiTesting.vue'
import GuildSetup from '../guildSetup.vue'
import NotFound from '../notFound.vue'

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: Home
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
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
    path: '/api/guild-setup',
    name: 'internal-testing',
    component: GuildSetup
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
