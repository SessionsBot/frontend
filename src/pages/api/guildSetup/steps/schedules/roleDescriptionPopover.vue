<script setup lang="ts">
    // @ts-ignore
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod'
    import { FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { SessionSchedule } from '@sessionsbot/api-types';
    import { PopoverMethods } from 'primevue';
    import { CheckCircleIcon, LetterTextIcon } from 'lucide-vue-next';

    const props = defineProps<{
        selectedScheduleData: SessionSchedule
        selectedRoleIndex: number
    }>()

    const emits = defineEmits<{
        closeDescPopover: [],
        changeRoleDesc: [roleIndex: number, roleDesc: string]
    }>()

    // Role Desc Popover Ref:
    const popoverDescFormRef = ref<FormInstance>();

    // Initiate on Mounted:
    onMounted(() => {
        popoverDescFormRef.value.setFieldValue('sessionDesc', props?.selectedScheduleData?.roles[props.selectedRoleIndex]?.roleDescription)
    })


    // Form Resolver:
    const resolver = zodResolver(
        z.object({
            sessionDesc: z.string().trim().min(5, {message: 'Provide a role description! (min: 5 chars)'}).max(60, {message: "Description is too long! (max: 60 chars)"})
        })
    )

    const submissionStatus = ref('waiting')
    const submitRoleDesc = (f:FormSubmitEvent) => {
        submissionStatus.value = 'pending'
        if(f?.valid){ // Valid submission:
            submissionStatus.value = 'success'
            setTimeout(() => {
                emits('changeRoleDesc', props.selectedRoleIndex, popoverDescFormRef.value.getFieldState('sessionDesc').value)
                emits('closeDescPopover')
                submissionStatus.value = 'waiting'
            },800)
            
        } else {// Invalid submission:
            submissionStatus.value = 'error'
            setTimeout(()=> submissionStatus.value = 'waiting',3000)
            return
        }
    }

</script>

<template>
	
    <Form v-slot="$form" ref="popoverDescFormRef" :resolver @submit="submitRoleDesc" >
    <div class="!flex-row !flex-nowrap p-2 justify-center items-center content-center">

        <!-- Desc Input: -->
        <section class="flex flex-col items-center justify-center content-center w-fit gap-4">
            <IftaLabel>
                <InputText
                    name="sessionDesc"
                    fluid
                    class="!max-w-64"
                    placeholder="Example Title"
                    :maxlength="60"
                >
                </InputText>
                <label for="sessionDesc" class="flex gap-0.75 items-center justify-center content-center"> 
                    <LetterTextIcon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Role Description: </p>
                </label>
            </IftaLabel>
            <Message v-if="$form.sessionDesc?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.sessionDesc.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

            <!-- Submit -->
            <Button @click="(e)=>{popoverDescFormRef.submit()}" class="p-1 px-1.25 gap-0.75 w-fit text-white/80 flex justify-center items-center content-center ring-1 ring-ring cursor-pointer rounded-full transition-all" unstyled 
                :class="{
                    '!bg-neutral-800': submissionStatus === 'waiting',
                    'bg-emerald-700': submissionStatus === 'success',
                    'bg-rose-800': submissionStatus === 'error',
                    'bg-amber-700': submissionStatus === 'pending'
                }"
            >
                <CheckCircleIcon :size="19" />
                <p class="font-semibold text-xs"> Save </p>
            </Button>
        </section>

        

    </div>
    </Form>

</template>
