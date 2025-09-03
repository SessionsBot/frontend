// ---------------------------------[ Imports/Variables ]--------------------------------- \\

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./utils/router.js";

import "./styles/style.css"; // MAIN css
import "vue-toastification/dist/index.css"; // vue-toastification css

import { useAuthStore } from "./utils/stores/auth.ts";
import { auth } from "./utils/firebase.js";


import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Tooltip from "primevue/tooltip";
import { definePreset } from "@primeuix/themes";
import ConfirmationService from "primevue/confirmationservice";

import Toast, { POSITION } from "vue-toastification";
import { checkBackendStatus, getSystemStatuses } from "./utils/modules/backendApi.ts";
import { usePopupSystem } from "./utils/stores/popup.js";
import { defaultWindow } from "@vueuse/core";



const app = createApp(App);

// ---------------------------------[ Prime Vue - Theme Config ]--------------------------------- \\

// Aura.semantic.colorScheme.dark.formField.background = "var(--muted)";
const PrimeVue_CustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "{indigo.500}",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}",
    },
    colorScheme: {
      dark: {
        formField: { background: "var(--muted)" }
      },
    },
  },

  components: {
    button: {
      colorScheme: {
        dark: {
          root: {
            danger: {
              background: "#d12626",
              hoverBackground: "#e83f3f",
              activeBackground: "#eb5757",
              borderColor: "#940c0c",
              hoverBorderColor: "#940c0c",
              activeBorderColor: "#940c0c",
              color: "#ffffff",
              hoverColor: "#ffffff",
              activeColor: "#ffffff",
            },
          },
          outlined: {
            danger: {
              borderColor: "#db0909",
              color: "#ed2626",
              hoverBackground: "color-mix(in srgb, #db0909, transparent 92%)",
            },
          },
        },
      },
    },
  },
});

// Initialize Prime Vue:
app.use(PrimeVue, {
  theme: {
    // theme customization
    preset: PrimeVue_CustomTheme,
    options: {
      darkModeSelector: ".dark", // force dark mode via class
    },
  },
  ripple: true, // ripple effect on buttons
});
app.directive("tooltip", Tooltip);

// ---------------------------------[ Toast/Notifications ]--------------------------------- \\

app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  transition: "Vue-Toastification__slideBlurred",
  maxToasts: 4,
  closeOnClick: false,
  hideProgressBar: true,
  showCloseButtonOnHover: true,
  bodyClassName: "font-semibold",
});

// ---------------------------------[ After Route/Analytics ]--------------------------------- \\

// Log route/page changes to Google Analytics:
router.afterEach((to, from) => {
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: to.fullPath,
      page_title: to.name,
      from_path: from.name,
    });
  }
});

// ---------------------------------[ Initialize Auth/App/Plugins ]--------------------------------- \\

// Init Plugins:
app.use(createPinia());
app.use(ConfirmationService);


// wait for auth - promise:
function waitForAuthReady() {
  return new Promise((resolve) => {
    // Get auth:
    const authStore = useAuthStore();
    // Listen/wait for Firebase auth state change/ready
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      await authStore.initializeAuth();
      unsubscribe(); // Stop listening after first event
      resolve();
    });
  });
}

// after auth prepared - mount app:
waitForAuthReady().then(async () => {
  // Hide beforeMount Screen:
  document.getElementById("beforeMount").style.display = "none";
  // Mount App:
  app.use(router);
  app.mount("#app");

  // Run system status check:
  checkBackendStatus()

});
