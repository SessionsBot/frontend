<script setup>
    // Imports:
    import { CalendarPlus2Icon, Clock4Icon, ExternalLinkIcon, FilePlus, FileQuestionIcon, LetterTextIcon, PlusIcon, UserLockIcon, XIcon } from 'lucide-vue-next';
    import { Label } from 'radix-vue';
    import { ref, computed } from 'vue';
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import {date, z} from 'zod'

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


    // Form:
    const newScheduleForm = {
        // Initial Values:
        initialValues: {
            sessionTitle: '', // 'Guild Session',
            sessionUrl: '', // 'https://www.roblox.com/games',
            sessionTime: '' // defaultSessionDate
        },

        // Form Validation:
        resolver: zodResolver(
            z.object({
                sessionTitle: z.string().min(1, {message: 'Invalid Session Title!'}),
                sessionUrl: z.string().url({message: 'Invalid URL! (include full https address)'}),
                sessionTime: z.date({message: 'Invalid Post Time!'}).refine(
                    val => val instanceof Date && !isNaN(val),
                    {message: 'Session Time is required!'}
                )
            })
        ),

        // Form Submission:
        submit: (f) => {
            console.log('SUBMIT:', f)
            if(f?.valid){
                // Valid Submission:

            }else {
                // Invalid Submission:

            }
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
            <div class="w-full flex flex-row justify-center items-center">
                <!-- Create Schedule Button: -->
                <Button
                    unstyled
                    size="small"
                    class="!p-1 cursor-pointer text-white rounded-md !bg-amber-500/50 !border-amber-600/50 !w-fit !m-0 flex !gap-0.75 !items-center !justify-center !content-center"
                    @click="creatingNewSchedule = true"
                 >
                    <CalendarPlus2Icon size="17" strokeWidth="2"/> 
                    <p class="text-xs !p-0 !m-0 font-semibold !pt-0.5"> New Schedule </p>
                </Button>

                <!-- Create Schedule Dialog/Form: -->
                <Dialog
                    v-model:visible="creatingNewSchedule"
                    modal 
                    :draggable="false"
                    :closable="false"
                    header="New Schedule"
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
                            v-slot="$form" 
                            :resolver="newScheduleForm.resolver" 
                            :initialValues="newScheduleForm.initialValues"
                            @submit="newScheduleForm.submit" 
                            class="!flex flex-col !gap-4.5 font-bold text-sm"
                        >

                            <!-- Session Title: -->
                            <IftaLabel>
                                <InputText
                                 name="sessionTitle"
                                 maxlength="30"
                                 fluid
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



                            <!-- Creating Schedule Submit/Buttons -->
                            <div class="!flex flex-row w-full justify-start !gap-2.25 font-bold text-lg">
                                <Button
                                    label="Discard"
                                    @click="$form.reset(), creatingNewSchedule = false"
                                    severity="secondary"
                                    size="small"
                                />
                                <Button
                                    label="Save"
                                    type="submit"
                                    @click="newScheduleForm.submit"
                                    
                                    size="small"
                                    class="!bg-emerald-500/40 !text-white !border-emerald-600/50"
                                />
                            </div>
                        
                        </Form>
                    </template>


                    

                   

                </Dialog>
            </div>
            </template>


            <!-- Exisiitng Schd List -->
            <template #list="slotProps">

            </template>

            <!-- No Schedules Template -->
            <template #empty="slotProps">
                <div class="flex gap-1.5 flex-col justify-center items-center px-5 py-12">
                    <FileQuestionIcon class="text-zinc-500"/>
                    <p class="text-zinc-500">
                        No schedules
                    </p>
                </div>
            </template>

        </DataView>

    </div>

    <Divider />

    <!-- Last/Next Step Buttons -->
    <div class="flex flex-row gap-3 flex-wrap pb-6 pt-3">
        <Button class="w-fit" label="Back" severity="secondary" @click="changeStep('2')" />
        <Button class="w-fit" label="Next" type="submit" @click="changeStep('4')" />
    </div>
    
</template>