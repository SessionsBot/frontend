<script lang="ts" setup>
    // Imports:
    // @ts-ignore
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { array, date, string, z } from 'zod'
    import { DailySignupPostTime, GuildData, SessionRole, SessionSchedule } from '@sessionsbot/api-types';
    import { FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { CalendarClockIcon, Clock4Icon, ExternalLinkIcon, HardHatIcon, Layers2Icon, LetterTextIcon, PlusCircleIcon, Trash2Icon, UserCircle2Icon, UserCircleIcon, XIcon } from 'lucide-vue-next';
    import { DateTime } from 'luxon';
    import { ConfirmDialogSlots, PopoverMethods, useConfirm } from 'primevue';
    import roleDescriptionPopover from './roleDescriptionPopover.vue'
    import NewRolePopover from './newRolePopover.vue';
    import { createSessionSchedule, deleteSessionSchedule, updateSessionSchedule } from '@/utils/modules/backendApi';
    import { auth, toaster } from '@/utils/defaultExports';
    import { POSITION } from 'vue-toastification';
    


    // Incoming Props:
    const props = defineProps<{
        viewCreateSchedulePanel: boolean,
        guildSelectedData: GuildData,
    }>();

    // Outgoing Emits:
    const emits = defineEmits(['closePanel', 'updateDashboard']);

    const newScheduleForm : Ref<FormInstance> = ref(null) // Ref to schedule data form within panel

    // Static Schedule Roles Data:
    const scheduleRoles = ref<SessionRole[]> ([]);

    // Change/update role description fn:
    const changeRoleDesc = (roleIndex:number, newDesc:string) => {
        // console.log('NEW DESC',roleIndex, newDesc);
        scheduleRoles.value[roleIndex].roleDescription = newDesc;
        // console.log('Saved desc:')
        // console.log(scheduleRoles.value[roleIndex].roleDescription)
    }

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

    // Duplicate role data/form fn:
    async function duplicateRoleData(e:Event, roleData:SessionRole) {
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
    

    // Form Resolver:
    const resolver = zodResolver(
        z.object({
            sessionTitle: string().trim().min(5).max(26),
            sessionUrl: string().trim().url().min(5),
            sessionTime: date({message: 'Invalid Date'}),
        })
    )

    // Form Sch Edit Submission:
    const submissionLoading = ref(false);
    const submitGuildSchedule = async (f:FormSubmitEvent) => {
        // console.info('CREATE SCHEDULE FORM SUBMIT', f);
        if(f?.valid){ // Valid Submission:
            submissionLoading.value = true

            // 1. Prepare values:
            // Generate Session Id:
            const scheduleId = 'shd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            // Add 'roles' to values:
            f.values['sessionRoles'] = scheduleRoles.value;
            // Create correct post time format:
            const rawSchDate:Date = f.values['sessionTime']
            const schTimeFormat:DailySignupPostTime = {hours: rawSchDate.getHours(), minutes: rawSchDate.getMinutes()}
            // Finalize data
            const finalScheduleData : SessionSchedule = {
                sessionTitle: f.values['sessionTitle'],
                sessionUrl: f.values['sessionUrl'],
                roles: f.values['sessionRoles'],
                sessionDateDaily: schTimeFormat,
                scheduleId: scheduleId
            }

            // 2. Attempt save:
            const results = await createSessionSchedule(props.guildSelectedData?.guildGeneral?.id, finalScheduleData)

            // 3. Finished:
            // console.log('results', results)
            if(results.success) { // Succeeded:
                toaster.success('Schedule created!', {position: POSITION.TOP_CENTER});
                // Close panel & refresh data:
                emits('closePanel');
                emits('updateDashboard', true)
            } else { // Errored:
                toaster.error('Error updating schedule, please try again!', {position: POSITION.TOP_CENTER})
            }
            submissionLoading.value=false; 
        } else { // Invalid Submission:
            return // invalid
        }
    }

</script>

<template>
<Dialog v-bind:visible="viewCreateSchedulePanel" :draggable="false" :modal="true" class="max-w-[80%] !max-h-150">
    
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
                <p class="text-xl font-bold text-start"> New Schedule </p>
                
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
                    placeholder="https://www.roblox.com/games"
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

        <!-- Session/Sch Roles -->
        <section class="flex flex-col gap-1">
        
            <div class="bg-muted rounded-md border-1 border-zinc-600 max-w-80 min-w-64 min-h-20 w-fit flex flex-col flex-wrap justify-start items-center content-center">

                <!-- Sch Roles Heading -->
                <div class="flex flex-row gap-1 flex-wrap items-center justify-between content-center w-full p-3 pt-2 pr-1.5">
                    <div class="flex flex-row gap-1 flex-wrap items-center justify-start content-center w-fit text-[0.75rem] text-zinc-400">
                        <HardHatIcon :size="13.5" class="!inline !pt-0.25"/>
                        <p> Schedule Roles </p>
                        <p hidden class="text-[10px] italic"> (0/3) </p>
                    </div>

                    <!-- Add Role Button -->
                    <Button @click="(e)=>newRolePopoverRef.show(e)" unstyled class="flex justify-center items-center content-center rounded-md gap-0.75 w-fit h-fit py-[3.5px] px-0.75 bg-zinc-900/80 cursor-pointer">
                        <PlusCircleIcon class="ml-0.25" :size="12"/>
                        <p class="text-[10px] font-stretch-85% font-medium leading-snug"> Add Role </p>
                    </Button>
                </div>

                <!-- Existing Roles -->
                <div class="flex gap-1 w-fit flex-row justify-center pt-0 pb-3 items-center content-center flex-wrap">
                    
                    <!-- Role Info -->
                    <div v-if="scheduleRoles?.length" v-for="(role, key) in scheduleRoles" class="bg-zinc-900/60 w-[90%] min-w-fit border-1 border-zinc-600 gap-2.5 p-1 rounded-md flex flex-row flex-nowrap justify-between items-center content-center" :key="key">
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
        <section class="flex mt-1 justify-end items-center content-center gap-2 flex-wrap w-full p-1.5">
            <!-- Cancel Button -->
            <Button @click="emits('closePanel'); newScheduleForm.reset();" :disabled="submissionLoading" severity="secondary" class="w-fit" label="Cancel" />
            <!-- Submit Button -->
            <Button @click="newScheduleForm.submit();" :loading="submissionLoading" type="submit" severity="success" class="w-fit" label="Save" />
        </section>

    </template>

</Dialog>
</template>