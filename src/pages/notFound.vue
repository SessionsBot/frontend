<script setup>
    // Imports:
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    import { InfoIcon, TriangleAlertIcon } from 'lucide-vue-next';

    const router = useRouter()
    const route = useRoute()

    // Variables:
    const redirectTime = 10; // Seconds till each redirect
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

    
    
    <main class="relative gap-2 p-3 flex-1 flex-col flex flex-wrap justify-center items-center content-center text-center">

        <div class="bg-zinc-900 rounded-md ring-ring ring-1 flex flex-col flex-wrap justify-center items-center content-center gap-4 px-7 py-10">

            <h1 class="font-bold text-4xl py-2 px-2.5 rounded-md bg-zinc-800 ring-1 ring-ring"> 
                PAGE NOT FOUND!
            </h1>
            
            <p class="text-white/30 relative top-3.25 text-2xl font-extrabold"> 404 </p>

            <TriangleAlertIcon class="text-amber-300/70 fill-amber-200/10" size="225" stroke-width="1.5" />

            

            <div class="ring-1 ring-ring text-left max-w-122 w-[90%] bg-zinc-900 px-1.5 py-2 rounded-md">
                <InfoIcon class="inline m-0.5 opacity-85" />
                <p class="inline opacity-85"> This resource may have been removed or moved to a new location. If you think this is an issue please get in contact with our support team! </p>
            </div>

            <div class="gap-1.75 mt-2 flex flex-wrap flex-col justify-center items-center content-center">
                    <p class="text-[12px] px-5 font-normal"> You will be automatically redirected to the Hompage in {{timeLeft}} seconds... </p>
                    <p class="text-[11px] px-5 font-light"> If you're not automatically redirected you can <a @click="redirectHome" title="Go Home" class="cursor-pointer text-blue-400/70 hover:underline">click here</a>.</p>
            </div>

        </div>

    </main>

</template>


<style scoped>

</style>