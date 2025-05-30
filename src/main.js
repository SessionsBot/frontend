import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './pages/router/router.js'
import './styles/style.css' // or your Tailwind import

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.mount('#app')
