<script setup lang="ts">
    import { PencilIcon, CalendarClockIcon, PlusIcon } from "lucide-vue-next"
    import { DateTime } from 'luxon';
    import type { GuildData } from "@sessionsbot/api-types";
    import CreateGuildSchedulePanel from "./createGuildSchedule.vue";
    import { toaster } from "@/utils/defaultExports";
    import PricingLimits from "@/utils/modules/pricingLimits";

    // PRICING PLANS - LIMITS:
    const maxSchedules = PricingLimits.FREE_PLAN.MAX_SCHEDULES

    const props = defineProps<{
        guildSelectedData: GuildData
    }>()

    const emits = defineEmits(['updateDashboard']);

    const guildSchedulesArray = computed(() => props.guildSelectedData?.guildDatabaseData?.sessionSchedules.sort((schA, schB) => (schA.sessionDateDaily.hours*100+schA.sessionDateDaily.minutes) - (schB.sessionDateDaily.hours*100+schB.sessionDateDaily.minutes)))
    const totalSchedulesCount = computed(() => props.guildSelectedData?.guildDatabaseData?.sessionSchedules?.length)


    const selectedScheduleId: Ref<string> = ref(null) // Current sch id in view/edit
    const viewCreateSchedulePanel: Ref<boolean> = ref(false) // Controls new schedule panel visibility
    const schedulePanelActionMethod = ref<'CREATE' | 'EDIT'>('CREATE')
    const openCreateSchedule = (e:Event) => {
        
        // Check pricing plan limits:
        if(props.guildSelectedData?.guildDatabaseData?.sessionSchedules?.length >= maxSchedules){
            // Max schedules reached:
            toaster.warning(`Maximum amount of schedules reached! (limit: ${maxSchedules})`)
        }else{
            // Allowed - Open new schedule panel:
            schedulePanelActionMethod.value = 'CREATE';
            viewCreateSchedulePanel.value = true;
        }
    }

</script>


<template>
<!-- Upcoming Schedules Table: -->
<div class="flex flex-wrap overflow-clip flex-col justify-between w-125 max-w-[100%] h-fit bg-zinc-900 ring-2 ring-ring items-center rounded-md">
	                
    <!-- Heading -->
    <div class="flex bg-white/5 flex-row text-center justify-between items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
        <div class="flex flex-row gap-2 justify-between items-center content-center">
            <CalendarClockIcon />
            <p class="font-medium"> Guild Schedules </p>
        </div>

        <div class="flex flex-row gap-2 justify-between items-center content-center">
            <p class="font-medium text-sm bg-indigo-700/30 p-1 px-1.5 rounded-md ring-1 ring-ring"> 
                {{ totalSchedulesCount || '0' }} {{ totalSchedulesCount==1 ? 'Schedule' : 'Schedules' }} 
            </p>
        </div>
        
    </div>

    <div class="flex flex-col text-white/65 gap-3 p-3 ring-ring w-full h-fit flex-1 overflow-y-hidden overflow-x-scroll">
        
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

            <!-- Schedule Rows: -->
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
                        
                        <!-- Edit Schedule Button -->
                        <Button unstyled 
                            class="bg-indigo-500/20 rounded-md m-auto px-2 py-1 gap-1.25 flex flex-row justify-center items-center content-center  transition-all cursor-pointer"
                            @click="()=>{ viewCreateSchedulePanel = true; schedulePanelActionMethod = 'EDIT'; selectedScheduleId = schedule?.scheduleId}"
                        >
                            <!-- OLD CLICK E -->
                            <!-- @click="()=>{ viewScheduleDetailsPanel = true; selectedScheduleId = schedule?.scheduleId } -->
                            <PencilIcon :size="15" />
                            <p class="font-medium text-sm"> Edit </p>
                        </Button>

                    </td>

                </tr>



            </tbody>

        </table>

        <!-- No Schedules Msg -->
        <p v-else class="font-light p-2 text-center flex justify-center items-center content-center">
            No guild schedules... <br>
            SessionsBot won't create any sessions for this guild!
        </p>

        <!-- New Schedule Button -->
        <Button @click="(e)=>openCreateSchedule(e)" unstyled 
            class="bg-zinc-800 rounded-md hover:brightness-150 font-semibold text-sm text-zinc-300 transition-all px-1.75 py-0.75 cursor-pointer flex justify-center items-center content-center max-w-55 flex-1 self-center">
            <PlusIcon :size="17" /> 
            <p class="leading-relaxed"> New Schedule </p>
        </Button>

    </div>

</div>

<CreateGuildSchedulePanel
    :guildSelectedData="guildSelectedData"
    :view-create-schedule-panel="viewCreateSchedulePanel"
    :editing-schedule-id="selectedScheduleId"
    :action-method="schedulePanelActionMethod"
    @close-panel="(e)=>{ viewCreateSchedulePanel=false }"
    @switchToCreate="(e)=>{schedulePanelActionMethod = 'CREATE'}"
    @update-dashboard=" (guildId) => emits('updateDashboard', guildId)"
/>

</template>
