// App Imports:
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useNavStore } from "./stores/nav";

// Root/Main Page Imports:
import homepage from "../pages/homepage.vue";
import notFound from "@/pages/notFound.vue";
// Info Page Imports:
import pricingPlans from "@/pages/info/pricing.vue";
import support from "@/pages/info/support/support.vue";
import privacyPolicy from "@/pages/info/privacy.vue";
import termsAndConditions from "@/pages/info/terms.vue";
// User Page Imports:
import signIntoAccount from "@/pages/user/account/signIn.vue";
import myAccount from "@/pages/user/account/myAccount.vue";
import dashboard from "@/pages/user/dashboard/dashboard.vue";
// API Page Imports:
import signInRedirect from "@/pages/api/signInRedirect.vue";
import guildSetup from "@/pages/api/guildSetup/guildSetup.vue";


// All Routes:
const routes = [
  // ROOT/Homepage:
  {
    path: "/",
    name: "homepage",
    component: homepage,
  },
  			
  // Info Routes:
  {
    path: "/info/pricing",
    name: "pricing-plans",
    component: pricingPlans,
    alias: ["/pricing-plans", "/solutions", "/pricing"],
  },
  {
    path: "/support",
    name: "support",
    component: support,
    alias: ["/help", "/faq"],
  },
  {
    path: "/privacy",
    name: "privacy-policy",
    component: privacyPolicy,
    alias: ["/privacy-policy", "/security"],
  },
  {
    path: "/terms",
    name: "terms-and-conditions",
    component: termsAndConditions,
    alias: ["/terms-and-conditions", "/usage-policy"],
  },

  // User Routes
  {
    path: "/user/sign-in",
    name: "sign-in",
    alias: ["/login", "/log-in", "/signin"],
    component: signIntoAccount,
  },
  {
    path: "/user/dashboard",
    name: "dashboard",
    component: dashboard,
    meta: { requiresAuth: true },
    alias: "/dashboard",
  },
  {
    path: "/user/account",
    name: "user-account",
    component: myAccount,
    meta: { requiresAuth: true },
    alias: ["/account"],
  },

  // API Routes:
  {
    path: "/api/sign-in/discord-redirect",
    name: "sign-in-redirect",
    component: signInRedirect,
  },
  {
    path: "/api/guild-setup",
    name: "guild-setup",
    component: guildSetup,
  },
  {
    path: "/invite",
    name: "invite",
    beforeEnter() {
      useNavStore().externalPaths().inviteBotUsingDiscord();
    },
    component: homepage,
	alias: ["/get", "/add", "/invite-bot", "/add-bot"],
  },

  // 404 Not Found:
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: notFound,
  },
];


// Create Router:
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If user used browser back/forward buttons
    if (savedPosition) {
      return savedPosition;
    }
    // Always scroll to top for new navigation
    return { top: 0 };
  },
});


// Before Each Route - Navigation Guards:
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // 'Account Restricted' navigation guard:
  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    // Not authenticated, redirect to Sign-In
    console.info("[Router-Guard] Not authed, redirecting to sign in...");
    return next({
      path: "/user/sign-in",
      query: { message: `Please sign in to access ${to.name}` },
    });
  }

  // Prevent access to Sign-In page if already signed in:
  if (to.path === "/user/sign-in" && auth.isAuthenticated) {
    next({ path: "/user/dashboard" });
  }

  // Re-enable Header if/was hidden:
  const nav = useNavStore();
  nav.headerVisible = true;
  next();
});

export default router;
