<script setup lang="ts">
    import { GuildData } from '@sessionsbot/api-types';
    import { XCircleIcon, XIcon, XSquareIcon } from 'lucide-vue-next';


    const props = defineProps<{
        viewGuildConfigurationPanel: boolean;
        guildSelectedData: GuildData | undefined;
    }>()

    const emits = defineEmits(['closePanel'])

</script>

<template>
<!-- Guild Config Panel -->
<Dialog v-bind:visible="viewGuildConfigurationPanel" :draggable="false" :modal="true">

    <!-- Panel Header -->
    <template #header>
        <div class="flex flex-row-reverse justify-between items-start">
            <!-- Close Button -->
            <Button unstyled @click="emits('closePanel');" class="hover:bg-white/15 p-2 rounded-full">
                <XIcon />
            </Button>
            <!-- Title/Heading -->
            <div class="flex flex-col flex-wrap mr-5 gap-1">
                <p class="text-xl font-bold"> Guild Configuration: </p>
                <!-- Guild name & icon -->
                <div class="bg-white/10 p-0.75 w-fit rounded-md flex flex-row gap-1 flex-wrap justify-start items-center">
                    <img class="w-5 h-5 rounded-md" :src="guildSelectedData?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'" alt="Guild Icon">
                    <p class="text-sm"> {{ guildSelectedData?.guildGeneral?.name }} </p>
                </div>
            </div>
        </div>
    </template>

    <!-- Hide default close button -->
    <template #closebutton>
        <span hidden class="hidden w-px h-px" />
    </template>

    <!-- Panel Contents -->
    <template #default>

    </template>

    <!-- Panel Footer -->
    <template #footer>
        <p class="text-xs text-zinc-500">
            {{ guildSelectedData?.guildGeneral?.id }}
        </p>
    </template>

</Dialog>
</template>
