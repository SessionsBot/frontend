// Imports:
import { defineStore } from "pinia";

// Variables:
// ...

// Nav Store - Export:
export const useNavStore = defineStore('nav', {

    state: () => ({
        navVisible: false,
        headerVisible: true
    }),

    actions: {

        openNav() {
            this.navVisible = true;
        },

        closeNav() {
            this.navVisible = false;
        },

        externalPaths(){return{
            inviteBotUsingDiscord: () => {
                window.open('https://discord.com/oauth2/authorize?client_id=1137768181604302848', '_blank')
            },
        }}
    }

});