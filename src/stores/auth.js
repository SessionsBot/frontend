import { defineStore } from "pinia";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('discord_token') || null,
        isAuthenticated: !!localStorage.getItem('discord_token'),
    }),
    getters: {
        loggedIn: (state) => state.isAuthenticated, // returns true or false
    },
    actions: {
        loginWithToken(token) {
            this.token = token
            this.isAuthenticated = true
            localStorage.setItem('discord_token', token)
            localStorage.setItem('USER_LOGGED_IN', true)
        },
        logout() {
            this.token = null
            this.isAuthenticated = false
            localStorage.removeItem('discord_token')
            localStorage.setItem('USER_LOGGED_IN', false)
        },
    },
})