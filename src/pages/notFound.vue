<script setup>
    // Imports
    import siteHeader from '../components/siteHeader.vue';
    import siteFooter from '../components/siteFooter.vue';

    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    const router = useRouter()

    const homepage = () => router.push('/')

    // On page load:
    onMounted(() => {
        // Breif wait:
        setTimeout(() => {
            // Redirct home:
            // homepage()
        }, 10_000);
    })

</script>

<template>

    <main class=" text-white text-shadow-md text-shadow-black/50 gap-2 p-3 text-center flex-1 flex-col flex flex-wrap justify-center items-center content-center">
        
        <div class="gap-4 py-8 bg-red-800/45 w-[90%] sm:w-120 shadow-sm rounded-lg shadow-black/80 flex flex-wrap flex-col justify-center items-center content-center">
            <h1 class="text-4xl px-5 font-black"> ⚠️ Uh Oh! </h1>
            <p class="text-xl px-5 py-2 bg-black/50 w-full font-bold"> We can't find the page you're looking for!</p>
            <div class="gap-1 mt-2 flex text-white/65 flex-wrap flex-col justify-center items-center content-center">
                <p class="text-xs px-5 font-light"> You will be automatically redirected to the Hompage in 10 seconds. </p>
                <p class="text-xs px-5 font-light"> If you're not automatically redirected you can <a @click="homepage" title="Go Home" class="cursor-pointer hover:underline text-blue-500">click here</a>.</p>
            </div>
            
        </div>


    </main>

</template>


<style scoped>

</style>