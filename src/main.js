import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './pages/router/router.js'
import './styles/style.css' // or your Tailwind import

const app = createApp(App)

// Log route changes to Google Analytics:
router.afterEach((to) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title,
    });
  }
});

app.use(router)
app.use(createPinia())
app.mount('#app')
