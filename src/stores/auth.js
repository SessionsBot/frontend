import { defineStore } from "pinia";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        userAuthId: localStorage.getItem('discordUserAuth') || null,
        isAuthenticated: !!localStorage.getItem('discordUserAuth'),
        userData: null,
    }),
    getters: {
        loggedIn: (state) => state.isAuthenticated, // returns true or false
    },
    actions: {
        loginWithUserData(userData) {
            this.userAuthId = userData?.id
            this.userData = userData
            this.isAuthenticated = true
            localStorage.setItem('discordUserAuth', userData?.id)
        },
        logout() {
            this.userAuthId = null
            this.userData = null
            this.isAuthenticated = false
            localStorage.removeItem('discordUserAuth')
        },
        signInUsingDiscord() {
            const discordLoginLink =
                'https://discord.com/oauth2/authorize?client_id=1137768181604302848&response_type=code&redirect_uri=https%3A%2F%2Fbrilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app%2Fdashboard%2Flogin%2Fdiscord-redirect&scope=identify+guilds'
            window.open(discordLoginLink, '_self')
        },

    },
})