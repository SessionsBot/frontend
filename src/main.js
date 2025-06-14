// ---------------------------------[ Imports/Variables ]--------------------------------- \\
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './pages/router/router.js'
import './styles/style.css' // or your Tailwind import
import { useAuthStore } from "./utils/stores/auth.js";

const app = createApp(App)

// ---------------------------------[ Functions ]--------------------------------- \\

// Log route/page changes to Google Analytics:
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title,
    });
  }
});

// ---------------------------------[ Initialize App ]--------------------------------- \\
app.use(router)
app.use(createPinia())

useAuthStore().initializeAuth()
app.mount('#app')