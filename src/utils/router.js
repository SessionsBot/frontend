// App Imports:
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useNavStore } from './stores/nav'


// Top Page Imports:
import homepage from '../pages/homepage.vue'
import notFound from '../pages/notFound.vue'

// Info Page Imports:
import pricingPlans from '@/pages/info/pricing.vue'

// User Page Imports:
import signIntoAccount from '../pages/user/signIntoAccount.vue'
import dashboard from '../pages/user/dashboard.vue'

// API Page Imports:
import signInRedirect from '../pages/api/signInRedirect.vue'
import guildSetup from '../pages/api/guildSetup/guildSetup.vue'







const routes = [

  // Page Routes:
  {
    path: '/',
    name: 'homepage',
    component: homepage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: notFound
  },
  

  // Info Routes:
  {
    path: '/info/pricing-plans',
    name: 'pricing-plans',
    component: pricingPlans
  },
  

  // User Routes
  {
    path: '/user/sign-in',
    name: 'sign-in',
    component: signIntoAccount
  },
  {
    path: '/user/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {requiresAuth: true},
    alias: '/dashboard'

  },
  // {
  //   path: '/user/account',
  //   name: 'user-account',
  //   component: MyAccount
  // },


  // API Routes:
  {
    path: '/api/sign-in/discord-redirect',
    name: 'sign-in-redirect',
    component: signInRedirect
  },
  {
    path: '/api/guild-setup',
    name: 'guild-setup',
    component: guildSetup
  },
  
]

// Create Router:
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create 'Account Restricted' navigation guard:
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  // Account Restricted Pages:
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // Not authenticated, redirect to Sign-In
    next({ path: '/user/sign-in', query: { message: `Please sign in to access ${to.name}` } })

  } else if(to.path === '/user/sign-in' && auth.isAuthenticated){
    // Already Signed In, redirect to User Dashbaord
    next({path: '/user/dashboard'})

  } else {
    // No restriction:
    next()
  }
  // Reenable Header if/was hidden:
  const nav = useNavStore()
  nav.headerVisible = true;
})

export default router
