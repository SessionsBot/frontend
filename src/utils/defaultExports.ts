// Imports:
import { useToast } from 'vue-toastification';
import { useNavStore } from './stores/nav';
import { useAuthStore } from './stores/auth';
import { usePopupSystem } from './stores/popup';

// Toast Notifications
const toast = useToast()
export const toaster = toast

// App NAV Store
const nav = () => useNavStore()
export {nav}

// App NAV Store
const auth = () => useAuthStore()
export {auth}