<script setup lang="ts">
    import { PencilIcon, Trash2Icon, UserCircleIcon, CheckCircle2Icon, ClockIcon, EyeIcon, LinkIcon, MapPinIcon, CalendarClockIcon } from "lucide-vue-next"
    import { DateTime } from 'luxon';
    import type { GuildData, UpcomingSession } from "@sessionsbot/api-types";
    import { defaultWindow } from "@vueuse/core";
    import { useToast } from "vue-toastification";
    import guildSchedulePanel from './viewGuildSchedule.vue';

    const props = defineProps<{
        guildSelectedData: GuildData
    }>()

    const guildSchedulesArray = computed(() => props.guildSelectedData?.guildDatabaseData?.sessionSchedules)
    const totalSchedulesCount = computed(() => props.guildSelectedData?.guildDatabaseData?.sessionSchedules?.length)


    const viewScheduleDetailsPanel : Ref<boolean> = ref(false); // Controls schedule panel visibility
    const selectedScheduleId : Ref<string> = ref(null)

    

</script>


<template>
<!-- Upcoming Sessions Table: -->
<div class="flex flex-wrap overflow-clip flex-col justify-between w-125 max-w-[100%] h-fit bg-zinc-900 ring-2 ring-ring items-center rounded-md">
	                
    <!-- Heading -->
    <div class="flex bg-white/5 flex-row text-center justify-between items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
        <div class="flex flex-row gap-2 justify-between items-center content-center">
            <CalendarClockIcon />
            <p class="font-medium"> Guild Schedules </p>
        </div>

        <div class="flex flex-row gap-2 justify-between items-center content-center">
            <p class="font-medium text-sm bg-indigo-700/20 p-1 px-1.5 rounded-md ring-1 ring-ring"> {{ totalSchedulesCount || '%' }} Schedules </p>
        </div>
        
    </div>

    <!-- Upcoming Sessions -->
    <div class="flex flex-col text-white/65 gap-2 p-3 ring-ring w-full h-fit flex-1 overflow-y-hidden overflow-x-scroll">
        
        <!-- Schedules table -->
        <table v-if="totalSchedulesCount">

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
                
                <tr v-for="(schedule, key) in guildSchedulesArray" class="text-center text-white font-light" :key="key">
                    
                    <!-- Sch Title -->
                    <td class="border-2 border-ring p-2.5">
                        <p class="bg-zinc-800 p-1 py-0.5 rounded-md w-fit m-auto">
                            {{ schedule?.sessionTitle }}
                        </p>
                    </td>
                    

                    <!-- Sch Time -->
                    <td class="border-2 border-ring p-2.5">
                        <p class="bg-zinc-800 text-nowrap p-1 py-0.5 rounded-md w-fit m-auto">
                            {{ DateTime.now().set({hour: schedule?.sessionDateDaily?.hours, minute: schedule?.sessionDateDaily?.minutes, second: 0, millisecond: 0}).toLocaleString(DateTime.TIME_SIMPLE) || '?'}}
                        </p>
                    </td>

                    <!-- Sch Roles -->
                    <td class="border-2 border-ring p-2.5">
                        <div class="flex flex-col justify-center items-center content-center gap-1.5">

                       

                            <p class="text-sm flex justify-center items-center gap-1 bg-zinc-800 p-1 py-0.25 rounded-md"> 
                                {{ schedule?.roles?.length || 0 }} Roles
                            </p>


                        </div>
                    </td>

                    <!-- Actions -->
                    <td class="border-2 border-ring p-2.5">
                            
                        <Button unstyled 
                            class="bg-indigo-500/20 rounded-md m-auto px-2 py-1 gap-1.25 flex flex-row justify-center items-center content-center  transition-all cursor-pointer"
                            @click="()=>{ viewScheduleDetailsPanel = true; selectedScheduleId = schedule?.scheduleId }"
                        >
                            <PencilIcon :size="15" />
                            <p class="font-medium text-sm"> Edit </p>
                        </Button>

                    </td>

                </tr>

            </tbody>

        </table>

        <!-- No Sessions Msg -->
        <p v-else class="font-light p-2 text-center flex justify-center items-center content-center">
            No guild schedules... <br>
            SessionsBot won't create any sessions for this guild!
        </p>

    </div>

</div>

<guildSchedulePanel 
    :guildSelectedData="guildSelectedData" 
    :viewScheduleDetailsPanel="viewScheduleDetailsPanel" 
    :selectedScheduleId="selectedScheduleId" 
    @close-panel="(e)=>{ viewScheduleDetailsPanel=false; selectedScheduleId = null }"
/>

</template>
