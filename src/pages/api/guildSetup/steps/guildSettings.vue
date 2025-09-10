<script setup>
    // Imports:
    import { Form } from '@primevue/forms';
    import { CalendarCogIcon, UserLockIcon } from 'lucide-vue-next';
    import { Button } from 'primevue';

    import { friendlyTimezones } from '@/utils/modules/friendlyTimezones';
    import { onMounted, ref } from 'vue';
    

    // Incoming Props:
    const props = defineProps({
        changeStep: Function,
        guildData: Object
    })


    // Outgoing Emits
    const emits = defineEmits(
        ['updateDraft']
    )


    // Variables:
    const selectedAccentColor = ref({r:155, g:66, b:245}) // Default - Purple


    // Timezone Autocomplete:
    const timezoneSuggestions = ref(friendlyTimezones)
    const searchTimezone = (s) => {
        const query = s.query?.toLowerCase() || '';
        timezoneSuggestions.value = friendlyTimezones.filter(tz =>
            tz.value.toLowerCase().includes(query) || tz.label.toLowerCase().includes(query)
        )
    }


    // On Mount:
    onMounted(() => {
        guildSettingsForm.value.setFieldValue('accentColor', selectedAccentColor.value)
    })


    // Form Ref:
    const guildSettingsForm = ref(null)


    // Form Validation:
    const resolver = ({values}) => {
        const errors = {};

        // Confirm timezone:
        if (!values.timeZone || String(values.timeZone).trim().length <= 0) {
            errors.timeZone = [{ message: 'Timezone is required!' }];
        }

        // Confirm accent color:
        if (!values.accentColor){
            errors.accentColor = [{ message: 'Accent Color is Invalid!' }]
        }

        return {
            values,
            errors
        };
    }


    // Form Submission:
    const submitGuildSettings = (f) => {

        if(f?.valid){
            // Valid - Proceed:
            props.changeStep('2');
            // Save Response to Draft:
            emits('updateDraft', f?.values)

        } else { 
            // Invalid - Don't Proceed:
            props.changeStep('1');
        }
    }


</script>


<template>
<Form v-slot="$form" ref="guildSettingsForm" :resolver @submit="submitGuildSettings" class="flex text-left pr-7 flex-col gap-2.5 py-6 w-full">


    <!-- Timezone Input -->
    <div class="flex text-left pr-10 flex-col gap-4.5 w-full"> 

        <p class="step-heading required-step font-semibold text-primary"> 
            Choose your guild’s preferred timezone
        </p>

        
        <IftaLabel class="inline max-w-65 h-auto">
            <AutoComplete 
                name="timeZone" 
                force-selection dropdown
                fluid
                placeholder="Make a selection..."
                :suggestions="timezoneSuggestions" @complete="searchTimezone"
                option-label="label"
                :form-control="{ validateOnValueUpdate: false, validateOnBlur: false }" 
            />
            <label for="timeZone" class="inline-flex items-center">
                <CalendarCogIcon class="opacity-80 m-0 p-0 mr-0.75 w-3.5 h-3.5"/>
                Timezone
            </label>
        </IftaLabel>


        <!-- Input Messages:  -->
        <Message v-if="$form.timeZone?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
            <ul class="flex flex-col gap-1">
                <li v-for="(error, index) of $form.timeZone.errors" class="text-red-300" :key="index"> {{ error.message }}
                </li>
            </ul>
        </Message>

    </div>

    <Divider />

    <!-- Accent Color Input -->
    <div class="flex text-left pr-10 flex-col gap-4.5 w-full"> 
        
        <!-- Step Heading: -->
        <p class="step-heading font-semibold text-primary"> 
            Choose your guild’s accent color
        </p>

        <!-- Color pick/preview -->
        <div class="flex flex-col gap-4 flex-nowrap">
            
            <ColorPicker 
                v-model:model-value="selectedAccentColor" 
                name="accentColor" 
                format="rgb" 
                inline 
            />

            <!-- Color Previewer -->
            <span 
                class="h-5 w-25 min-w-25 ring-1 ring-zinc-400 rounded-lg ml-11" 
                :style="{
                    background: selectedAccentColor && selectedAccentColor.r !== undefined
                    ? `rgb(${selectedAccentColor.r}, ${selectedAccentColor.g}, ${selectedAccentColor.b})`
                    : selectedAccentColor // fallback for hex string
                }"
            />

        </div>
        
        <!-- Input Messages:  -->
        <Message v-if="$form.accentColor?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
            <ul class="flex flex-col gap-1">
                <li v-for="(error, index) of $form.accentColor.errors" class="text-red-300" :key="index"> {{ error.message }}
                </li>
            </ul>
        </Message>


    </div>

    <Divider />

    <!-- Submit Card/Timezone:  -->
    <Button type="submit" class="w-fit" label="Next" />

</Form>
</template>