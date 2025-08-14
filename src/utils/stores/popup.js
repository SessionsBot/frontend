// Imports:
import { defineStore } from "pinia";


// Alert Store:
export const usePopupSystem = defineStore('popup', {
    
    // States:
    state: () => ({
        // Popup Visibility & Type:
        popupVisible: false,
        alertType: 'Default',

        // Popup Options:
        showCloseButton: true,

        // Popup Details:
        popupTitle: '⚠️ Attention:',
        popupDescription: 'No details provided...',

        // Popup Action Buttons:
        buttonActions: [] 
        
        
    }),


    // Actions:
    actions: {

        closePopup() {
            this.popupVisible = false
        },

        showPopup( 
            title = '⚠️ Attention:', 
            description = 'No details provided...', 
            showCloseButton = true, 
            actions = [ {label: 'Dismiss', fn: () => {this.popupVisible = false}} ] 
        ) {
            this.popupTitle = title
            this.popupDescription = description
            this.buttonActions = actions

            this.showCloseButton = showCloseButton

            this.alertType = 'Default'
            this.popupVisible = true
        },

        showSignInPopup(
            title = '⚠️ Sign In:', 
            description = 'To continue/access this page you must be signed into an account!',  
        ){
            this.showCloseButton = false

            this.popupTitle = title
            this.popupDescription = description

            this.alertType = 'SignIn'
            this.popupVisible = true
        }

    }

})