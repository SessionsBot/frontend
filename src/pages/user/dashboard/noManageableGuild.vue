<script setup lang="ts">
    import DiscordIcon from '@/assets/svgs/discord-icon.vue';
    import { nav } from '@/utils/defaultExports';
</script>

<template>
	<div class="bg-black/20 mx-6 mb-10 mt-2 ring-3 ring-ring flex flex-col overflow-clip justify-center items-center rounded-2xl">
        <!-- Header -->
        <div class="flex w-full flex-col border-b-2 p-2.5 border-dotted bg-white/5 gap-0.5 border-ring rounded-tr-2xl rounded-tl-2xl">
            <p class="font-semibold text-2xl"> 👋 Hey there, </p>
            <p class="px-5 italic font-normal text-zinc-400 text-start"> It looks like you don't own/manage any servers with Sessions Bot! </p>
        </div>
        <!-- Content -->
        <div class="flex p-4 flex-col justify-center items-center">

            <Button unstyled @click="nav().externalPaths().inviteBotUsingDiscord()"
                class="bg-indigo-500 my-2 px-3.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:brightness-115 transition-all"
            > 
                <DiscordIcon class="size-4.5 mr-1" />
                Invite the Bot 
            </Button>

            <p class="p-2 my-1 text-[11px] text-zinc-400 max-w-[80%] text-center"> 
                Before accessing your Bot Dashboard, you'll have to invite your bot and complete your server's setup process. 
            </p>

        </div>
    </div>
</template>
