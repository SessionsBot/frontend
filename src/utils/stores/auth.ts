// Imports:
import { defineStore } from "pinia";
import { signInWithCustomToken, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { DateTime } from "luxon";
import { DecodedUserData } from "@sessionsbot/api-types";

// Types:
interface AuthStates {
    /**  Is Authenticated - `Boolean` */
    isAuthenticated: boolean;
    /** Current user's authToken - `String` or `null` */
    authToken: string | null;
    /** Authenticated User Data - Static - Update by fn `updateUserData()`*/
    userData: DecodedUserData | null
}

// Debugging:
const debugAuth = false;


// Exports:
export const useAuthStore = defineStore('auth', {
   
    // States:
    state: (): AuthStates => ({
        // Is Authenticated - Boolean
        isAuthenticated: false,
        // User Auth Token - JWT String
        authToken: localStorage.getItem('authToken') || null,
        // Authed User's Data - Decoded Data Object
        userData: null,
    }),

    // Actions:
    actions: {
        
        /** Check/Initialize Auth on Page Load
         * - This function should be called on each app mount from `main.js`
         * - Should also finish execution before app mounts!
         *     - This ensures all user data is fetched before app is visible.
         */
        async initializeAuth() {
            if(debugAuth) console.group('Authentication Initialization')

            // Validate custom JWT
            if (this.authToken) {
                try {
                    // Check Token Expiration:
                    const payload = JSON.parse(atob(this.authToken.split('.')[1]));
                    if (!payload.exp || DateTime.fromSeconds(payload.exp).diffNow().valueOf() <= 0) {
                        // If token expired:
                        console.log('Authorization Token EXPIRED! - Signed Out!')
                        this.signOut();
                        return;
                    }
                    // Confirm Login:
                    if(debugAuth) console.log('Token VALID!')
                    
                } catch(e) {
                    console.warn('Failed to initialize authentication', e)
                    this.signOut();
                    return;
                }
            } else {
                if(debugAuth) console.log('No auth token found - Signed Out!')
                return;
            }

            // Firebase Auth State Changes:
            onAuthStateChanged(firebaseAuth, async (user) => {
                
                if(debugAuth) console.group(`--- FIREBASE AUTH CHANGE ---`)
                
                if(!user){
                    // No firebase user - signed out:
                    console.warn('Firebase - Logged out user from auth state change...');
                    this.signOut()
                    if(debugAuth) console.log('Logged out!')
                }else {
                    // Firebase user - previously signed in:
                    // Update Data:
                    this.updateUserData()
                    this.isAuthenticated = true;
                    if(debugAuth) console.log('Logged in!')
                }
                console.groupEnd()
            });

            console.groupEnd()
        },

        /** Sign in/authenticate a user through Discord OAuth, accepts an optional `stickyRoute` to redirect back to a specified path after sign in.
         * 
         * @param { String } stickyRoute Router path to redirect to after a successful sign in *(optional)*
         */
        async authWithDiscord(stickyRoute){
            if(stickyRoute){ localStorage.setItem('stickySignIn', stickyRoute) }
            location.href = 'https://discord.com/oauth2/authorize?client_id=1137768181604302848&response_type=code&redirect_uri=https%3A%2F%2Fbrilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app%2Fapi%2Fv2%2Fusers%2Fauth%2Fdiscord&scope=identify+guilds';
        },

        /** Sign in to account using `authToken`
         *  - (manual sign ins only - not previous/saved sessions): 
         * 
         * @param {string} authToken JSON Web Token used for authentication
         * @param {string} firebaseToken Custom firebase token for signing into Firebase
         */ 
        async signInWithToken(authToken, firebaseToken) { try {
            // Get JSON Data from Token:
            const base64Payload = authToken.split('.')[1];
            const userData = JSON.parse(atob(base64Payload));
            if(!base64Payload || !userData) throw {message: `{!} Cannot Sign In! - Missing Auth Token/Data`};
            if(!firebaseToken) throw {message: `{!} Cannot Sign In! - Missing Firebase Token`};

            // debugAuth:
            if(debugAuth) console.log(`[Auth]: User Signing In...`);

            // Set Local Browser Data:
            localStorage.setItem('authToken', authToken);

            // Login - Firebase:
            await signInWithCustomToken(firebaseAuth, firebaseToken).catch((e) => {
                // Error Logging in to Firebase:
                this.signOut()
                console.log(`'[Firebase]: Failed to sign in using custom token! \n Error:  ${e}`)
            })

            // Signin/Update - Pinia:
            this.authToken = authToken;
            this.isAuthenticated = true;
            this.updateUserData()

            // Debug:
            if(debugAuth) console.log(`[Auth]: User Signed In!`);
            return {success: true}
        } catch (e) {
            // Error - Sign In Failed:
            this.signOut()
            console.log(`'[Firebase]: Failed to sign in using custom token! \n Error:  ${e}`);
            return {success: false}
        }},

        /** Logout of Account: */
        async signOut() { try {
            // debugAuth:
            if(debugAuth) console.log(`[Auth]: User Signing Out...`);

            // Signout/Reset - Pinia:
            this.authToken = null;
            this.userData = null;
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
            // Error Occurred:
            console.warn(`'[Firebase]: Failed to sign out of account! \n Error:  ${e}`)
        }},

        /** Update User Data - Updates State: */
        async updateUserData() { try {
            if (!this.authToken) throw new Error('Missing authentication token! - Cannot fetch user data...');

            // JSON Web Token:
            const base64Payload = this.authToken.split('.')[1];
            const piniaAuthData = JSON.parse(atob(base64Payload));

            // Firebase User Token:
            const user = firebaseAuth.currentUser
            if(!user) throw new Error('No firebase user for data update!');
            const tokenResult = await user.getIdTokenResult()
            const firebaseAuthData = user ? {uid: user?.uid, ...tokenResult} : null;

            
            // Return Result:
            const result = {Pinia: piniaAuthData, Firebase: firebaseAuthData};
            this.userData = result;
            if(debugAuth) console.log('User data updated:', this.userData);

        } catch(e) {
            console.info('Failed to update user data!', e)
            return null;
        }},

    }

});