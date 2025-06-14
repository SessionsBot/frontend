import { defineStore } from "pinia";
import { signInWithCustomToken, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";

import { DateTime } from "luxon";

export const useAuthStore = defineStore('auth', {
   
    // States:
    state: () => ({
        // Is Authenticated - Boolean:
        isAuthenticated: !!localStorage.getItem('authToken'),
        // Auth Token - String or Null:
        authToken: localStorage.getItem('authToken') || null,
    }),

    // Getters:
    getters: {
       // ...
    },

    // Actions:
    actions: {
        // Check/Initialize Auth on Page Load:
        async initializeAuth(debug = true) {
            if(debug) console.group('Authentication Initialization')

            // Validate custom JWT
            if (this.authToken) {
                try {
                    // Check Token Expiration:
                    const payload = JSON.parse(atob(this.authToken.split('.')[1]));
                    if (!payload.exp || DateTime.fromSeconds(payload.exp).diffNow().valueOf() <= 0) {
                        if(debug) console.log('Token EXPIRED! - Signed Out!')
                        this.signOut();
                        return;
                    }
                    // Confirm Login:
                    if(debug) console.log('Token VALID! - Signed In')
                    this.isAuthenticated = true;
                } catch {
                    this.signOut();
                    return;
                }
            } else {
                if(debug) console.log('Token NOT FOUND?! - Signed Out!')
                return;
            }

            // Validate Firebase Auth
            onAuthStateChanged(firebaseAuth, async (user) => {
                
                if(debug) console.group(`--- FIREBASE AUTH CHANGE ---`)
                if(debug) console.log('Logged In:', !!user)
                if(!user){
                    console.warn('Firebase - Logged out user from auth state change...');
                    this.signOut()
                }
                console.groupEnd()
            });

            console.groupEnd()
        },

        // Login to Account using Token:
        async signInWithToken(authToken) { try {
            // Get JSON Data from Token:
            const base64Payload = authToken.split('.')[1];
            const userData = JSON.parse(atob(base64Payload));
            const firebaseToken = userData?.firebaseToken
            console.log('userData', userData);
            if(!base64Payload || !userData || !firebaseToken) return console.log(`{!} Cannot Login - Missing Firebase Token`)

            // Signin/Update - Pina:
            this.authToken = authToken;
            this.isAuthenticated = true;

            // Set Local Browser Data:
            localStorage.setItem('authToken', authToken);

            // Login - Firebase:
            await signInWithCustomToken(firebaseAuth, firebaseToken).catch((e) => {
                // Error Logging in to Firebase:
                this.signOut()
                console.log(`'[Firebase]: Failed to login using custom token! \n Error:  ${e}`)
            })
        } catch (e) {
            this.signOut()
            console.log(`'[Firebase]: Failed to login using custom token! \n Error:  ${e}`)
        }},

        // Logut of Account:
        async signOut() {
            // Signout/Reset - Pina:
            this.authToken = null;
            this.isAuthenticated = false;

            // Reset Local Browser Data:
            localStorage.removeItem('authToken');

            // Signout - Firebase:
            await firebaseSignOut(firebaseAuth).catch((e) => { 
                console.log(`Failed to signout of Firebase Auth: \n Code:`, e?.code, + '\n' + `Message:`, e?.message)
            });
        },

        // User Data - Returns Object:
        async getUserData() {
            try {
                if (!this.authToken) return 'Missing authentication token!';

                // JSON Web Token:
                const base64Payload = this.authToken.split('.')[1];
                const pinaAuthData = JSON.parse(atob(base64Payload));

                // Firebase User Token:
                const user = firebaseAuth.currentUser
                const tokenResult = await user.getIdTokenResult()
                const firebaseAuthData = user ? {uid: user?.uid, ...tokenResult} : null;

                // Return Result:
                const userData = {Pina: pinaAuthData, Firebase: firebaseAuthData}
                console.log('All User Data:', userData)
                return userData

            } catch {
                return null;
            }
        },
    }
});