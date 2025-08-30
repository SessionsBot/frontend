<script setup>
    import { defaultWindow } from '@vueuse/core';
    import discordIcon from '@/assets/svgs/discord-icon.vue'
    import { auth, nav } from '@/utils/defaultExports';

</script>


<template> 
<div class="flex justify-start items-center flex-col w-full h-full flex-1 ">
    
    <!-- Hero/Landing Section -->
    <section class="flex bg-black/30 w-full py-10 justify-evenly items-center content-center flex-wrap text-center">

        <!-- Text/Action -->
        <div class="flex m-5 flex-col gap-0.5 flex-wrap justify-center items-center content-center">

            <h1 class="text-5xl font-black text-shadow-md text-shadow-modern-purple-discord/70"> Sessions Bot </h1>

            <div class="mt-0.5 text-zinc-300/60 italic font-semibold p-1 px-2.5 rounded-sm flex flex-col gap-1.5 justify-center items-center self-center">
            
                <div class="my-3 ring-1 ring-ring bg-zinc-900 brightness-115 text-zinc-400 rounded-md px-2 py-0.5 flex flex-row gap-1.75 items-center">
                    <p> Made For Discord </p>
                    <discordIcon class="size-5" />
                </div>
                
                <p> A powerful Discord application for managing group events/sessions. </p>
                <p class="mt-1"> Streamlined, Automated, and Reliable </p>


            </div>

            <!-- Buttons: -->
            <div class="mt-8 flex flex-wrap gap-3.5 justify-center">

                <Button unstyled @click="nav().externalPaths().inviteBotUsingDiscord()"
                    class="bg-emerald-700 px-3.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:brightness-115 transition-all"
                > Invite the Bot </Button>

                <Button unstyled @click="$router.push('/dashboard')"
                    class="bg-zinc-700 px-3.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:brightness-115 transition-all"
                > Bot Dashboard </Button>

            </div>

            
            

        </div>

        <!-- Img Section -->
        <div class="flex m-5 flex-col gap-2 flex-wrap justify-center items-center content-center">
            <img class="rounded-4xl drop-shadow-modern-purple-discord drop-shadow-xl overflow-clip size-80 ring-2 ring-ring/40" src="../assets/sessionsBot.png" />
        </div>
        
        

    </section>

    <!-- Features -->
    <section class="bg-black/15 m-10 p-4 max-w-110 border-2 border-ring/70 rounded-sm">
        <p class="font-black self-start p-2 pb-3 border-b-2 border-ring">
            Bot Commands
        </p>
        <div class="p-2 ml-1 font-normal gap-2 flex flex-col flex-wrap justify-start items-center">
            <img class="w-110 my-3 ring-1 ring-ring" src="../assets/availableCommands.png" />
            <p class="text-zinc-300"> Use bot commands for features like modifying session assignees, viewing your currently assigned sessions, adjusting notifications, and more! </p>
        </div>
    </section>

</div> 
</template>



<style lang="css" scoped>


.beforeAstrictMark::before {
    font-size: 9px;
    position: relative;
    bottom: 2px;
    left: 1px;
}


</style>