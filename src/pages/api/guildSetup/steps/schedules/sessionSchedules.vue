<script setup>
    // Imports:
    import { BanIcon, CalendarPlus2Icon, Clock4Icon, FileQuestionIcon, Layers2Icon, Trash2Icon, UsersIcon } from 'lucide-vue-next';
    import { computed, ref, } from 'vue';

    // import CreateGuildSchedule from './createGuildSchedule.vue';
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
    const moreSchedulesAllowed = computed(() => currentSchedules.value?.length <= 7) // pricing limits
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
    <div class="flex text-left pr-15 py-6 flex-col gap-4.5 w-full"> 

        <!-- Step Heading/Star -->
        <p class="hidden step-heading absolute required-step"> </p>

        <!-- Schedules View -->
        <DataView
         paginator
         :rows="5"
         :value="currentSchedules"
        >
            <!-- Header/Create New -->
            <template #header>
            <div class="w-full text-white/70 flex flex-row justify-center items-center">
                
                <p class="font-bold flex italic gap-1.5 items-center">
                    <Clock4Icon size="18" />
                    SESSION SCHEDULES:
                </p>
                
            </div>
            </template>


            <!-- Existing Schd List -->
            <template #list="slotProps">
            <div class=" flex flex-col gap-3 py-3">

                <div
                 v-for="(item, index) in slotProps.items"
                 :key="index"
                 class="w-full bg-zinc-800 flex gap-2 p-2 overflow-scroll justify-evenly items-center content-center"
                >
                
                    <!-- Session Details: -->
                    <div class="flex flex-1 gap-2 flex-row justify-evenly items-center">


                        <!-- Session Title/Time -->
                        <div class="flex flex-col flex-wrap gap-1 min-w-22 py-1.5 justify-center items-center">
                            <p title="Session Title" class="text-[22px] text-white/80 font-extrabold">
                            {{ item.sessionTitle }}
                            </p>

                            <p title="Session Time" class="text-lg font-medium text-white/50">
                                {{ getScheduleDisplayTime(item.sessionDateDaily) }}
                            </p>    
                        </div>


                        <!-- Session Roles -->
                        <section class="flex gap-2 flex-row justify-center items-center flex-wrap">
                        <div 
                            v-for="(value, key) in item.roles"
                            class="bg-zinc-500 grayscale-50 flex flex-col border-2 border-black/50 text-xs min-w-16 text-center justify-center items-center gap-0.5 p-0.75 px-0 rounded-sm"
                        >
                            <p title="Role Emoji" class="text-shadow-lg text-black">
                                {{ value?.roleEmoji  }}
                            </p>
                            
                            <p :title="value?.roleName + ' | ' + value?.roleDescription || 'Role Name'" class="text-white px-1.25 py-0.25 text-wrap bg-zinc-700 font-medium font-stretch-semi-condensed w-full h-full border-t-2 border-b-2 border-black/25">
                                {{ value?.roleName.toUpperCase()  }}
                            </p>

                            <div title="Role Capacity" class="flex text-black flex-row gap-0.5 justify-center items-center flex-nowrap">
                                <UsersIcon size="17" stroke-width="1.75"/>
                                <p> {{ value?.roleCapacity }} </p>
                            </div>
                        </div>
                        </section>


                    </div>


                    <!-- Session Actions: -->
                    <div title="Delete Schedule" class="flex flex-row justify-center items-center">
                        <!-- Duplicate -->
                        <Button 
                            unstyled
                            class="bg-zinc-600 grayscale-55 p-1 m-2 rounded-sm cursor-pointer
                            flex justify-center items-center content-center"
                            @click="(e) => { duplicateSchedule(item) }"
                        >
                            <Layers2Icon size="19" />
                        </Button>
                        <!-- Delete -->
                        <Button 
                            unstyled
                            class="bg-rose-700 grayscale-55 p-1 m-2 rounded-sm cursor-pointer
                            flex justify-center items-center content-center"
                            @click="(e) => { currentSchedules.splice(index, 1) }"
                        >
                            <Trash2Icon size="19" />
                        </Button>
                    </div>
                        

                </div>

            </div>
            </template>


            <!-- No Schedules Template -->
            <template #empty="slotProps">
                <div class="flex gap-0 flex-col justify-center items-center px-5 py-6">
                    
                    <FileQuestionIcon stroke-width="1.25" class="text-zinc-500" />
                    <p class="text-zinc-500 font-light italic">
                        NO SCHEDULES
                    </p>


                    <Button
                    hidden
                        unstyled
                        size="small"
                        class="!mt-5 !p-1 cursor-pointer text-white rounded-md !bg-amber-500/50 !border-amber-600/50 !w-fit !m-0 flex !gap-0.75 !items-center !justify-center !content-center"
                        @click="creatingNewSchedule = true"
                    >
                        <CalendarPlus2Icon size="20" strokeWidth="2"/> 
                        <p class="text-xs !p-0 !m-0 font-semibold !pt-0.5"> Create Schedule </p>
                    </Button>
                </div>
            </template>

            
            <!-- Create Schedule Button -- Footer  -->
            <template #paginatorstart />
            <template #paginatorend>
                <!-- Create Schedule Button: -->
                <Button
                    title="Create Schedule"
                    unstyled
                    :disabled="!moreSchedulesAllowed"
                    size="small"
                    class="!p-1 cursor-pointer text-white rounded-md disabled:!bg-zinc-600 disabled:!cursor-not-allowed !bg-amber-500/50 !border-amber-600/50 !w-fit !m-0 flex !gap-0.75 !items-center !justify-center !content-center"
                    @click="attemptCreateNewSchedule"
                 >
                    <CalendarPlus2Icon v-if="moreSchedulesAllowed" size="20" strokeWidth="2"/> 
                    <BanIcon v-if="!moreSchedulesAllowed" size="19.5" />
                </Button>
            </template>

        </DataView>


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
    <div class="flex flex-row gap-3 flex-wrap pb-6 pt-3">
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