<script setup lang="ts">
    // Imports
    import { postGuildSchedulesEarly } from '@/utils/modules/backendApi';
    import { AlertTriangleIcon, ArrowBigLeftDashIcon, ClockArrowDownIcon, ClockArrowUpIcon, DiamondMinusIcon, LoaderIcon, SquircleDashedIcon, XCircleIcon } from 'lucide-vue-next';
    import { useToast } from 'vue-toastification';
    
    const toaster = useToast()

    // Incoming Props
    let props = defineProps<{
        selectedGuildId: string
        viewPostSessionsEarlyDialog: boolean
    }>()

    // Outgoing Emits
    const emits = defineEmits(['closePanel', 'updateDashboard'])

    /** Weather user has checked the 'I understand the warnings' checkbox */
    const understandsWarningsChecked = ref<boolean>(false)
    /** Toggles a validation/required alert for "Understood Warnings" checkbox */
    const understandsWarningsCheckedShowRequired = ref<boolean>(false)

    /** Indicates the status of any current request to post sessions early*/
    const postAttemptStatus = ref<0|100|200|300>(0)
    /** Attempt to post sessions for guild early after checks */
    async function postSessionsEarlyAttempt(){ try {
        // Confirm "Understand Warnings" is checked
        if(!understandsWarningsChecked.value){
            return understandsWarningsCheckedShowRequired.value = true
        }
        // Set status as loading
        postAttemptStatus.value = 100;
       
        const postResults = await postGuildSchedulesEarly(props.selectedGuildId);
        if(!postResults.success) throw {message: "Failed to post server sessions early!", result: postResults}

        // Set status as success
        postAttemptStatus.value = 200;
        toaster.success('Your sessions have been posted early within your Signup Channel!')
        setTimeout(()=> postAttemptStatus.value = 0, 3000)
        setTimeout(() => {
            emits('closePanel')
        }, 800);

    }catch(err) {
        // Set status as failed
        postAttemptStatus.value = 300;
        console.error('{!} FAILED TO POST SESSIONS EARLY', err)
        toaster.error('Failed to post sessions early... Try again later or contact support!')
        setTimeout(()=> postAttemptStatus.value = 0, 3000)
    }}


</script>

<template>
<Dialog :visible="viewPostSessionsEarlyDialog" :modal="true" class="w-[90%] max-w-130">
    <!-- Header & CloseBtn -->
    
    <template #closebutton="buttonProps">
        <span hidden />
    </template>

    <!-- Main Content -->
    <template #container>
    <div class="p-8 gap-0 flex flex-col flex-wrap justify-center items-center content-center">
        <!-- Header -->
        <span class="pb-4 block !w-full text-center font-bold"> 
            <ClockArrowUpIcon :size="24" class="inline mb-1.5" />
            <p class="text-[20px] inline"> Post/Refresh Todays Session Schedules Early:  </p>
        </span>

        <!-- Info/Subtitles -->
         <span class="pb-3">
            <p class="w-full text-left"> Want to post your servers sessions early for today?</p>
            <p class="w-full text-left"> Simply click the "Post Now" button below and wait for a success confirmation.</p>
        </span>

        <!-- Warnings -->
        <div class="p-2 gap-2 ring-1 ring-ring bg-black/30 rounded-md flex justify-center items-center content-center flex-col flex-wrap">

        <span class="p-2.5 py-0.75 w-full bg-amber-700/70 rounded-md block">
            <AlertTriangleIcon class="inline mb-0.75" :size="16" :stroke-width="2.5"/>
            <p class="text-[13px] inline font-semibold"> Please Note: </p>
        </span>

        <div class="flex flex-col flex-wrap w-full gap-0.75 justify-start items-start">
            <span>
                <SquircleDashedIcon :size="19" class="mb-0.5 inline" />
                <p class="inline opacity-90"> Performing this action will <b class="font-semibold">RESET</b> any current session role assignments for todays sessions. </p>
                <p class="opacity-70 text-xs italic inline"> (if already posted) </p>
            </span>
            <span>
                <SquircleDashedIcon :size="19" class="mb-0.5 inline" />
                <p class="inline opacity-90"> This will <b class="font-semibold">NOT</b> prevent/cancel your daily sessions posting schedule if it has not already occurred today.</p>
            </span>
        </div>

        <!-- Agreement -->
        <span class="p-1 w-full bg-zinc-700/70 rounded-md flex flex-row gap-0 items-center justify-start" :class="{'ring-red-400/30 ring-2' : understandsWarningsCheckedShowRequired}">
            <Checkbox id="warningCheckbox" class="m-1 self-start" size="small" input-id="understandsEarlyPostWarning" v-model="understandsWarningsChecked" binary @update:model-value="understandsWarningsCheckedShowRequired = false"/>
            <label class="text-sm opacity-80" for="understandsEarlyPostWarning" :class="{'animate-pulse' : understandsWarningsCheckedShowRequired}"> I understand these warnings and wish to proceed.</label>              
        </span>
        </div>

        <p v-if="understandsWarningsCheckedShowRequired" class="mt-3 text-red-700/70 font-semibold text-sm"> You must confirm you understand the warnings before proceeding. </p>

        <!-- Actions/Buttons -->
        <div class="gap-7 mt-3 p-2 flex flex-row justify-center items-center content-center flex-wrap">

            <!-- Cancel -->
            <Button unstyled
            :disabled="postAttemptStatus > 1 && postAttemptStatus != 200"
            class="gap-1 p-1 px-2.5 bg-zinc-700 disabled:opacity-25 disabled:grayscale-10 disabled:scale-95 rounded-md hover:bg-[#4e4e57] flex flex-row justify-center items-center content-center flex-wrap active:scale-95 cursor-pointer transition-all"
            @click="$emit('closePanel')"
            >
                <ArrowBigLeftDashIcon :size="18" class="block" />
                <p class="font-semibold text-[15px]"> Cancel </p>
            </Button>

            <!-- Post Early -->
            <Button unstyled
            :disabled="postAttemptStatus > 1 && postAttemptStatus != 200"
            class="gap-1 p-1 px-2.5 bg-amber-700/70 disabled:opacity-25 disabled:grayscale-10 disabled:scale-95 rounded-md hover:bg-[] flex flex-row justify-center items-center content-center flex-wrap active:scale-95 cursor-pointer transition-all"
            :class="{
                'hover:bg-[#d8673bc5]': postAttemptStatus <= 200,
                '!bg-emerald-700': postAttemptStatus >= 200,
                '!bg-red-700': postAttemptStatus >= 300,
            }"
            @click="postSessionsEarlyAttempt()"
            >
                <Transition name="fade" :duration="0.3">
                    <LoaderIcon :size="18" class="animate-spin" v-if="postAttemptStatus == 100" />
                    <ClockArrowDownIcon v-else="postAttemptStatus !== 100" :size="18" />
                </Transition>
                <p class="font-semibold text-[15px]"> Post NOW </p>
            </Button>

        </div>
         
    </div>
    </template>

</Dialog>
</template>

<style scoped>

    :deep()#warningCheckbox{
        --p-checkbox-checked-background: var(--color-amber-700) !important;
        --p-checkbox-checked-hover-background: var(--color-amber-700) !important;
        --p-checkbox-checked-border-color: var(--color-amber-700) !important;
        --p-checkbox-checked-hover-border-color: var(--color-amber-700) !important;
        --p-checkbox-checked-active-border-color: var(--color-amber-700) !important;
    }

</style>