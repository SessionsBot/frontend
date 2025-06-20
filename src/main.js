// ---------------------------------[ Imports/Variables ]--------------------------------- \\
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './utils/router.js'
import './styles/style.css' // or your Tailwind import

import { useAuthStore } from "./utils/stores/auth.js";
import { useNavStore } from './utils/stores/nav'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App)

// ---------------------------------[ Prime Vue - Theme Config ]--------------------------------- \\

Aura.semantic.colorScheme.dark.formField.background = 'var(--muted)'
Aura.components.button.colorScheme.dark.root.danger.background = 'var(--color-rose-700)'
Aura.components.button.colorScheme.dark.root.danger ={

  background: "var(--color-destructive)",
  hoverBackground: "{red.800}",
  activeBackground: "{red.600}",

  borderColor: "{rose.400}",
  hoverBorderColor: "{rose.400}",
  activeBorderColor: "{rose.400}",

  focusRing: {color: "{rose.500}", shadow: "none"},

  activeColor: "var(--black-50)",
  hoverColor: "{white}",
  color: "{white}",

}

const Custom = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    },
    colorScheme: {
      light: Aura.semantic.colorScheme.dark,
      dark: Aura.semantic.colorScheme.dark,
    }
  },
  
});

app.use(PrimeVue, {
  theme: {
    preset: Custom,
  }
});


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
// Init Plugins:
app.use(router)
app.use(createPinia())
app.use(ConfirmationService)

// Init/Load Auth:
useAuthStore().initializeAuth()

// Mount App:
app.mount('#app')