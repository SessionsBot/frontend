<script setup>
// App Imports:
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../utils/stores/auth'
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const redirect = true; // <-- DEVELOPMENT ENVIRONMENTS

// Element Variables:
const statusMessage = ref('{ ! }')
const titleSubHeading = ref('Loading')

// On Page Load Event:
onMounted(() => {
    // JSON WEB TOKEN -- AUTH ATTEMPTS:
    const userAuthToken = route.query?.token;
    const signInFailed = route.query?.failed;
    const statusFooterText = document.getElementById('statusFooterText')

    

    if (userAuthToken) {
        // Token provided:
        statusMessage.value = 'Validating Token'
        // Login user:
        auth.signInWithToken(userAuthToken);
        // Redirect:
        const stickyReRoute = localStorage.getItem('stickySignIn')
        if(redirect) {
            if (stickyReRoute) {
                router.push(stickyReRoute)
                localStorage.removeItem('stickySignIn')
            }
            else {router.push('/user/dashboard')}
        }

    } else {
        // Token NOT provided:
        console.warn('{!} Missing required auth token for login redirect!')
        statusMessage.value = `Login Failed!`
        statusFooterText.classList.add('text-rose-500', 'font-black')
        // SignOut any user:
        auth.signOut()
        // Redirect:
        if(redirect) {router.push({
            path: '/user/sign-in',
            query: { discordAuthError: 'true' }
        })}
    }

})

// Redirect Fns:
const homepage = () => router.push('/')


</script>

<template> 
<div class="text-white flex flex-col w-full h-full flex-1 items-center justify-center mb-10">

    <!-- Graidient Wrap -->
    <div class="w-[85%] sm:w-[75%] md:w-150 h-auto relative rounded-md p-[2px] bg-gradient-to-r from-black to-orange-600/70 animate-gradient-x">
        
        <!-- Content -->
        <div class="rounded-md bg-black/75 text-white p-4 text-center flex flex-col gap-3 justify-center items-center">

            <p class="opacity-75 font-black text-xl py-1"> 
                ⏳ PLEASE WAIT | {{ titleSubHeading }}
            </p>

            <div class="w-[72%] h-[2px] rounded-md bg-gradient-to-r from-white/15 via-white/25 to-white/15">
                <!-- Spacer -->
            </div>

            <p class="text-xs px-3 font-mono text-left sm:text-[13px] opacity-75 italic"> 
                We're loading your user account . . .
            </p>
            
            <div class="w-[72%] h-[2px] rounded-md bg-gradient-to-r from-white/15 via-white/25 to-white/15">
                <!-- Spacer -->
            </div>

            <p class="text-xs px-3 sm:text-[11px] opacity-55"> 
                If you're not redirected within 15 seconds please start the sign in process over and try again.
            </p>

            <div class="w-[95%] h-[2px] rounded-md bg-gradient-to-r from-white/15 via-white/25 to-white/15">
                <!-- Spacer -->
            </div>
            
            <footer class="px-2.5 relative flex gap-1 flex-wrap justify-between items-center w-full h-fit flex-col">
            
                <p id="statusFooterText" class="opacity-65 h-fit bg-black py-0.5 px-1.5 rounded-sm text-left text-[10px] italic"> 
                    {{ statusMessage }}
                </p>

                <svg class="opacity-35" id="loadingSpinIcon" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.07 5.32C16.26 6 18 7.74 18.68 9.93c.19.63.76 1.07 1.41 1.07h.04c1 0 1.72-.96 1.43-1.91-.97-3.18-3.48-5.69-6.66-6.66-.94-.29-1.9.43-1.9 1.43v.04c0 .66.44 1.23 1.07 1.42zm4.61 8.75c-.68 2.2-2.42 3.93-4.61 4.61-.63.19-1.07.76-1.07 1.41v.04c0 1 .96 1.72 1.91 1.43 3.18-.97 5.69-3.48 6.66-6.66.29-.95-.43-1.91-1.42-1.91h-.05c-.66.01-1.23.45-1.42 1.08zM11 20.11c0-.67-.45-1.24-1.09-1.44C7.07 17.78 5 15.13 5 12s2.07-5.78 4.91-6.67c.64-.2 1.09-.77 1.09-1.44v-.01c0-1-.97-1.74-1.93-1.44C4.98 3.69 2 7.5 2 12c0 4.5 2.98 8.31 7.07 9.56.96.3 1.93-.44 1.93-1.45z"/></svg>

                <a @click="homepage" title="Back to Login" class="text-xs opacity-35 text-[10px] hover:text-blue-300 hover:underline cursor-pointer"> 
                    Back to Homepage 
                </a>

                
            </footer>

        </div>

    </div>

</div> </template>


<style lang="css" scoped>

@keyframes gradient-x {

    0%,
    100% {
        background-position: 0% 100%;
    }

    50% {
        background-position: 100% 200%;
    }
}

@keyframes loadingSpin {

    from {
       rotate: 0deg;
    }

    100% {
        rotate: 360deg;
    }
}

#loadingSpinIcon{
    animation: loadingSpin 2s infinite linear;
}

.animate-gradient-x {
    background-size: 350% 100%;
    animation: gradient-x 2.5s ease-in infinite;
}

.pleaseWaitCard{
    background: black;
}

</style>