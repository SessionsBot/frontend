<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import siteHeader from '../blocks/SiteHeader.vue'

const route = useRoute()
const router = useRouter()

const homepage = () => {
    router.push('/');
}

// On Page Load:
onMounted(() => {
    const token = route.query.token
    const redirect = true;
    const redirectTokenText = document.getElementById('redirectTokenText');

    if (token) {
        // Logged in:
        redirectTokenText.innerText = `token: ${token}`
        localStorage.setItem('discord_token', token)
        // Redirect after delay:
        // setTimeout(() => {
            if (redirect) { router.push('/dashboard') }
        // }, 3000)
    } else {
        // NOT Logged in:
        redirectTokenText.innerText = `token: ?`
        // Redirect after delay:
        // setTimeout(() => {
            if (redirect) { router.push('/') }
        // }, 3000)
    }

})

</script>

<template> 
<siteHeader> </siteHeader>
<div class="text-white flex flex-col w-full h-full flex-1 items-center justify-center mb-10">

    <!-- Graidient Wrap -->
    <div class="w-[85%] sm:w-[75%] md:w-150 h-auto relative rounded-md p-[2px] bg-gradient-to-r from-purple-700 to-blue-700 animate-gradient-x">
        
        <!-- Content -->
        <div class="rounded-md bg-black/75 text-white p-4 text-center flex flex-col gap-3 justify-center items-center">

            <p class="opacity-75 font-black text-xl py-1"> 
                ⏳ PLEASE WAIT 
            </p>

            <div class="w-[95%] h-[2px] rounded-md animate-gradient-x bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
                <!-- Spacer -->
            </div>

            <p class="text-xs px-3 text-left sm:text-[13px] opacity-75 italic"> 
                We're loading your user account . . .
            </p>
            
            <div class="w-[95%] h-[2px] rounded-md animate-gradient-x bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
                <!-- Spacer -->
            </div>

            <p class="text-xs px-3 sm:text-[12px] opacity-55"> 
                If you're not redirected within 15 seconds please start the sign in process over and try again.
            </p>

            <div class="w-[95%] h-[2px] rounded-md bg-gradient-to-r from-white/15 via-white/25 to-white/15">
                <!-- Spacer -->
            </div>
            
            <footer class="px-2.5 opacity-35 relative flex gap-1 flex-wrap justify-between items-center w-full h-fit flex-col">
            
                <p id="redirectTokenText" class="h-fit text-left text-[10px] italic"> 
                    [ ! ] 
                </p>

                <span id="loadingSpinIcon" class="material-symbols-rounded !h-fit !w-fit !text-[20px]">
                    donut_large
                </span>

                <a @click="homepage" title="Back to Login" class="text-xs text-[10px] hover:text-blue-300 hover:underline cursor-pointer"> 
                    Back to Login 
                </a>

                
            </footer>

        </div>

    </div>

</div> </template>


<style lang="css" scoped>

@keyframes gradient-x {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
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
    background-size: 200% 100%;
    animation: gradient-x 3s ease infinite;
}

.pleaseWaitCard{
    background: black;
}

</style>