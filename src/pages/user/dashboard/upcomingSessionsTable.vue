<script setup lang="ts">
    import { PencilIcon, Trash2Icon, UserCircleIcon, CheckCircle2Icon, ClockIcon, EyeIcon, LinkIcon, MapPinIcon } from "lucide-vue-next"
    import { DateTime } from 'luxon';
    import type { GuildData, UpcomingSession } from "@sessionsbot/api-types";
    import { defaultWindow } from "@vueuse/core";
    import { useToast } from "vue-toastification";

    const props = defineProps<{
        upcomingSessionsObj: { [key: string]: UpcomingSession; };
        todaysSessionCount: number
        guildSelectedData: GuildData
    }>()

    /** Boolean value to control wether the 'Sessions Details' panel is visible*/
    const sessionDetailsVisible = ref(false)
    /** The _data_ of the current session being viewed */
    const sessionsDetailsData : Ref<UpcomingSession> = ref(null)
    /** The id of the current session being viewed */
    const sessionsDetailsKey = ref(null)

    /** Current selected sessions date e.g: 9:00 AM */
    const sessionsDetailsDate = computed(() => {
        if(DateTime.fromSeconds(Number(sessionsDetailsData.value?.date?.discordTimestamp)).isValid){
            return DateTime.fromSeconds(Number(sessionsDetailsData?.value?.date?.discordTimestamp)).toLocaleString(DateTime.TIME_SIMPLE) 
        } else return 'INVALID'
    })

    /** Current selected sessions relative date e.g: 4 hours ago*/
    const sessionsDetailsDateRelative = computed(() => {
        if(DateTime.fromSeconds(Number(sessionsDetailsData.value?.date?.discordTimestamp)).isValid){
            return DateTime.fromSeconds(Number(sessionsDetailsData.value?.date?.discordTimestamp)).toRelative() 
        } else return 'INVALID'
    })

    /** Current selected sessions relative date e.g: 4 hours ago*/
    const sessionsDetailsDiscordLink = computed(() => {
        if(props.guildSelectedData){
            return `https://discord.com/channels/${props?.guildSelectedData?.guildGeneral?.id}/${props?.guildSelectedData?.guildDatabaseData?.sessionSignup?.signupThreadId}/${sessionsDetailsData?.value?.signupPanelMsgId}`
        } else {return 'null'}
    })


    

</script>


<template>
<!-- Upcoming Sessions Table: -->
<div class="flex flex-wrap overflow-clip flex-col justify-between w-125 max-w-[100%] h-fit bg-zinc-900 ring-2 ring-ring items-center rounded-md">
	                
    <!-- Heading -->
    <div class="flex bg-white/5 flex-row text-center justify-between items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
        <div class="flex flex-row gap-2 justify-between items-center content-center">
            <ClockIcon />
            <p class="font-medium"> Today's Sessions </p>
        </div>

        <div class="flex flex-row gap-2 justify-between items-center content-center">
            <p class="font-medium text-sm bg-slate-700 p-1 px-1.5 rounded-md ring-1 ring-ring"> {{ todaysSessionCount || '%' }} Sessions </p>
        </div>
        
    </div>

    <!-- Upcoming Sessions -->
    <div class="flex flex-col text-white/65 gap-2 p-3 ring-ring w-full h-fit flex-1 overflow-y-hidden overflow-x-scroll">
        
        <!-- Sessions Tables -->
        <table v-if="todaysSessionCount >= 1" class="inline-table  ">

        <!-- Heading Row -->
        <thead>
            <tr class="border-1 border-ring bg-white/5">
                <th 
                    v-for="heading in ['Session Title', 'Session Time', 'Session Roles', 'Actions']" 
                    scope="col" 
                    class="border-2 border-ring p-2 font-medium text-center"
                > 
                    {{ heading }} 
                </th>
            </tr>
        </thead>
        
        <!-- Session Row: -->
        <tbody>
            
            <tr v-for="(value, key) in upcomingSessionsObj" class="text-center text-white font-light" :key="key">
                
                <!-- Sch Title -->
                <td class="border-2 border-ring p-2.5">
                    <p class="bg-zinc-800 p-1 py-0.5 rounded-md w-fit m-auto">
                        {{ value.title }}
                    </p>
                </td>
                

                <!-- Sch Time -->
                <td class="border-2 border-ring p-2.5">
                    <p class="bg-zinc-800 p-1 py-0.5 rounded-md w-fit m-auto">
                        {{ DateTime.fromSeconds(Number(value.date.discordTimestamp)).toLocaleString(DateTime.TIME_SIMPLE) }}
                    </p>
                </td>

                <!-- Sch Roles -->
                <td class="border-2 border-ring p-2.5">
                    <div class="flex flex-col justify-center items-center content-center gap-1.5">

                        <div v-for="role in value.roles" class="flex flex-row gap-1.5 justify-between w-full items-center content-center">
                            
                            <p class="text-sm flex justify-center flex-nowrap items-center content-center gap-0.75"> 
                                <UserCircleIcon class="inline" :size="15"/>
                                {{ role.roleName }}
                            </p>

                            <p class="text-sm flex justify-center items-center gap-1 bg-zinc-800 p-1 py-0.25 rounded-md"> 
                                {{ role?.users?.length || '0' }}/{{ role?.roleCapacity || '?' }}
                            </p>

                        </div>

                    </div>
                </td>

                <!-- Actions -->
                <td class="border-2 border-ring p-2.5">
                        
                    <Button unstyled 
                        class="bg-slate-700 rounded-md m-auto px-2 py-1 gap-0.75 flex flex-row justify-center items-center content-center  transition-all cursor-pointer"
                        @click="()=>{ sessionDetailsVisible = true; sessionsDetailsData = value; sessionsDetailsKey = key}"
                    >
                        <EyeIcon :size="15" />
                        <p class="font-medium text-sm"> View </p>
                    </Button>

                </td>

            </tr>

        </tbody>

        </table>

        <!-- No Sessions Msg -->
        <p v-else class="font-light p-2 text-center flex justify-center items-center content-center">
            No upcoming sessions...
        </p>

    </div>

</div>

<!-- View Session - Dialog Frame: -->
<Dialog v-model:visible="sessionDetailsVisible" class="w-[80%] sm:w-125" :modal="true">
    <!-- Header -->
    <template #header >
        <div class="flex flex-col gap-1">
            <!-- Session Title -->
            <p class="text-2xl font-bold mr-7"> {{ sessionsDetailsData?.title }} </p>
            <!-- Session Date -->
            <div class="flex flex-row ml-1 gap-2.5 justify-start items-center">
                <p class="text-lg font-bold"> {{ sessionsDetailsDate }}</p>
                <p class="text-xs font-bold bg-white/10 px-1.25 py-0.5 rounded-lg"> {{ sessionsDetailsDateRelative }}</p>
            </div>
        </div>
        
    </template>

    <!-- Content -->
    <div class="flex flex-col flex-wrap gap-5 p-1">

        <!-- Session Roles -->
        <div class="flex gap-3.5 flex-col justify-end items-center">
            <p class="w-fit font-medium gap-0.75 flex justify-center items-center bg-white/10 px-1.25 py-0.5 rounded-lg self-start">
                <UserCircleIcon :size="15" />
                Session Roles:
            </p>
            <div v-for="role in sessionsDetailsData?.roles" class="w-[85%] text-center ring-ring ring-1 p-1.5 flex justify-between items-center">
                <p class="font-medium"> {{ role?.roleName }} </p>
                <p class="text-xs w-7 py-0.5 h-full bg-white/20 rounded-lg"> {{ role?.users?.length || 0 }}/{{ role?.roleCapacity || 0 }}</p>
            </div>
        </div>


        <!-- Session Links -->
        <div class="flex gap-3.5 flex-col justify-center content-center items-center">
            <p class="w-fit font-medium gap-0.75 flex justify-center items-center bg-white/10 px-1.25 py-0.5 rounded-lg self-start">
                <LinkIcon :size="15" />
                Links:
            </p>
            <div class="flex justify-center content-center items-center flex-row gap-2.25 p-1.5">

                <!-- Event Location -->
                <Button @click="() => {defaultWindow.open(sessionsDetailsData?.location, '_blank')}" unstyled class="p-2 py-1.5 gap-0.75 rounded-md bg-sky-700/50 flex flex-row items-center content-center justify-center cursor-pointer">
                    <MapPinIcon :size="17"/>
                    <p class=""> Session Location </p>
                </Button>

                <!-- Discord Signup -->
                <Button @click="() => {defaultWindow.open(sessionsDetailsDiscordLink, '_blank') }" unstyled class="p-2 py-1.5 gap-0.75 rounded-md bg-indigo-700/45 flex flex-row items-center content-center justify-center cursor-pointer">
                    <svg class="h-5 w-5 mx-0.5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid"><g><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"></path></g></svg>
                    <p class=""> View on Discord </p>
                </Button>

            </div>

        </div>
        
        
    </div>

    <!-- Footer -->
    <template #footer>
        <p class="text-xs text-zinc-600"> {{ sessionsDetailsKey }} </p>
    </template>

</Dialog>
</template>
