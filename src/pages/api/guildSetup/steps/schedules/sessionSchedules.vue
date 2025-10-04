<script setup>
    // Imports:
    import { BanIcon, CalendarClockIcon, CalendarPlus2Icon, Clock4Icon, FileQuestionIcon, HelpCircleIcon, Layers2Icon, Trash2Icon, UserIcon, UsersIcon } from 'lucide-vue-next';
    import { computed, ref, } from 'vue';
    import createGuildSchedule from './components/createGuildSchedule.vue';
    import PricingLimits from '@/utils/modules/pricingLimits';
    import { toaster } from '@/utils/defaultExports';

    // Default Session Date:
    let defaultSessionDate = new Date()
    defaultSessionDate.setHours(12,0,0,0)

    // Incoming Props:
    const props = defineProps({
        changeStep: Function,
        guildData: Object
    })

    // Outgoing Emits
    const emits = defineEmits(
        ['updateDraft']
    )

    // Schedules:
    const currentSchedules = ref([]) // holds existing shd's for list/page view
    const creatingNewSchedule = ref(false) // controls new shd form visibility
    const scheduleToDuplicate = ref(null) // originating schedule data to duplicate
    const moreSchedulesAllowed = computed(() => currentSchedules.value?.length < PricingLimits.FREE_PLAN.MAX_SCHEDULES) // pricing limits
    const showAddScheduleMessage = ref(false)

    // Get Schedule Display Time Helper:
    function getScheduleDisplayTime(sessionDate){
        const date = new Date()
        date.setHours(sessionDate?.hours);
        date.setMinutes(sessionDate?.minutes);
        return date.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})
    }

    // Duplicate schedule fn:
    async function duplicateSchedule(schData){
        if(currentSchedules.value.length >= PricingLimits.FREE_PLAN.MAX_SCHEDULES) { 
            // Max schedules reached:
            toaster.warning(`Cannot create schedule! (max: ${PricingLimits.FREE_PLAN.MAX_SCHEDULES})`)
        } else{
            // Allowed - open new sch panel:
            creatingNewSchedule.value = true;
            showAddScheduleMessage.value = false
            await nextTick()
            scheduleToDuplicate.value = { ...schData }
        }
    }

    // Create/open new schedule fn:
    function attemptCreateNewSchedule() {
        if(currentSchedules.value.length >= PricingLimits.FREE_PLAN.MAX_SCHEDULES) { 
            // Max schedules reached:
            toaster.warning(`Cannot create schedule! (max: ${PricingLimits.FREE_PLAN.MAX_SCHEDULES})`)
        } else{
            // Allowed - open new sch panel:
            creatingNewSchedule.value = true;
            showAddScheduleMessage.value = false
        }
    }

    // Submit ALL Schedules to Draft:
    const submitScheduleStep = () => {
        if(currentSchedules.value?.length <= 0){
            // No schedules:
            return showAddScheduleMessage.value = true
        }else{
            // Send schedules & proceed:
            emits('updateDraft', {sessionSchedules: currentSchedules.value} );
            props.changeStep('4')
        }
        
    }

</script>


<template>

    <!-- Guild Schedules -->
    <div class="flex text-left pr-15 py-6 pb-0 flex-col gap-4.5 w-full"> 

        <!-- Step Heading/Star -->
        <p class="step-heading absolute required-step"> 
            Create your Server's Session Schedules
        </p>

        <!-- Schedules View -->
        <DataView
         class="mt-1"
         paginator
         :rows="5"
         :value="currentSchedules"
        >
            <!-- Header/Create New -->
            <template #header>
            <div class="w-full text-white/70 flex flex-row justify-center items-center">
                
                <span class="font-bold italic flex items-center gap-1">
                    <CalendarClockIcon :size="18" />
                    <p> SESSION SCHEDULES </p>
                </span>
                
            </div>
            </template>


            <!-- Existing Schd List -->
            <template #list="slotProps">
            <div class=" flex flex-col gap-3 py-3">

                <div
                 v-for="(item, index) in slotProps.items"
                 :key="index"
                 class="w-full bg-zinc-800 flex flex-col sm:flex-row gap-2 p-2 overflow-scroll justify-evenly items-center content-center"
                >
                
                    <!-- Session Details: -->
                    <div class="flex flex-1 gap-2 flex-wrap sm:flex-row justify-evenly items-center">


                        <!-- Session Title/Time -->
                        <div class="flex flex-col gap-2 min-w-22 pl-4 py-1.5 justify-center items-center">
                            <p title="Session Title" class="text-[22px] text-white/80 font-extrabold">
                            {{ item.sessionTitle }}
                            </p>

                            <span title="Session Time" class="text-lg text-nowrap font-medium block text-white/50">
                                <Clock4Icon class="!inline" :size="18" />
                                {{ getScheduleDisplayTime(item.sessionDateDaily) }}
                            </span>    
                        </div>


                        <!-- Session Roles -->
                        <section class="flex gap-2 flex-row justify-center items-center flex-wrap">

                            <div
                                v-for="(value, key) in item.roles"
                                class="bg-zinc-900/50 p-1.5 gap-12 flex-col text-center items-center justify-center content-center text-white font-bold ring-1 ring-ring rounded-xl shadow-lg"
                            >
                                <p class="m-1 text-sm"> {{ value.roleEmoji }} {{ value.roleName }} </p>
                                <div class="h-px w-[90%] m-1 bg-ring rounded-full" />
                                <div class="flex items-center justify-center flex-row gap-1">
                                    <UserIcon class="text-zinc-400" :size="12"/>
                                    <p class="text-xs text-zinc-400 font-extrabold"> {{ value.roleCapacity}} </p>
                                </div>
                                
                            </div>

                        </section>


                    </div>


                    <!-- Session Actions: -->
                    <div class="flex flex-col justify-center items-end content-center p-0.5 gap-2.75 pr-4">

                        <!-- Duplicate Sch -->
                        <Button
                            title="Duplicate Schedule"
                            unstyled
                            @click="(e) => { duplicateSchedule(item) }"
                            class="bg-zinc-600 hover:bg-zinc-500 transition-all ring-1 ring-ring flex justify-center items-center gap-0.75 p-2 py-0.75 rounded-xl cursor-pointer"
                        >

                            <Layers2Icon size="12" />
                            <p class="text-[11px] font-medium"> Duplicate </p>

                        </Button>


                        <!-- Delete Sch -->
                        <Button
                            title="Delete Schedule"
                            unstyled
                            @click="(e) => { currentSchedules.splice(index, 1) }"
                            class="bg-rose-600 hover:bg-rose-500 grayscale-55 transition-all ring-1 ring-ring flex justify-center items-center gap-0.5 p-2 py-0.75 rounded-xl cursor-pointer"
                        >

                            <Trash2Icon size="12" class="mb-0.25" />
                            <p class="text-xs font-medium"> Delete </p>

                        </Button>

                    </div>
                        

                </div>

            </div>
            </template>


            <!-- No Schedules Template -->
            <template #empty="slotProps">
                <div class="flex flex-col justify-center items-center px-5 py-6">
                    
                    <span class="text-zinc-500 gap-0.5 p-1.5 px-2 bg-zinc-950/50 ring-1 ring-ring font-light italic rounded-full flex flex-row items-center justify-center content-center">
                        <FileQuestionIcon :size="12" stroke-width="1.25" class=" text-zinc-500 rotate-18" />
                        <p class="text-xs"> NO SCHEDULES </p>
                    </span>


                </div>
            </template>

            
            <!-- Create Schedule Button -- Footer  -->
            <template #paginatorstart />
            <template #paginatorend>
                <!-- Create Schedule Button: -->
                <Button
                    title="Create Schedule"
                    unstyled
                    @click="attemptCreateNewSchedule"
                    class="bg-zinc-600 hover:bg-zinc-500 transition-all ring-1 ring-ring flex justify-center items-center gap-0.75 p-2 py-0.75 rounded-xl cursor-pointer"
                >

                    <CalendarPlus2Icon :size="12" v-if="moreSchedulesAllowed" /> 
                    <BanIcon :size="12" v-if="!moreSchedulesAllowed" />
                    <p class="text-[11px] font-medium"> {{ moreSchedulesAllowed ? "New" : "MAX SCHEDULES" }} </p>

                </Button>
            </template>

        </DataView>

        <a href="https://docs.sessionsbot.fyi/session-schedules" target="_blank" class=""> 
        <div class="!block w-full py-2.5 text-[13px] text-zinc-400 text-center hover:underline transition-all">
            
            <HelpCircleIcon class="!inline" :size="12" />
            <p class="ml-1 !inline">Learn more about <i>Session Schedules</i> here. </p>
            
        </div>
        </a>
        

       <!-- Schedule Input Messages: -->
        <Message v-if="showAddScheduleMessage" severity="error" class="opacity-75" size="small" variant="simple">
            <ul class="flex flex-col gap-1">
                <li class="text-red-300"> Add at least 1 schedule!
                </li>
            </ul>
        </Message>

    </div>

    <Divider />

    <!-- Last/Next Step Buttons -->
    <div class="flex flex-row gap-3 relative flex-wrap pb-6 pt-3 w-full">
        <Button class="w-fit" label="Back" severity="secondary" @click="changeStep('2')" />
        <Button class="w-fit" label="Submit" severity="success" type="submit" @click="submitScheduleStep" />
    </div>

    <!-- Create Schedule Panel -->
    <createGuildSchedule 
        :view-create-schedule-panel="creatingNewSchedule"
        :action-method="'CREATE'"
        :current-schedules="currentSchedules"
        :scheduleToDuplicate="scheduleToDuplicate"
        @close-panel="(e) => {creatingNewSchedule = false; scheduleToDuplicate = null}"
        @add-schedule="(newSch) => {currentSchedules.push(newSch)}"
    />
    
</template>