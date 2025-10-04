// Imports:
import { defineStore } from "pinia";

// Variables:
// ...

// Nav Store - Export:
export const useNavStore = defineStore('nav', {

    state: () => ({
        navVisible: false,

        headerVisible: true,

        footerVisible: true
    }),

    actions: {

        /** Opens Navigation Menu */
        openNav() {
            this.navVisible = true;
        },

        /** Closes Navigation Menu */
        closeNav() {
            this.navVisible = false;
        },

        /** Route to saved external paths */
        externalPaths(){return{
           
            /** Invite Sessions Bot Discord Bot - New Tab */
            inviteBotUsingDiscord: () => {
                window.open('https://discord.com/oauth2/authorize?client_id=1137768181604302848', '_blank')
            },

            /** Open new email to `support@sessionsbot.fyi` - New Email Window */
            emailSupport: () => {
                window.open('mailto:support@sessionsbot.fyi')
            },

            /** Open new email to `support@sessionsbot.fyi` - New Email Window */
            joinSupportServer: () => {
                window.open('https://discord.gg/dKp5HZPjCg', '_blank')
            }

        }}
    }

});