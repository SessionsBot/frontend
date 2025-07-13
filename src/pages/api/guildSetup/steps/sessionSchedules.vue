<script setup>
    // Imports:
    import { BanIcon, CalendarPlus2Icon, Clock4Icon, ExternalLinkIcon, FileQuestionIcon, LetterTextIcon, PencilIcon, PlusIcon, SmilePlusIcon, Trash2Icon, UserLockIcon, UsersIcon, XIcon } from 'lucide-vue-next';
    import { computed, ref, watch } from 'vue';

    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod'

    // Default Session Date:
    let defaultSessionDate = new Date()
    defaultSessionDate.setHours(12,0,0,0)

    // Incomming Props:
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
    const moreSchedulesAllowed = computed(() => currentSchedules.value?.length <= 14)
    const showAddScheduleMessage = ref(false)

    // New Role for Schedule Form:
    const newRoleForm = {
        newRolePO: ref(),

        // New Schedule -- New Role(s):
        toggleNewRolePO: (event) => {
            // Hide 'Add Role' msg if displayed:
            newScheduleForm.showRolesRequiredText.value = false

            // Open/Close 'Add Role' Panel:
            return newRoleForm.newRolePO.value.show(event);
        },

        // Reactive/Updated Form Values:
        newRoleValues: {
            title: ref(''),
            description: ref(''),
            emoji: ref(''),
            capacity: ref(1),
        },

        // More Roles Allowed Boolean:
        moreRolesAllowed: computed(() => newScheduleForm.scheduleRoles.value?.length <= 4) ,

        // Reset Form Inputs/Errors:
        resetNewRolePO: () => {
            newRoleForm.newRoleValues.title.value = ''
            newRoleForm.newRoleValues.description.value = ''
            newRoleForm.newRoleValues.emoji.value = ''
            newRoleForm.newRoleValues.capacity.value = 1
            newRoleForm.inputErrors.value = {}
        },

        //  Form Resolver:
        newRoleResolver: z.object({
            title: z.string().min(1, { message: 'Role name required!' }),
            description: z.string().min(5, { message: 'Role description required!' }),
            emoji: z.string().emoji({ message: 'Invalid emoji!' }),
            capacity: z.number().min(1).max(10)
        }),

        // Validation Checks:
        checkNewRoleFields() {
            const result = newRoleForm.newRoleResolver.safeParse({
                title: newRoleForm.newRoleValues.title.value,
                description: newRoleForm.newRoleValues.description.value,
                emoji: newRoleForm.newRoleValues.emoji.value,
                capacity: Number(newRoleForm.newRoleValues.capacity.value)
            });

            const resultData = result?.error?.formErrors?.fieldErrors
            // handle errors, e.g. show messages
            newRoleForm.inputErrors.value = resultData

            // return results
            return{ success: result.success, errors: resultData}
        },

        // Reactive Object of Current Input Errors:
        inputErrors: ref({}),

        // Form Submit - New Role:
        newRoleSubmit: () => {
            const inputValidation = newRoleForm.checkNewRoleFields()

            // console.info('Role Submit:', inputValidation)

            // Check for duplicate name:
            const existingRoleName = newScheduleForm.scheduleRoles.value.find((item) => item?.title == newRoleForm.newRoleValues.title.value)
            if(existingRoleName){
                // Duplicate role name:
                if (!newRoleForm.inputErrors.value?.title){
                    // Safe add error:
                    newRoleForm.inputErrors.value = {
                        ...newRoleForm.inputErrors.value,
                        title: ['No duplicate role names!']
                    }
                }else {
                    newRoleForm.inputErrors.value.title = 'No duplicate role name'
                }
                
            }

            // Check for full validation:
            if(inputValidation.success && !existingRoleName){

                // Success - Add Role:
                newScheduleForm.scheduleRoles.value.push(
                    {
                        roleName: newRoleForm.newRoleValues.title.value,
                        roleDescription: newRoleForm.newRoleValues.description.value,
                        roleEmoji: newRoleForm.newRoleValues.emoji.value,
                        roleCapacity: newRoleForm.newRoleValues.capacity.value,
                    }
                )
                // Reset inputs:
                newRoleForm.newRoleValues.title.value = ''
                newRoleForm.newRoleValues.description.value = ''
                newRoleForm.newRoleValues.emoji.value = ''
                newRoleForm.newRoleValues.capacity.value = 1

                // Close Pop-Over:
                newRoleForm.newRolePO.value.hide()
            }
        },
        
    }


    // Top Form:
    const newScheduleFormRef = ref(null);
    const newScheduleForm = {
        
        // Initial Values:
        initialValues: {
            sessionTitle: 'Example Title', // Example Title
            sessionUrl: 'https://www.roblox.com/games', // https://www.roblox.com/games
            sessionTime: defaultSessionDate, //defaultSessionDate,
        },


        // Array of roles assigned to new schedule:
        scheduleRoles: ref([]),



        // Boolean to show 'Role Required' input error:
        
        

        // Toggles visibility for '1+ Roles Required' msg:
        showRolesRequiredText: ref(false),


        // Top Form Validation:
        mainResolver: zodResolver(
            z.object({
                sessionTitle: z.string().trim().min(1, {message: 'Invalid Session Title!'}),
                sessionUrl: z.string().url({message: 'Invalid URL! (include full https address)'}),
                sessionTime: z.date({message: 'Invalid Post Time!'}).refine(
                    val => val instanceof Date && !isNaN(val),
                    {message: 'Session Time is required!'}
                ),                 
            })
        ),


        // Top Form Submission:
        submit: (f) => {

            // Assign Session Roles to form:
            f['sessionRoles'] = newScheduleForm.scheduleRoles.value;

            
            // Confirm NO Duplicate/Unspaced Sessions:
            const overlappingSession = currentSchedules.value.find(sch => {
                const minimumTimeGap = 15 * 60 * 1000; // 15 minutes in ms
                const newSchTime = new Date(f?.values.sessionTime)?.getTime();

                const isTooCloseToAnotherSession = currentSchedules.value.some(sch => {
                    const thisSchTime = new Date(sch?.sessionTime)?.getTime();
                    const schTimeGap = Math.abs(newSchTime - thisSchTime);
                    
                    
                    return schTimeGap < minimumTimeGap;
                });

                return isTooCloseToAnotherSession
            })


            // If Overlapping Session:
            if(overlappingSession){
                // Un-allowed Session Time:
                // error/notification:
                newScheduleFormRef.value.states.sessionTime.invalid = true
                newScheduleFormRef.value.states.sessionTime.errors = [{message: 'Session Time too close to another!'}]
                return // Abort
            }
            

            // Confirm Roles:
            if(newScheduleForm.scheduleRoles.value.length <= 0){
                // No roles - show invalid:
                newScheduleForm.showRolesRequiredText.value = true
                return // Abort
            }


            // Confirm Inputs:
            if(f?.valid){
                // Valid Input - Add new schedule to list:
                currentSchedules.value.push(
                    {
                        sessionTitle: f?.values?.sessionTitle,
                        sessionDateDaily: f?.values?.sessionTime,
                        sessionUrl: f?.values?.sessionUrl,
                        roles: f?.sessionRoles,
                    }
                )

                // Close New Schedule Form:
                newScheduleForm.scheduleRoles.value = [];
                creatingNewSchedule.value = false


            }else {
                // Invalid Submission:
                return // Abort
            }
        }
    }


    // Submit ALL Schedules to Draft:
    const submiteScheduleStep = () => {
        if(currentSchedules.value?.length <= 0){
            // No schedules:
            return showAddScheduleMessage.value = true
        }else{
            // Send schedules & procced:
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


        <!-- Create Schedule Dialog/Form: -->
        <Dialog
            v-model:visible="creatingNewSchedule"
            modal 
            :draggable="true"
            :closable="true"
            style="width: 35rem; max-width: 70%;"
            
        >

            <!-- Creating Schedule Header -->
            <template #header>
                <div class="!flex flex-row !gap-1.25 !m-0 h-fit font-bold text-lg">
                <CalendarPlus2Icon class="self-center justify-center"/>
                New Session Schedule:
                </div>
            </template>


            <!-- Creating Schedule Form/Details -->
            <template #default>
                <Form 
                    ref="newScheduleFormRef"
                    v-slot="$form" 
                    :resolver="newScheduleForm.mainResolver" 
                    :initialValues="newScheduleForm.initialValues"
                    @submit="newScheduleForm.submit" 
                    class="!flex flex-col !gap-4.5 font-bold text-sm"
                >

                    <!-- Sub-heading Divider -->
                    <div class="flex gap-2 flex-row w-full justify-center items-center">
                        <div class="h-[2px] bg-zinc-700 flex flex-1" />
                        <p class="text-zinc-500"> Details: </p>
                        <div class="h-[2px] bg-zinc-700 flex flex-1" />
                    </div>


                    <!-- Session Title: -->
                    <IftaLabel>
                        <InputText
                            name="sessionTitle"
                            maxlength="26"
                            fluid
                            placeholder="Example Title"
                        >
                        </InputText>
                        <label for="sessionUrl" class="flex gap-0.75 items-center justify-center content-center"> 
                            <LetterTextIcon size="14" class="!inline !pt-0.25"/>
                            <p class="!inline"> Session Title: </p>
                        </label>
                    </IftaLabel>
                    <Message v-if="$form.sessionTitle?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.sessionTitle.errors" class="text-red-300" :key="index"> {{ error.message }}
                            </li>
                        </ul>
                    </Message>


                    <!-- Session URL: -->
                    <IftaLabel>
                        <InputText
                            name="sessionUrl"
                            placeholder="https://www.roblox.com/games"
                            maxlength="30"
                            fluid
                        >
                        </InputText>
                        <label for="sessionUrl" class="flex gap-0.75 items-center justify-center content-center"> 
                            <ExternalLinkIcon size="14" class="!inline !pt-0.25"/>
                            <p class="!inline"> Game / Location: (url) </p>
                        </label>
                    </IftaLabel>
                    <Message v-if="$form.sessionUrl?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.sessionUrl.errors" class="text-red-300" :key="index"> {{ error.message }}
                            </li>
                        </ul>
                    </Message>


                    <!-- Session Date/Time: -->
                    <IftaLabel>
                        <DatePicker
                        name="sessionTime" 
                        placeholder="12:00 pm"
                        fluid
                        time-only
                        :step-minute="5"
                        hour-format="12"
                        />
                        <label for="sessionTime" class="flex gap-0.75 items-center justify-center content-center"> 
                            <Clock4Icon size="14" class="!inline !pt-0.25"/>
                            <p class="!inline"> Daily Time: </p>
                        </label>
                    </IftaLabel>
                    <Message v-if="$form.sessionTime?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.sessionTime.errors" class="text-red-300" :key="index"> {{ error.message }}
                            </li>
                        </ul>
                    </Message>

                    
                    <!-- Sub-heading Divider -->
                    <div class="flex gap-2 flex-row w-full justify-center items-center">
                        <div class="h-[2px] bg-zinc-700 flex flex-1" />
                        <p class="text-zinc-500"> Roles: </p>
                        <div class="h-[2px] bg-zinc-700 flex flex-1" />
                    </div>



                    <!-- New Role Button: -->
                    <Button  
                        v-if="newScheduleForm.scheduleRoles.value.length >= 1"
                        :disabled="!newRoleForm.moreRolesAllowed.value"
                        severity="secondary"
                        class="!gap-1"
                        @click="newRoleForm.toggleNewRolePO"
                    >
                        <PlusIcon v-if="newRoleForm.moreRolesAllowed.value" size="20"/>
                        <p v-if="newRoleForm.moreRolesAllowed.value"> New Role </p>

                        <BanIcon v-if="!newRoleForm.moreRolesAllowed.value" size="19"/>
                        <p v-if="!newRoleForm.moreRolesAllowed.value"> Max Roles </p>

                    </Button>

                    <!-- New Role Pop-Over / Creation: -->
                    <Popover 
                        :ref="newRoleForm.newRolePO"
                    >
                    <div class="flex flex-col gap-2 justify-center items-center">

                        <!-- Role Name -->
                        <IftaLabel>
                            <InputText
                            v-model:modelValue="newRoleForm.newRoleValues.title.value"
                            maxlength="14"
                            fluid
                            >
                            </InputText>
                            <label class="flex gap-0.75 items-center justify-center content-center"> 
                                <LetterTextIcon size="14" class="!inline !pt-0.25"/>
                                <p class="!inline"> Role Name </p>
                            </label>
                        </IftaLabel>


                        <!-- Role Description -->
                        <IftaLabel>
                            <InputText
                            v-model:modelValue="newRoleForm.newRoleValues.description.value"
                            maxlength="50"
                            minlength="5"
                            fluid
                            >
                            </InputText>
                            <label class="flex gap-0.75 items-center justify-center content-center"> 
                                <LetterTextIcon size="14" class="!inline !pt-0.25"/>
                                <p class="!inline"> Role Description </p>
                            </label>
                        </IftaLabel>


                        <!-- Role Emoji -->
                        <IftaLabel>
                            <InputText
                            v-model:modelValue="newRoleForm.newRoleValues.emoji.value"
                            maxlength="20"
                            fluid
                            >
                            </InputText>
                            <label class="flex gap-0.75 items-center justify-center content-center"> 
                                <SmilePlusIcon size="14" class="!inline !pt-0.25"/>
                                <p class="!inline"> Role Emoji </p>
                            </label>

                            <Button 
                                label="🏷️"
                                title="Default Emoji"
                                unstyled
                                class="!absolute right-2 top-4.5 grayscale-75"
                                @click="(e) => {
                                    newRoleForm.newRoleValues.emoji.value = '💼'
                                }"
                            />

                        </IftaLabel>


                        <!-- Role Capacity -->
                        <IftaLabel>
                            <InputNumber
                            v-model:modelValue="newRoleForm.newRoleValues.capacity.value"
                            maxlength="2"
                            fluid
                            :max="10"
                            :min="1"
                            >
                            </InputNumber>
                            <label class="flex gap-0.75 items-center justify-center content-center"> 
                                <UsersIcon size="14" class="!inline !pt-0.25"/>
                                <p class="!inline"> Role Capacity </p>
                            </label>
                        </IftaLabel>

                        <!-- Submit/Reset Buttons -->
                        <div class="flex flex-wrap flex-row gap-2 justify-center items-center">
                            <Button
                            @click="newRoleForm.resetNewRolePO" 
                            unstyled
                            class="bg-zinc-800 rounded-md hover:brightness-150 font-semibold text-sm text-zinc-300 transition-all p-2 px-3">
                                Reset
                            </Button>

                            <Button 
                            unstyled
                            @click="newRoleForm.newRoleSubmit"
                            class="bg-emerald-800 rounded-md hover:brightness-150 font-semibold text-sm text-zinc-300 transition-all p-2 px-3">
                                Add Role
                            </Button>
                        </div>

                        <!-- Invalid Input Messages: -->
                            <div class="flex flex-col w-full gap-2 text-red-400 opacity-85">
                            <p
                            v-for="(value, key) in newRoleForm.inputErrors.value">

                            - {{ String(value).replace(['[', ']', '"'], '') }}
                            
                            </p>
                            </div>

                    </div>
                    </Popover>

                    <!-- Roles Table -->
                    <DataTable
                        showGridlines
                        :value="newScheduleForm.scheduleRoles.value"
                    >

                        <Column field="title"> 

                            <template #header>
                                <p class="text-center !w-full font-semibold"> 
                                    Title 
                                </p>
                            </template>

                            <template #body="data">
                                <p> 
                                    {{ data.data.roleName }} 
                                </p>
                            </template>

                        </Column>


                        <Column field="emoji"> 

                            <template #header>
                                <p class="text-center !w-full font-semibold"> 
                                    Emoji 
                                </p>
                            </template>

                            <template #body="data">
                                <p> 
                                    {{ data.data.roleEmoji }} 
                                </p>
                            </template>

                        </Column>


                        <Column field="capacity"> 

                            <template #header>
                                <p class="text-center !w-full font-semibold"> 
                                    Capacity 
                                </p>
                            </template>

                            <template #body="data">
                                <p> 
                                    {{ data.data.roleCapacity }} 
                                </p>
                            </template>

                        </Column>


                        <Column field="actions" class="!p-1 !py-2"> 

                            <template #header>
                                <p class="text-center !w-full font-semibold"> 
                                    Actions 
                                </p>
                            </template>

                            <template #body="data">
                                <div class="flex gap-2 flex-row flex-wrap justify-center items-center">
                                    <!-- Edit Button -->
                                    <Button 
                                        unstyled
                                        hidden
                                        class="bg-zinc-700 p-1 rounded-sm
                                        flex justify-center items-center content-center"
                                    >
                                        <PencilIcon size="19" />
                                    </Button>


                                    <!-- Delete Button -->
                                    <Button 
                                        unstyled
                                        class="bg-rose-700 grayscale-55 p-1 rounded-sm cursor-pointer
                                        flex justify-center items-center content-center"
                                        @click="(e) => { newScheduleForm.scheduleRoles.value.splice(data.index, 1) }"
                                    >
                                        <Trash2Icon size="19" />
                                    </Button>

                                </div>
                                
                            </template>

                        </Column>


                        <template #empty>
                            <Button  
                                fluid
                                severity="secondary"
                                class="!gap-1"
                                @click="newRoleForm.toggleNewRolePO"
                            >
                                <PlusIcon size="20"/>
                                <p> New Role </p>
                            </Button>
                        </template>


                    </DataTable>

                    <!-- Add Roles Required Message: -->
                    <Message v-if="newScheduleForm.showRolesRequiredText.value" severity="error" class="opacity-75" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li class="text-red-300"> Add at least 1 role!
                            </li>
                        </ul>
                    </Message>



                    <!-- Submit Schedule / Buttons -->
                    <div class="!flex flex-row w-full justify-start !gap-2.25 font-bold text-lg">
                        <Button
                            label="Reset"
                            @click="$form.reset(), newScheduleForm.scheduleRoles.value=[]"
                            severity="secondary"
                            size="small"
                        />
                        <Button
                            label="Save"
                            type="submit"
                            size="small"
                            class="!bg-emerald-500/40 !text-white !border-emerald-600/50"
                        />
                    </div>
                
                </Form>
            </template>
        </Dialog>


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


            <!-- Exisiitng Schd List -->
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
                                {{ item.sessionDateDaily.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})  }}
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
                    @click="creatingNewSchedule = true, showAddScheduleMessage = false"
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
        <Button class="w-fit" label="Submit" severity="success" type="submit" @click="submiteScheduleStep" />
    </div>
    
</template>