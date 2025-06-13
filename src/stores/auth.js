import { defineStore } from "pinia";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: !!localStorage.getItem('authWebToken'),

        authToken: localStorage.getItem('authWebToken') 
            ? localStorage.getItem('authWebToken') 
            : null,
    }),

    getters: {
        loggedIn: (state) => state.isAuthenticated, // returns true or false
    },

    actions: {
        signInUsingDiscord() {
            const discordLoginLink =
                'https://discord.com/oauth2/authorize?client_id=1137768181604302848&response_type=code&redirect_uri=https%3A%2F%2Fbrilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app%2Fapi%2Flogin%2Fdiscord-redirect&scope=identify+guilds'
            location.href = discordLoginLink
        },

        loginWithAuthToken(authToken) {
            localStorage.setItem('authWebToken', authToken) 
            this.isAuthenticated = true
            this.authToken = authToken
        },

        getUserData(){
            try {
                const base64Payload = this.authToken.split('.')[1];
                const decodedPayload = JSON.parse(atob(base64Payload));
                return decodedPayload;
            } catch (e) {
                console.error('User Auth Token failed:', e);
                return 'Error reading user auth token, check console!'
            }
        },

        logout() {
            this.authToken = null
            this.isAuthenticated = false
            localStorage.removeItem('authWebToken')
        },
    },
})