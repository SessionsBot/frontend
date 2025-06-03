<script setup>

import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

onMounted(() => {
    // Get query:
    const query = useRoute().query
    const guildId = query.guildId

    console.log('Query', query)
    console.log('Guild ID', guildId)
})

</script>

<template> 

    <main class="text-white text-center flex p-3 gap-2 flex-1 flex-col flex-wrap justify-center items-center content-center">
        
        <section class="text-white bg-black/50 p-8 max-w-[90%] gap-3.5 text-center ring-2 ring-neutral-500/30 rounded-sm shadow-md shadow-black/50 flex flex-col flex-wrap justify-center items-center content-center">

            <!-- Heading: -->
            <h1 class="text-4xl font-extrabold">Welcome to Sessions Bot!</h1>

            <!-- Guild Connection Info: -->
            <div class="text-white text-shadow-md text-shadow-black/50 flex gap-1.5 flex-row flex-wrap justify-center items-center content-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
                <p> You're tying to configure:</p>
                <div class="bg-neutral-600/80 ring-2 ring-neutral-500/80 rounded-sm flex py-0.5 px-1.5 gap-1 flex-row flex-wrap justify-center items-center content-center">
                    <img class="h-5 w-5 rounded-full ring-2 ring-neutral-500" src="https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg" draggable="false">
                    Guild Name
                </div>
            </div>

            <!-- Sessions Bot Logo & Guild Logo Image: -->

            <div class="flex p-3 gap-2.5 rounded-md flex-row justify-center items-center contain-content">

                <img class="max-w-18 rounded-full ring-2 ring-neutral-500 shadow-md shadow-black/50" src="../assets/sessionsBotWithText.png" draggable="false">

                <svg class="opacity-50 drop-shadow-md drop-shadow-black/70" xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#FFFFFF"><path d="M288-288q-79.68 0-135.84-56.23Q96-400.45 96-480.23 96-560 152.16-616q56.16-56 135.84-56h108q15.3 0 25.65 10.29Q432-651.42 432-636.21t-10.35 25.71Q411.3-600 396-600H288q-50 0-85 35t-35 85q0 50 35 85t85 35h108q15.3 0 25.65 10.29Q432-339.42 432-324.21t-10.35 25.71Q411.3-288 396-288H288Zm84.28-156q-15.28 0-25.78-10.29-10.5-10.29-10.5-25.5t10.34-25.71q10.34-10.5 25.62-10.5h215.76q15.28 0 25.78 10.29 10.5 10.29 10.5 25.5t-10.34 25.71Q603.32-444 588.04-444H372.28ZM564-288q-15.3 0-25.65-10.29Q528-308.58 528-323.79t10.35-25.71Q548.7-360 564-360h108q50 0 85-35t35-85q0-50-35-85t-85-35H564q-15.3 0-25.65-10.29Q528-620.58 528-635.79t10.35-25.71Q548.7-672 564-672h108q79.68 0 135.84 56.23 56.16 56.22 56.16 136Q864-400 807.84-344 751.68-288 672-288H564Z"/></svg>

                <img class="max-w-18 rounded-full ring-2 ring-neutral-500 shadow-md shadow-black/50" src="https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg" draggable="false">

            </div>
            

            <!-- Buttons Wrap -->
            <div class="flex p-2 gap-5.5 flex-wrap flex-row justify-center items-center contain-content">
                <button class="default_button">
                    Homepage
                </button>

                <button class="default_button">
                    Begin Setup
                </button>
            </div>

            <!-- Permissions Required Info: -->
            <div class="bg-neutral-600/80 ring-2 ring-neutral-500/80 rounded-sm p-1 text-white text-shadow-md text-shadow-black/50 flex gap-1 flex-row flex-wrap justify-center items-center content-center">
                <svg class="opacity-55" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M263.72-96Q234-96 213-117.15T192-168v-384q0-29.7 21.15-50.85Q234.3-624 264-624h24v-96q0-79.68 56.23-135.84 56.22-56.16 136-56.16Q560-912 616-855.84q56 56.16 56 135.84v96h24q29.7 0 50.85 21.15Q768-581.7 768-552v384q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm216.49-192Q510-288 531-309.21t21-51Q552-390 530.79-411t-51-21Q450-432 429-410.79t-21 51Q408-330 429.21-309t51 21ZM360-624h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Z"/></svg>
                <p class="text-xs text-white/80"> You're need 'Administrator' permissions to do this!</p>
            </div>

        </section>

    </main>

</template>


<style scoped>

</style>