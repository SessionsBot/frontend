<script setup>
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod';

    import { EyeOffIcon, FilePlus2 } from 'lucide-vue-next';

    // Incomming Props:
    const props = defineProps({
        changeStep: Function,
        d: String
    })

    const emits = defineEmits(['updateDraft'])

    // Form Validation:
    const resolver = zodResolver(
        z.object({
            // IDK
        })
    );


    // Form Submission:
    const submitDailySignup = () => {

    }

</script>

<template>
<Form v-slot="$form" :resolver @submit="submitDailySignup" class="flex text-left pr-7 flex-col gap-2.5 py-6 w-full">

    <!-- Automatic Signup Channel Info -->
    <Card class="inline-flex text-left w-fit !bg-blue-400/30 mr-4 shadow-md">
        <template #title>
            <p class="bg-accent w-fit p-0.5 rounded-sm shadow-sm">
                ✨ Automatic Signup Channel ✨
            </p>
        </template>

        <template #content>
            <div class="flex flex-col">
                <ol class="list-inside list-disc text-sm">
                    <li> Have Sessions Bot create a pre-configured 'Signup Channel' for your
                        guild!</li>
                    <li> By default, it creates a private text channel with only read access for
                        all members.</li>
                    <li> All you have to do is modify access permissions later! </li>
                </ol>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-start gap-2 mt-1">



                <Button class="!text-foreground/80 !bg-accent/50 hover:bg-accent! w-fit flex flex-nowrap" size="small"
                    variant="text" raised>
                    <EyeOffIcon class="w-4 h-4" />
                    <p class="text-sm">Dismiss</p>
                </Button>

                <Button severity="success" class="!bg-accent/50 hover:bg-accent! w-fit flex flex-nowrap" size="small"
                    variant="text" raised>
                    <FilePlus2 class="w-4 h-4" />
                    <p class="text-sm">Create</p>
                </Button>

            </div>
        </template>


    </Card>


    <!-- Signup Post Time Input -->
    <p> Select the channel used for 'Session Signup Panels' </p>
    <IftaLabel class="inline w-fit h-auto">
        <DatePicker input-id="postTimeSelect" class="w-fit" />
        <label for="postTimeSelect">Signup Channel:</label>
    </IftaLabel>



    <!-- Signup Post Time Input -->
    <p> Select the daily time the signup panels will be posted </p>
    <IftaLabel class="inline w-fit h-auto">
        <DatePicker input-id="postTimeSelect" class="w-fit" />
        <label for="postTimeSelect">Post Time:</label>
    </IftaLabel>



    <div class="flex flex-row gap-3 flex-wrap">
        <Button class="w-fit" label="Back" severity="secondary" @click="changeStep('1')" />
        <Button class="w-fit" label="Next" @click="props.changeStep('3')" />
    </div>

</Form>
</template>