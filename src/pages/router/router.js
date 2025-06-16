import { createRouter, createWebHistory } from 'vue-router'
import Home from '../homepage.vue'
import Dashboard from '../dashboard.vue'
import LoginRedirect from '../loginRedirect.vue'
import ApiTesting from '../apiTesting.vue'
import GuildSetup from '../guildSetup.vue'
import NotFound from '../notFound.vue'
import MyAccount from '../myAccount.vue'

const routes = [

  // Page Routes:

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
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },

  {
    path: '/user/account',
    name: 'user-account',
    component: MyAccount
  },

  // API Routes:

  {
    path: '/api/login-redirect',
    name: 'login-redirect',
    component: LoginRedirect
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
