<script lang="ts" setup>
    // Imports:
    // @ts-ignore
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { date, string, z } from 'zod'
    import { DailySignupPostTime, GuildData, SessionRole, SessionSchedule } from '@sessionsbot/api-types';
    import { FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { CalendarClockIcon, Clock4Icon, ExternalLinkIcon, HardHatIcon, Layers2Icon, LetterTextIcon, PlusCircleIcon, Trash2Icon, UserCircleIcon, XIcon } from 'lucide-vue-next';
    import { PopoverMethods, useConfirm } from 'primevue';
    import roleDescriptionPopover from './roleDescriptionPopover.vue'
    import NewRolePopover from './newRolePopover.vue';
    import { createSessionSchedule, deleteSessionSchedule, updateSessionSchedule } from '@/utils/modules/backendApi';
    import { toaster } from '@/utils/defaultExports';
    import { POSITION } from 'vue-toastification';
    import PricingLimits from '@/utils/modules/pricingLimits';

    const confirm = useConfirm();
    

    // Incoming Props:
    const props = defineProps<{
        viewCreateSchedulePanel: boolean, // controls main visibility
        editingScheduleId: string | null, // determines schedule id to edit/view
        guildSelectedData: GuildData, // cached guild data modifying
        actionMethod: 'EDIT' | 'CREATE' // current 'action method' (edit or create schedule)
    }>();

    // Outgoing Emits:
    const emits = defineEmits(['closePanel', 'updateDashboard', 'switchToCreate']);

    // Schedule Form Ref:
    const newScheduleForm : Ref<FormInstance> = ref(null) 

    // Schedule Days of Week:
    const scheduleDaysOptions = ref([
        ['S', 'sunday'],
        ['M', 'monday'],
        ['T', 'tuesday'],
        ['W', 'wednesday'],
        ['T', 'thursday'],
        ['F', 'friday'],
        ['S', 'saturday'],
    ]);
    const scheduleDaysSelected = ref([]);
    const toggleDaySelection = (dayName:string) => {
        if(scheduleDaysSelected.value.includes(dayName)){ // remove:
            const deleteIndex = scheduleDaysSelected.value.findIndex((elm) => elm == dayName)
            if (deleteIndex == -1) return console.warn('No delete index | -1')
            scheduleDaysSelected.value.splice(deleteIndex, 1)
        } else { // add:
            scheduleDaysSelected.value.push(dayName)
        }
        // Update form value:
        newScheduleForm.value.setFieldValue('sessionDays', scheduleDaysSelected.value)
    };

    // Static Schedule Roles Data:
    const scheduleRoles = ref<SessionRole[]> ([]);

    // Change/update role description fn:
    const changeRoleDesc = (roleIndex:number, newDesc:string) => {
        // console.log('NEW DESC',roleIndex, newDesc);
        scheduleRoles.value[roleIndex].roleDescription = newDesc;
        // console.log('Saved desc:')
        // console.log(scheduleRoles.value[roleIndex].roleDescription)
    }
    // Delete sch role fn:
    const deleteSchRole = (roleIndex:number) => {
        // console.log('deleting role at index:', roleIndex);
        scheduleRoles.value.splice(roleIndex, 1)
        // console.log(scheduleRoles.value)
    }

    // roleDescPopoverRef
    const roleDescPopoverRef = ref<PopoverMethods>()
    const selectedRoleIndex = ref() // index number passed to role desc form
    // newRolePopoverRef
    const newRolePopoverRef = ref<PopoverMethods>()
    const innerNewRolePopoverRef = ref<InstanceType<typeof NewRolePopover>>()

    async function startRoleCreate(e:Event) {
        // check for max roles:
        if(scheduleRoles.value?.length >= PricingLimits.FREE_PLAN.MAX_ROLES) {
            return toaster.warning('Cannot add anymore roles to this schedule! (Max: 3 Roles)'); 
        }

        // open create role panel:
        newRolePopoverRef.value.show(e)
    }

    // Duplicate role data/form fn:
    async function duplicateRoleData(e:Event, roleData:SessionRole) {
        // check for max roles:
        if(scheduleRoles.value?.length >= PricingLimits.FREE_PLAN.MAX_ROLES) {
            return toaster.warning('Cannot add anymore roles to this schedule! (Max: 3 Roles)'); 
        }

        // Show new role form:
        newRolePopoverRef.value.show(e); 

        await nextTick();
        await nextTick();

        // Assign form values:
        innerNewRolePopoverRef.value.newRoleFormRef.setValues({
            roleName: roleData.roleName,
            roleDescription: roleData.roleDescription,
            roleEmoji: roleData.roleEmoji,
            roleCapacity: roleData.roleCapacity
        })
    }

    // Confirm Delete Schedule:
    const deletionLoading = ref(false)
    const confirmDeleteSchedule = () => {
        confirm.require({
            group: 'headless',
            header: 'Delete Schedule?',
            message: 'Are you sure you want to proceed? This cannot be undone!',
        })
    }
    // Attempt Delete Schedule:
    const attemptDeleteSchedule = async (closeCallback) => {
        // 0. Prepare
        deletionLoading.value = true
        // 1. Attempt delete
        const results = await deleteSessionSchedule(props.guildSelectedData?.guildGeneral?.id, props.editingScheduleId)
        // 2. Read results
        if(results.success) { // Succeeded:
            // Alert & Refresh data:
            toaster.success('Schedule deleted!',{position: POSITION.TOP_CENTER})
            emits('updateDashboard', true)
        } else { // Errored:
            toaster.error('Error deleting schedule, please try again!', {position: POSITION.TOP_CENTER})
        }
        // 3. Close / mark finished
        deletionLoading.value = false
        closeCallback()
    }

    // Attempt Duplicate Schedule
    const createScheduleDuplicate = async () => {
        // Check for max:
        if(props.guildSelectedData.guildDatabaseData?.sessionSchedules?.length >= PricingLimits.FREE_PLAN.MAX_SCHEDULES){
            return toaster.warning(`Cannot duplicate, Maximum schedules reached! (max: ${PricingLimits.FREE_PLAN.MAX_SCHEDULES})`);
        } else { // allowed:
            emits('switchToCreate');
        }
    }
    

    // Form Resolver:
    const resolver = zodResolver(
        z.object({
            sessionTitle: string({message: 'Please enter a Title'}).trim().min(3, 'Title is too short (min: 3)').max(26, 'Title is too long (max: 26)'),
            sessionUrl: string({message: 'Please enter a URL'}).trim().url().min(5, 'Url is too short (min: 5)').startsWith('https://', 'Url must start with https://'),
            sessionTime: date({message: 'Invalid Time'}),
            sessionDays: z.array(z.string()).min(1, "Select at least one day")
        })
    )

    // Schedule Form Submission:
    const submissionLoading = ref(false);
    const submitGuildSchedule = async (f:FormSubmitEvent) => {

        if(f?.valid){ // Valid Submission:
            submissionLoading.value = true

            // 1. Prepare values:
            // Generate/Get Session Id:
            let scheduleId : string;
            if(props.actionMethod == 'CREATE') {
                scheduleId = 'shd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            } else { 
                const editingScheduleData = props.guildSelectedData.guildDatabaseData.sessionSchedules.find((shd) => shd.scheduleId == props.editingScheduleId)
                scheduleId = editingScheduleData.scheduleId;
            }
            // Add 'roles' to values:
            f.values['sessionRoles'] = scheduleRoles.value;
            // Create correct post time format:
            const rawSchDate:Date = f.values['sessionTime'];
            const schTimeFormat:DailySignupPostTime = {hours: rawSchDate.getHours(), minutes: rawSchDate.getMinutes()}
            // Finalize data
            const finalScheduleData : any = {
                sessionTitle: f.values['sessionTitle'],
                sessionUrl: f.values['sessionUrl'],
                roles: f.values['sessionRoles'],
                sessionDateDaily: schTimeFormat,
                daysOfWeek: f.values['sessionDays'],
                scheduleId: scheduleId
            }

            // 2. Attempt save/update:
            // console.log(finalScheduleData)
            const guildId = props.guildSelectedData?.guildGeneral?.id
            const results = props.actionMethod == 'CREATE' ? await createSessionSchedule(guildId, finalScheduleData) : await updateSessionSchedule(guildId, props?.editingScheduleId, finalScheduleData)

            // 3. Finished:
            if(results.success) { // Succeeded:
                toaster.success('Saved Schedule!', {position: POSITION.TOP_CENTER});
                // Close panel & refresh data:
                emits('closePanel');
                emits('updateDashboard', true)
            } else { // Errored:
                toaster.error('Error updating schedule, please try again!', {position: POSITION.TOP_CENTER})
            }
            submissionLoading.value=false; 
        } else { // Invalid Submission:
            // console.warn('invalid data:', f?.states)
            return // invalid
        }
    }
    

    // On Mount - Reset / Detect Mode / Data:
    const initializePanel = () => {
        // Reset Sch Roles:
        scheduleRoles.value = [];
        scheduleDaysSelected.value = [];

        // Check/load editing schedule:
        if(props.actionMethod == 'EDIT'){ 
            // Editing Schedule:
            // Get / Prepare Data:
            const scheduleData = props.guildSelectedData.guildDatabaseData.sessionSchedules.find((shd) => shd.scheduleId == props.editingScheduleId)
            // Shd Time Date:
            let shdTimeDate = new Date()
            shdTimeDate.setHours(scheduleData.sessionDateDaily.hours, scheduleData.sessionDateDaily.minutes, 0, 0)
            // Shd Days of Week:
            const shdDaysOfWeek = scheduleData?.daysOfWeek || ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            // Set form values:
            newScheduleForm.value.setValues({
                sessionTitle: scheduleData?.sessionTitle,
                sessionUrl: scheduleData?.sessionUrl,
                sessionTime: shdTimeDate,
                sessionRoles: scheduleData.roles,
                sessionDays: shdDaysOfWeek
            })

            // Update static values:
            scheduleRoles.value = JSON.parse(JSON.stringify(scheduleData.roles));
            scheduleDaysSelected.value = JSON.parse(JSON.stringify(shdDaysOfWeek));

        } else { 
            // Creating schedule:
            // Select all days of week - default
            newScheduleForm.value.setFieldValue('sessionDays', ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])
            scheduleDaysSelected.value = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        }
    }

</script>

<template>
<Dialog @show="initializePanel" v-bind:visible="viewCreateSchedulePanel" :draggable="false" :modal="true" class="max-w-[80%] !max-h-150">
    
    <!-- Panel Header -->
    <template #header>
        <div class="flex flex-row-reverse w-full justify-between items-start">
            <!-- Close Button -->
            <Button hidden unstyled @click="emits('closePanel');" class="hover:bg-white/15 p-2 rounded-full">
                <XIcon />
            </Button>

            <!-- Title/Heading -->
            <div class="flex flex-nowrap flex-row gap-1 content-center w-full">
                <CalendarClockIcon />
                <p v-if="props.actionMethod == 'CREATE'" class="text-xl font-bold text-start"> New Schedule </p>
                <p v-if="props.actionMethod == 'EDIT'" class="text-xl font-bold text-start"> Edit Schedule </p>
                
            </div>
        </div>
    </template>

    <!-- Panel Contents -->
    <template #default>
    <Form v-slot="$form" ref="newScheduleForm" :resolver @submit="submitGuildSchedule" class="flex flex-col flex-wrap gap-4 px-7 p-1 overflow-scroll">
        
        <!-- Session/Sch Title: -->
        <section class="flex flex-col gap-1">
            <IftaLabel>
                <InputText
                    name="sessionTitle"
                    fluid
                    class="!max-w-64"
                    placeholder="Example Title"
                    :maxlength="26"
                >
                </InputText>
                <label for="sessionTitle" class="flex gap-0.75 items-center justify-center content-center"> 
                    <LetterTextIcon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Schedule Title: </p>
                </label>
            </IftaLabel>
            <Message v-if="$form.sessionTitle?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.sessionTitle.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>
        </section>


        <!-- Session/Sch URL: -->
        <section class="flex flex-col gap-1">
            <IftaLabel>
                <InputText
                    name="sessionUrl"
                    placeholder="https://sessionsbot.fyi"
                    class="!max-w-64"
                    fluid
                >
                </InputText>
                <label for="sessionUrl" class="flex gap-0.75 items-center justify-center content-center"> 
                    <ExternalLinkIcon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Schedule Location: (url) </p>
                </label>
            </IftaLabel>
            <Message v-if="$form.sessionUrl?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.sessionUrl.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>
        </section>


        <!-- Session/Sch Time: -->
        <section class="flex flex-col gap-1">
            <IftaLabel>
                <DatePicker
                name="sessionTime" 
                fluid
                class="!max-w-64"
                time-only
                :manual-input=false
                :step-minute="5"
                hour-format="12"
                placeholder="5:30 pm"
                />
                <label for="sessionTime" class="flex gap-0.75 items-center justify-center content-center"> 
                    <Clock4Icon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Schedule Time: </p>
                </label>
            </IftaLabel>
            <Message v-if="$form.sessionTime?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.sessionTime.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>
        </section>

        <!-- Session/Sch Days of Week: -->
        <section class="flex flex-col gap-1">
            
            <FormField v-slot="$field" name="sessionDays" :initial-value="[]">
            <!-- Day Selection Input: -->
            <div class="bg-muted rounded-md border-1 border-zinc-600 max-w-80 min-w-64 min-h-20 w-fit flex flex-col flex-wrap justify-start items-center content-center" :class="{'!border-red-300 !text-red-400': $form.sessionDays?.invalid}">

                <!-- Sch Days Heading -->
                <div class="flex flex-row gap-1 flex-wrap items-center justify-between content-center w-full p-3 pt-2 pr-1.5">
                    <div class="flex flex-row gap-1 flex-wrap items-center justify-start content-center w-fit text-[0.75rem] text-zinc-400" :class="{'!text-red-400': $form.sessionDays?.invalid}">
                        <CalendarClockIcon :size="13.5" class="!inline !pt-0.25"/>
                        <p> Schedule Days </p>
                    </div>
                </div>

                <!-- Days Selection: -->
                <div class="flex gap-1 w-fit flex-row justify-center pt-0 pb-3 items-center content-center flex-wrap">
                    
                    <Button
                        unstyled
                        class="p-1 m-0.5 size-6 text-[14px] rounded-md bg-white/15 flex items-center justify-center text-center"
                        v-for="(value, index) in scheduleDaysOptions"
                        :title="value[1]"
                        :key="index"
                        @click="(e)=>toggleDaySelection(value[1])"
                        :class="scheduleDaysSelected.includes(value[1]) 
                            ? '!bg-emerald-600/80 text-white' 
                            : 'text-gray-300 hover:bg-white/30'
                        "
                    >
                        {{ value[0] }}
                    </Button>
                    
                </div>

            </div>

            <!-- Validation Messages: -->
            <Message v-if="$form.sessionDays?.invalid" severity="error" class="opacity-75 pt-1" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.sessionDays.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>
            </FormField>

        </section>

        <!-- Session/Sch Roles -->
        <section class="flex flex-col gap-1">

            <FormField v-model="scheduleRoles" v-slot="$field" name="sessionRoles" :initial-value="[]">
            <div class="bg-muted rounded-md border-1 border-zinc-600 max-w-80 min-w-64 min-h-20 w-full flex flex-col flex-wrap justify-start items-center content-center">

                <!-- Sch Roles Heading -->
                <div class="flex flex-row gap-1 flex-wrap items-center justify-between content-center w-full p-3 pt-2 pr-1.5">
                    <div class="flex flex-row gap-1 flex-wrap items-center justify-start content-center w-fit text-[0.75rem] text-zinc-400">
                        <HardHatIcon :size="13.5" class="!inline !pt-0.25"/>
                        <p> Schedule Roles </p>
                        <p hidden class="text-[10px] italic"> (0/3) </p>
                    </div>

                    <!-- Add Role Button -->
                    <Button @click="(e)=>startRoleCreate(e)" unstyled class="flex justify-center items-center content-center rounded-md gap-0.75 w-fit h-fit py-[4px] px-1.25 bg-zinc-600/80 cursor-pointer">
                        <PlusCircleIcon class="ml-0.25" :size="12"/>
                        <p class="text-[10px] mx-0.5 font-stretch-85% font-medium leading-snug"> Add Role </p>
                    </Button>
                </div>

                <!-- Existing Roles -->
                <div class="flex gap-1 w-full flex-col justify-center pt-0 pb-3 items-center content-center flex-wrap">
                    
                    <!-- Role Info -->
                    <div v-if="scheduleRoles?.length" v-for="(role, key) in scheduleRoles" class="bg-black/2.5 w-[90%] min-w-fit border-1 border-zinc-600 gap-2.5 p-1 rounded-md flex flex-row flex-nowrap justify-between items-center content-center" :key="key">
                        <!-- Role Name/Emoji -->
                        <div title="Role Name" class="flex flex-row gap-0.75 text-sm justify-start text-nowrap leading-snug text-center items-center content-center flex-nowrap">
                            <p> {{role?.roleEmoji}} </p>
                            <p> {{role?.roleName}} </p>
                        </div>

                        <!-- Role Capacity -->
                        <div title="Role Capacity" class="flex flex-row gap-0.75 justify-end items-center content-center flex-nowrap">
                            <UserCircleIcon :size="10" />
                            <p class="text-[11px]"> {{ role?.roleCapacity }} </p>
                        </div>

                        <!-- Role Actions -->
                        <div class="flex flex-row gap-1 flex-nowrap justify-center items-center content-center">
                            <!-- View Desc -->
                            <Button @click="(e)=>{roleDescPopoverRef.toggle(e); selectedRoleIndex = key}" title="Role Description" unstyled class="flex justify-center w-5 h-5 items-center content-center rounded-md gap-0.75 py-0.5 px-0.75 bg-zinc-600/60 cursor-pointer">
                                <LetterTextIcon :size="12"/>
                            </Button>
                            <!-- Duplicate -->
                            <Button @click="(e)=>{ duplicateRoleData(e, role) }" unstyled title="Duplicate Role" class="flex justify-center w-5 h-5 items-center content-center rounded-md gap-0.75 py-0.5 px-0.75 bg-zinc-600/60 cursor-pointer">
                                <Layers2Icon :size="12"/>
                            </Button>
                            <!-- Delete -->
                            <Button @click="(e)=>{deleteSchRole(key)}" unstyled title="Delete Role" class="flex justify-center w-5 h-5 items-center content-center rounded-md gap-0.75 py-0.5 px-0.75 bg-rose-600/50 cursor-pointer">
                                <Trash2Icon :size="12"/>
                            </Button>
                        </div>

                    </div>

                    <p v-else class="text-xs text-white/80 mt-1 bg-zinc-900/50 py-0.5 p-1.25 rounded-md">
                        No role(s)...
                    </p>

                    <!-- Role Desc PopOver -->
                    <Popover ref="roleDescPopoverRef">
                    <roleDescriptionPopover :selectedScheduleData="{ roles: scheduleRoles }" :selectedRoleIndex="selectedRoleIndex"
                        @change-role-desc="changeRoleDesc" 
                        @close-desc-popover="()=> {roleDescPopoverRef.hide()}"/>
                    </Popover>

                    <!-- New Role PopOver -->
                    <Popover ref="newRolePopoverRef">
                        <NewRolePopover ref="innerNewRolePopoverRef" @close-popover="newRolePopoverRef.hide" :schedule-roles="scheduleRoles" />
                    </Popover>
                </div>

            </div>
            </FormField>
            

        </section>

        
        
    
    </Form>
    </template>

    <!-- Hide default close button -->
    <template #closebutton>
        <span hidden class="hidden w-px h-px" />
    </template>

    <!-- Panel Footer -->
    <template #footer>
        <!-- Footer/Buttons -->
        <section class="flex mt-1 items-center content-center justify-center gap-2 flex-wrap w-full p-1.5">

            <!-- Delete Sch Confirm -->
            <ConfirmDialog group="headless">
                <template #container="{ message, acceptCallback, rejectCallback }">
                    <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
                        <div class="rounded-full bg-rose-800 !grayscale-50 ring-2 ring-ring text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                            <Trash2Icon :size="60" />
                        </div>
                        <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                        <p class="mb-0">{{ message.message }}</p>
                        <div class="flex items-center gap-2 mt-6">
                            <Button label="Cancel" @click="rejectCallback" :disabled="deletionLoading" size="small" variant="outlined" severity="secondary"></Button>
                            <Button label="Delete" @click="(e)=>{attemptDeleteSchedule(acceptCallback)}" :loading="deletionLoading" size="small" variant="filled" class="!bg-rose-800 !grayscale-50 hover:brightness-125 !transition-all" severity="danger"></Button>
                        </div>
                    </div>
                </template>
            </ConfirmDialog>

            <!-- EDIT Schedule Buttons -->
            <div
                v-if="props.actionMethod=='EDIT'"
                class="flex flex-row gap-2 justify-start flex-1 items-center"
            >
                <!-- Delete Sch Button -->
                <Button @click="confirmDeleteSchedule()" unstyled class="bg-zinc-800 hover:bg-rose-800/80 !transition-all grayscale-50 w-10 h-10 flex justify-center items-center content-center flex-wrap cursor-pointer rounded-md">
                    <Trash2Icon :size="15" />
                </Button>

                <!-- Duplicate Schedule Button -->
                <Button @click="createScheduleDuplicate()" unstyled class="bg-zinc-800 hover:bg-zinc-700 !transition-all grayscale-50 w-10 h-10 flex justify-center items-center content-center flex-wrap cursor-pointer rounded-md">
                    <Layers2Icon :size="15" />
                </Button>
            </div>
            
            <!-- Submit/Cancel Buttons -->
            <div class="flex flex-1 flex-row gap-2 justify-end items-center">
                <!-- Cancel Button -->
                <Button @click="emits('closePanel'); newScheduleForm.reset();" :disabled="submissionLoading" severity="secondary" class="w-fit" label="Cancel" />
                <!-- Submit Button -->
                <Button @click="newScheduleForm.submit();" :loading="submissionLoading" type="submit" severity="success" class="w-fit !bg-emerald-600 !border-emerald-700/50 hover:brightness-110 !transition-all" label="Save" />
            </div>
        </section>

    </template>

</Dialog>
</template>
