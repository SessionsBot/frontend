<script setup>
    // Imports:
    import { CalendarPlus2Icon, FilePlus, FileQuestionIcon, PlusIcon, UserLockIcon, XIcon } from 'lucide-vue-next';
import { ref, computed } from 'vue';

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
    const schedulesForm = {
        // Form JS Reference:
        schedulesFormRef: ref(null),
        
        // Form Validation:
        resolver: ({values}) => {
            let errors = {};

            // Confirm testIds ex:
            // if (!values.testIds || String(values.testIds).trim().length <= 0) {
            //     errors.testIds = [{ message: 'testIds is required!' }];
            // }

            return {
                values,
                errors
            }
        },

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
<Form v-slot="$form" ref="guildSettingsForm" :resolver="schedulesForm.resolver" @submit="schedulesForm.submit" class="flex text-left pr-7 flex-col gap-2.5 py-6 w-full">

    <!-- Guild Schedules -->
    <div class="flex text-left pr-10 flex-col gap-4.5 w-full"> 

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
                    class="!p-1 cursor-pointer text-white rounded-md !bg-emerald-500/50 !border-emerald-600/50 !w-fit !m-0 flex !gap-0.75 !items-center !justify-center !content-center"
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
                       <div class="!flex flex-row !gap-1.25 font-bold text-sm">
                        Please fill out the required information below to create your guild's first scheduled session!
                       </div>
                    </template>


                    <!-- Creating Schedule Submit/Buttons -->
                    <template #footer>
                       <div class="!flex flex-row w-full justify-start !gap-2.25 font-bold text-lg">
                        <Button
                            label="Discard"
                            @click="creatingNewSchedule = false"
                            severity="secondary"
                            size="small"
                        />
                        <Button
                            label="Save"
                            @click="creatingNewSchedule = false"
                            size="small"
                            class="!bg-emerald-500/40 !text-white !border-emerald-600/50"
                        />
                       </div>
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

        <!-- Invalid Input Messages:  -->
        <Message v-if="$form.testIds?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
            <ul class="flex flex-col gap-1">
                <li v-for="(error, index) of $form.testIds.errors" class="text-red-300" :key="index"> {{ error.message }}
                </li>
            </ul>
        </Message>

    </div>

    <Divider />

    <!-- Last/Next Step Buttons -->
    <div class="flex flex-row gap-3 flex-wrap">
        <Button class="w-fit" label="Back" severity="secondary" @click="changeStep('2')" />
        <Button class="w-fit" label="Next" type="submit" />
    </div>
    
</Form>
</template>