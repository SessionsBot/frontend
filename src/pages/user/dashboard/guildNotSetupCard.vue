<script setup lang="ts">
import { HelpCircleIcon, LayoutDashboardIcon, Wrench, WrenchIcon } from 'lucide-vue-next';

const props = defineProps<{
    selectedGuildId: string | null
}>()

</script>

<template>
	<div class="bg-black/20 mx-4 mb-10 mt-2 ring-3 ring-ring flex flex-col overflow-clip justify-center items-center rounded-2xl">
        <!-- Header -->
        <div class="flex w-full flex-col border-b-2 p-2.5 border-dotted bg-white/5 gap-0.5 border-ring rounded-tr-2xl rounded-tl-2xl">
            <p class="font-semibold text-2xl"> 👋 Hey there, </p>
            <p class="px-5 italic font-normal text-zinc-400 text-start"> It looks like this server was never setup! </p>
        </div>
        <!-- Content -->
        <div class="flex p-4 flex-col justify-center items-center">

            <Button @click="(e)=>$router.push({path: '/api/guild-setup', query: {guildId: props.selectedGuildId}})" class="bg-emerald-700/50 my-3 px-2.5 py-1.5 gap-1 rounded-md flex flex-row  flex-nowrap text-center justify-center items-center content-center cursor-pointer hover:brightness-115 transition-all" unstyled>
                <WrenchIcon :size="18"/>
                <p> Start Setup </p>
            </Button>

            <p class="p-2 mb-1 text-[11px] text-zinc-400 max-w-[80%] text-center"> 
                Before accessing your Bot Dashboard, you'll have to complete your server's setup process!
            </p>

            <a href="https://docs.sessionsbot.fyi/getting-started#setup" target="_blank" class="flex flex-row flex-nowrap gap-0.75 text-zinc-500 hover:text-sky-400/45 cursor-pointer">
                <HelpCircleIcon :size="16" />
                <p class="text-xs"> Need Help? </p>
            </a>

        </div>
    </div>
</template>
