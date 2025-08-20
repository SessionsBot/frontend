// App Imports:
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useNavStore } from './stores/nav'


// Top Page Imports:
import homepage from '../pages/homepage.vue'
import notFound from '@/pages/notFound.vue'

// Info Page Imports:
import pricingPlans from '@/pages/info/pricing.vue'
import support from '@/pages/info/support/support.vue'
import privacyPolicy from '@/pages/info/privacy.vue'
import termsAndConditions from '@/pages/info/terms.vue'

// User Page Imports:
import signIntoAccount from '@/pages/user/account/signIn.vue'
import myAccount from '@/pages/user/account/myAccount.vue'
import dashboard from '@/pages/user/dashboard/dashboard.vue'

// API Page Imports:
import signInRedirect from '@/pages/api/signInRedirect.vue'
import guildSetup from '@/pages/api/guildSetup/guildSetup.vue'



const routes = [

  // Main Routes:
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
    path: '/info/pricing',
    name: 'pricing-plans',
    component: pricingPlans,
    alias: ['/pricing-plans', '/solutions', '/pricing']
  },
  {
    path: '/support',
    name: 'support',
    component: support,
    alias: ['/help', '/faq']
  },
  {
    path: '/privacy',
    name: 'privacy-policy',
    component: privacyPolicy,
    alias: ['/privacy-policy', '/security']
  },
  {
    path: '/terms',
    name: 'terms-and-conditions',
    component: termsAndConditions,
    alias: ['/terms-and-conditions', '/usage-policy']
  },


  // User Routes
  {
    path: '/user/sign-in',
    name: 'sign-in',
    alias: ['/login', '/log-in', '/signin'],
    component: signIntoAccount
  },
  {
    path: '/user/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {requiresAuth: true},
    alias: '/dashboard'

  },
  {
    path: '/user/account',
    name: 'user-account',
    component: myAccount,
    meta: {requiresAuth: true},
    alias: ['/account'],
  },


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
  {
    path: '/invite',
    name: 'invite',
    beforeEnter() {
      useNavStore().externalPaths().inviteBotUsingDiscord()
    },
    component: homepage
  }
  
]

// Create Router:
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If user used browser back/forward buttons
    if (savedPosition) {
      return savedPosition
    }
    // Always scroll to top for new navigation
    return { top: 0 }
  }
})

// Create 'Account Restricted' navigation guard:
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  // Account Restricted Pages:
  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    // Not authenticated, redirect to Sign-In
    console.info('[Router-Guard] Not authed, redirecting to sign in...')
    next({ path: '/user/sign-in', query: { message: `Please sign in to access ${to.name}` } })

  } else if(to.path === '/user/sign-in' && auth.isAuthenticated){
    // Already Signed In, redirect to User Dashboard
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