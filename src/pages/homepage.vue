<script setup>
    import { defaultWindow } from '@vueuse/core';
    import discordIcon from '@/assets/svgs/discord-icon.vue'
    import { auth, nav } from '@/utils/defaultExports';
    import { WrenchIcon } from 'lucide-vue-next';

</script>


<template> 
<div class="flex justify-start items-center flex-col w-full h-full flex-1 ">
    
    <!-- Hero/Landing Section -->
    <section class="flex gap-4 bg-black/30 overflow-clip w-full py-10 justify-evenly items-center content-center flex-wrap text-center">

        <!-- Text/Action -->
        <div class="flex m-5 flex-col gap-0.5 flex-wrap justify-center items-center content-center">

            <h1 class="text-5xl font-black text-shadow-md text-shadow-modern-purple-discord/70"> Sessions Bot </h1>

            <div class="mt-0.75 text-zinc-300/60 font-semibold p-1 px-2.5 rounded-sm flex flex-col gap-1.5 justify-center items-center self-center">
            
                <div class="my-3 ring-1 ring-ring bg-zinc-900 brightness-115 text-zinc-400 rounded-md px-2 py-0.5 flex flex-row gap-1.75 items-center">
                    <p> Made For Discord </p>
                    <discordIcon class="size-5" />
                </div>
                
                <p class="mt-4"> A powerful Discord application for managing group events/sessions. </p>
                <p class="mt-1 italic"> Streamlined, Automated, and Reliable </p>


            </div>

            <!-- Buttons: -->
            <div class="mt-8 flex flex-wrap gap-3.5 justify-center">

                <Button unstyled @click="nav().externalPaths().inviteBotUsingDiscord()"
                    class="bg-indigo-500 px-3.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:brightness-115 transition-all"
                > 
                    <discordIcon class="size-4.5 mr-1" />
                    Invite the Bot 
                </Button>

                <Button unstyled @click="$router.push('/dashboard')"
                    class="bg-zinc-700 gap-1 px-3.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:brightness-115 transition-all"
                > 
                    <WrenchIcon :size="21" />
                    Bot Dashboard 
                </Button>

            </div>

            
            

        </div>

        <!-- Img Section -->
        <div class="flex m-5 flex-col gap-2 flex-wrap justify-center items-center content-center">
            <img class="rounded-4xl hero-img-shadow overflow-clip size-50 sm:size-70 ring-2 ring-ring/40" src="/sessionsBot.png" />
        </div>
        
        

    </section>

    <!-- Features -->
    <div class="flex flex-wrap justify-center items-start content-center m-10 gap-6">
        
        <!-- Bot Commands -->
        <section class="bg-black/15 p-4 max-w-110 border-2 border-ring/70 rounded-sm">
            <p class="font-black self-start p-2 pb-3 border-b-2 border-ring">
                🤖 Bot Commands
            </p>
            <div class="p-2 ml-1 font-normal gap-2 flex flex-col flex-wrap justify-start items-center">
                <img class="w-110 my-3 ring-1 rounded-md ring-ring" src="../assets/availableCommands.png" />
                <p class="text-zinc-300"> Use bot commands for features like modifying session assignees, viewing your currently assigned sessions, adjusting notifications, and more! </p>
            </div>
        </section>

        <!-- Sessions Signups -->
        <section class="bg-black/15 p-4 max-w-110 border-2 border-ring/70 rounded-sm">
            <p class="font-black self-start p-2 pb-3 border-b-2 border-ring">
                📝 Session Signups
            </p>
            <div class="p-2 ml-1 font-normal gap-2 flex flex-col flex-wrap justify-start items-center">
                <img class="max-h-50 h-fit my-3 ring-1 rounded-md ring-ring" src="../assets/signup-panel-w-roles.png" />
                <p class="text-zinc-300"> Sessions Bot sends session signup/alert messages according to your configured schedules! Configure roles for your sessions to allow member signups. </p>
            </div>
        </section>

        <!-- Adjust Preferences -->
        <section class="bg-black/15 p-4 max-w-110 border-2 border-ring/70 rounded-sm">
            <p class="font-black self-start p-2 pb-3 border-b-2 border-ring">
                ⚙️ Fine Tune Preferences
            </p>
            <div class="p-2 ml-1 font-normal gap-2 flex flex-col flex-wrap justify-start items-center">
                <img class="max-h-50 h-fit my-3 ring-1 rounded-md ring-ring" src="../assets/dashboard-modify-schedules.png" />
                <p class="text-zinc-300"> Adjust your server's bot preferences right from your dashboard. Modify configurations like your schedules sessions, accent color, time zone, etc. </p>
            </div>
        </section>
    </div>

</div> 
</template>



<style lang="css" scoped>


.beforeAstrictMark::before {
    font-size: 9px;
    position: relative;
    bottom: 2px;
    left: 1px;
}

.hero-img-shadow{
    box-shadow: 10px 12px 32px var(--color-indigo-700), -10px -12px 32px var(--color-sky-700) ;
}


</style>