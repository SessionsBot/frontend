<script setup>
    // Imports:
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router'

    // UI:
    import BlackHoleBackground from '@/components/ui/bg-black-hole/BlackHoleBackground.vue';
    const router = useRouter()
    const route = useRoute()

    // Variables:
    const redirectTime = 5000; // Seconds till each redirect
    const timeLeft = ref(redirectTime); // Time until this redirect

    // Redirect Home Fn:
    const redirectHome = () => {
        // Redirect to Homepage:
        timeLeft.value = 0
        router.push('/')
        // Reset Redirect Countdown:
        setTimeout(() => { timeLeft.value = redirectTime }, 1_000)
    }

    // On page load Fn:
    onMounted(() => {
        const countdown = setInterval(() => {
            // Remove 1s from Countdown:
            timeLeft.value -= 1;

            // Time Up - Confirm still on 404 Page:
            if(timeLeft.value <= 0 && route.name === 'not-found'){
                // Redirect & Reset:
                redirectHome()
            }
            
        }, 1_000);
    })

</script>

<template>

    
    
    <main class="relative text-white text-shadow-md text-shadow-black/30 gap-2 p-3 text-center flex-1 flex-col flex flex-wrap justify-center items-center content-center">
        
        <BlackHoleBackground 
            class="
                absolute flex justify-center items-center content-center flex-1
            "
        > 

        </BlackHoleBackground> 

        <div class="absolute z-10 gap-4 py-8 bg-modern-yellow-default w-[90%] sm:w-120 shadow-sm rounded-lg shadow-black/80 flex flex-wrap flex-col justify-center items-center content-center">
            <h1 class="text-4xl bg-red-800/80 px-4 py-2 rounded-lg font-black shadow-sm shadow-black/50"> ⚠️ Uh Oh! </h1>
            <p class="text-xl px-5 py-2 bg-black/50 w-full font-bold"> We can't find the page you're looking for!</p>
            <div class="gap-0.5 text-black/70 mt-2 flex flex-wrap flex-col justify-center items-center content-center">
                <p class="text-[11px] px-5 font-light"> You will be automatically redirected to the Hompage in {{timeLeft}} seconds... </p>
                <p class="text-[11px] px-5 font-light"> If you're not automatically redirected you can <a @click="redirectHome" title="Go Home" class="cursor-pointer hover:underline text-blue-700">click here</a>.</p>
            </div>
            
        </div>

    </main>

</template>


<style scoped>

</style>