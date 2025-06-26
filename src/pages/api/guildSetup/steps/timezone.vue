<script setup>
    // Imports:
    import { Form } from '@primevue/forms';
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod';
    import { CalendarCogIcon } from 'lucide-vue-next';
    import { Button } from 'primevue';

    
    // Incomming Props:
    const props = defineProps({
        changeStep: Function
    })

    // Outgoing Emits
    const emits = defineEmits(
        ['updateDraft']
    )

    // Form Validation:
    const resolver = zodResolver(
        z.object({
            timezone: z.union([
                z.string().min(1, {message: 'Timezone is required'}),
                z.any().refine((val) => false, { message: 'Timezone is required' })
            ])
        })
    );

    // Form Submission:
    const submitTimezone = (f) => {

        if(f?.valid){
            // Valid - Proceed:
            props.changeStep('2');
            // Save Response to Draft:
            emits('updateDraft', f?.values?.timezone)

        } else { 
            // Invalid - Don't Proceed:
            props.changeStep('1');
        }
    }


    // Timezone Autocomplete:
    const timezoneSuggestions = ref([])
    const allTimezones = Intl.supportedValuesOf
        ? Intl.supportedValuesOf('timeZone')
        : ["America/Chicago", "America/New_York", "Europe/London", "Asia/Tokyo"];
    const searchTimezone = (s) => {
        const query = s.query?.toLowerCase() || '';
        timezoneSuggestions.value = allTimezones.filter(tz =>
            tz.toLowerCase().includes(query)
        ).slice(0, 20); // limit to 20 suggestions for performance
    }
</script>


<template>
<Form v-slot="$form" :resolver @submit="submitTimezone" class="flex text-left pr-7 flex-col gap-2.5 py-6 w-full">

    <p class="font-light text-primary"> 
        Choose the preferred timezone within your guild: 
    </p>

    <!-- Timezone Input -->
    <IftaLabel class="inline w-fit h-auto">
        <AutoComplete name="timezone" force-selection dropdown dropdown-mode="current"
            :suggestions="timezoneSuggestions" @complete="searchTimezone"
            :form-control="{ validateOnValueUpdate: false, validateOnBlur: false }" 
            placeholder="Hint: Country/Name"
            
        />
        <label for="timezone" class="inline-flex items-center">
            <CalendarCogIcon class="opacity-80 m-0 p-0 mr-0.75 w-3.5 h-3.5"/>
            Timezone
        </label>
    </IftaLabel>


    <!-- Input Messages:  -->
    <Message v-if="$form.timezone?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.timezone.errors" class="text-red-300" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>

    <!-- Submit Card/Timezone:  -->
    <Button type="submit" class="w-fit mt-4" label="Next" />

</Form>
</template>