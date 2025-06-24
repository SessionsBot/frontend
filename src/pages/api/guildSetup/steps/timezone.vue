<script setup>
    // Imports:
    import { CalendarCogIcon } from 'lucide-vue-next';
    import { Button } from 'primevue';

    
    // Props:
    defineProps({
        form: Object,
        timezoneInputModel: String
    })


    // ------------------------- [ Timezone / Autocomplete ] ------------------------- \\
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

    <p class="font-light text-primary"> Choose the preferred timezone within your guild: </p>

    <!-- Timezone Input -->
    <IftaLabel class="inline w-fit h-auto">
        <AutoComplete name="timezone" force-selection dropdown dropdown-mode="current"
            :suggestions="timezoneSuggestions" @complete="searchTimezone"
            :form-control="{ validateOnValueUpdate: false, validateOnBlur: false }" />
        <label for="timezone" class="inline-flex items-center">
            <CalendarCogIcon class="opacity-80 m-0 p-0 mr-0.75 w-3.5 h-3.5" />
            Timezone
        </label>
    </IftaLabel>

    <!-- Input Messages:  -->
    <Message v-if="form.timezone?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of form.timezone.errors" class="text-red-300" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>

    <!-- Submit Card/Timezone:  -->
    <Button type="submit" class="w-fit mt-4" label="Next" />

</template>