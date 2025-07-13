// Imports:
import { defineStore } from "pinia";
import { signInWithCustomToken, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { DateTime } from "luxon";

const debugAuth = false;

// Exports:
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
        async initializeAuth() {
            if(debugAuth) console.group('Authentication Initialization')

            // Validate custom JWT
            if (this.authToken) {
                try {
                    // Check Token Expiration:
                    const payload = JSON.parse(atob(this.authToken.split('.')[1]));
                    if (!payload.exp || DateTime.fromSeconds(payload.exp).diffNow().valueOf() <= 0) {
                        if(debugAuth) console.log('Token EXPIRED! - Signed Out!')
                        this.signOut();
                        return;
                    }
                    // Confirm Login:
                    if(debugAuth) console.log('Token VALID! - Signed In')
                    this.isAuthenticated = true;
                    
                } catch {
                    this.signOut();
                    return;
                }
            } else {
                if(debugAuth) console.log('Token NOT FOUND?! - Signed Out!')
                return;
            }

            // Validate Firebase Auth
            onAuthStateChanged(firebaseAuth, async (user) => {
                
                if(debugAuth) console.group(`--- FIREBASE AUTH CHANGE ---`)
                if(debugAuth) console.log('Logged In:', !!user)
                if(!user){
                    // No firebase user - signed out:
                    console.warn('Firebase - Logged out user from auth state change...');
                    this.signOut()
                }else {
                    // Firebase user - signed in:
                    // Log User Data:
                    if(debugAuth) console.log(await this.getUserData())
                }
                console.groupEnd()
            });

            console.groupEnd()
        },

        // Redirect to Discord for Sign in:
        async authWithDiscord(stickyRoute){
            if(stickyRoute){ localStorage.setItem('stickySignIn', stickyRoute) }
            location.href = 'https://discord.com/oauth2/authorize?client_id=1137768181604302848&response_type=code&redirect_uri=https%3A%2F%2Fbrilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app%2Fapi%2Flogin%2Fdiscord-redirect&scope=identify+guilds'
        },

        // Login to Account using Token:
        async signInWithToken(authToken) { try {
            // Get JSON Data from Token:
            const base64Payload = authToken.split('.')[1];
            const userData = JSON.parse(atob(base64Payload));
            const firebaseToken = userData?.firebaseToken
            if(!base64Payload || !userData || !firebaseToken) return console.log(`{!} Cannot Sign In! - Missing Firebase Token`)

            // debugAuth:
            if(debugAuth) console.log(`[Auth]: User Signing In...`);

            // Signin/Update - Pina:
            this.authToken = authToken;
            this.isAuthenticated = true;

            // Set Local Browser Data:
            localStorage.setItem('authToken', authToken);

            // Login - Firebase:
            await signInWithCustomToken(firebaseAuth, firebaseToken).catch((e) => {
                // Error Logging in to Firebase:
                this.signOut()
                console.log(`'[Firebase]: Failed to sign in using custom token! \n Error:  ${e}`)
            })

            if(debugAuth) console.log(`[Auth]: User Signed In!`);
        } catch (e) {
            this.signOut()
            console.log(`'[Firebase]: Failed to sign in using custom token! \n Error:  ${e}`)
        }},

        // Logut of Account:
        async signOut() { try {
            // debugAuth:
            if(debugAuth) console.log(`[Auth]: User Signing Out...`);

            // Signout/Reset - Pina:
            this.authToken = null;
            this.isAuthenticated = false;

            // Reset Local Browser Data:
            localStorage.removeItem('authToken');

            // Signout - Firebase:
            await firebaseSignOut(firebaseAuth).catch((e) => { 
                console.log(`Failed to signout of Firebase Auth: \n Code:`, e?.code, + '\n' + `Message:`, e?.message)
            });

            // debugAuth:
            if(debugAuth) console.log(`[Auth]: User Signed Out!`);
        } catch(e) {
            // Error Occured:
            console.warn(`'[Firebase]: Failed to sign out of account! \n Error:  ${e}`)
        }},

        // User Data - Returns Object:
        async getUserData() { try {
            if (!this.authToken) throw 'Missing authentication token!';

            // JSON Web Token:
            const base64Payload = this.authToken.split('.')[1];
            const piniaAuthData = JSON.parse(atob(base64Payload));

            // Firebase User Token:
            const user = firebaseAuth.currentUser
            if(!user) throw 'No firebase user!'
            const tokenResult = await user.getIdTokenResult()
            const firebaseAuthData = user ? {uid: user?.uid, ...tokenResult} : null;

            
            // Return Result:
            const userData = {Pinia: piniaAuthData, Firebase: firebaseAuthData}
            return userData

        } catch(e) {
            console.warn('Failed to fetch user data!', e)
            return null;
        }},
    }
});