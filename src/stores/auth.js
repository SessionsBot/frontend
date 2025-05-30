import { defineStore } from "pinia";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        userAuthId: localStorage.getItem('discordUserAuth') || null,
        userData: localStorage.getItem('discordUserData') 
            ? JSON.parse(localStorage.getItem('discordUserData')) 
            : null,
        isAuthenticated: !!localStorage.getItem('discordUserAuth'),
        webToken: localStorage.getItem('authWebToken') 
            ? JSON.parse(localStorage.getItem('authWebToken')) 
            : null,
    }),
    getters: {
        loggedIn: (state) => state.isAuthenticated, // returns true or false
    },
    actions: {
        loginWithAuthToken(webToken) {
            localStorage.setItem('authWebToken', webToken) 
            this.webToken = webToken
        },
        loginWithUserData(userData) {
            this.userAuthId = userData?.id
            this.userData = userData
            this.isAuthenticated = true
            localStorage.setItem('discordUserAuth', userData?.id)
            localStorage.setItem('discordUserData', JSON.stringify(userData))
        },
        logout() {
            this.userAuthId = null
            this.userData = null
            this.isAuthenticated = false
            localStorage.removeItem('discordUserAuth')
            localStorage.removeItem('discordUserData')
        },
        signInUsingDiscord() {
            const discordLoginLink =
                'https://discord.com/oauth2/authorize?client_id=1137768181604302848&response_type=code&redirect_uri=https%3A%2F%2Fbrilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app%2Fdashboard%2Flogin%2Fdiscord-redirect&scope=identify+guilds'
            window.open(discordLoginLink, '_self')
        },

    },
})