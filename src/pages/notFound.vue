<script setup>
    // Imports
    import siteHeader from '../components/siteHeader.vue';
    import siteFooter from '../components/siteFooter.vue';

    import { onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    const router = useRouter()

    // On page load:
    onMounted(() => {
        // Breif wait:
        setTimeout(() => {
            // Redirct home:
            router.push('/')
        }, 10_000);
    })
    
</script>

<template>

    <main class=" text-white text-shadow-md text-shadow-black/50 gap-2 p-3 text-center flex-1 flex-col flex flex-wrap justify-center items-center content-center">
        
        <div class="gap-4 py-8 px-5 bg-red-800/50 w-[90%] sm:w-120 shadow-sm rounded-lg shadow-black/80 flex flex-wrap flex-col justify-center items-center content-center">
            <h1 class="text-4xl font-black"> ⚠️ Uh Oh! </h1>
            <p class="text-xl font-bold"> We can't find the page you're looking for!</p>
            <p class="text-xs font-light"> You will be automatically redirected to the hompage in 10 seconds, if you're not automatically redirected you can <a title="Go Home" class="hover:underline text-blue-400" href="/">click here</a>.</p>
        </div>


    </main>

</template>


<style scoped>

</style>