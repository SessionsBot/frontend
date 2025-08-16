<script setup lang="ts">
    import { GuildData } from '@sessionsbot/api-types';
    import { BellRingIcon, CalendarCogIcon, Clock4Icon, LayersIcon, MessageSquareTextIcon, PencilIcon, UserLockIcon, XCircleIcon, XIcon, XSquareIcon } from 'lucide-vue-next';
    import { friendlyTimezones } from '@/utils/modules/friendlyTimezones';
    import { FormInstance } from '@primevue/forms';

    const props = defineProps<{
        viewGuildConfigurationPanel: boolean;
        guildSelectedData: GuildData | undefined;
    }>()

    const emits = defineEmits(['closePanel'])


    // Timezone Autocomplete:
    const timezoneSuggestions = ref(friendlyTimezones)
    const searchTimezone = (s) => {
        const query = s.query?.toLowerCase() || '';
        timezoneSuggestions.value = friendlyTimezones.filter(tz =>
            tz.value.toLowerCase().includes(query) || tz.label.toLowerCase().includes(query)
        )
    }

    // Accent Color Ref:
    const selectedAccentColor = ref(null) // Default - Purple

    // Admin/Mention Role Options/Select:
    const adminRoleOptions = ref([]);
    const mentionRoleOptions = ref([]);
    adminRoleOptions.value = props.guildSelectedData?.guildGeneral?.roles || [];
    mentionRoleOptions.value = props.guildSelectedData?.guildGeneral?.roles || [];

    // Signup Channel Options:
    const guildChannels = computed(() => props.guildSelectedData?.guildChannels || []) // Raw guild channels data
    const guildCategories = ref([])
    const channelOptions = computed(()=> {
        guildCategories.value = []; // Reset
        // channelOptions.value = []; // Reset

        // Filter out only category channels:
        guildCategories.value = guildChannels.value
            .filter(guild => guild?.type === 4)
            .map(cat => ({
                ...cat,
                items: [] // Always start with a fresh items array!
            }));

        // Map for quick lookup
        const catMap = Object.fromEntries(guildCategories.value.map(cat => [cat.id, cat]));

        // Add text channels to their categories
        guildChannels.value.forEach(guild => {
            if (guild?.type === 0 || guild?.type === 5) { // is text channel
                const parentId = guild?.parent_id; // category id
                const thisCat = catMap[parentId];
                if (thisCat) {
                    thisCat.items.push({ label: guild?.name, value: guild?.id });
                }
            }
        });

        // Create component-safe channel option list:
        return guildCategories.value
            .filter(category => category.items.length)
            .map(category => ({
                label: category.name,
                items: category.items,
            }));
    });


    // Full confirmation form ref:
    const guildConfigurationForm : Ref<FormInstance | undefined> = ref(null);

    // Initialize confirmation form:
    async function initializePanelValues() {
        console.log('INITIALIZING')
        // Timezone
        guildConfigurationForm.value.setFieldValue('timeZone', props.guildSelectedData?.guildDatabaseData?.timeZone);
        // Accent Color
        guildConfigurationForm.value.setFieldValue('accentColor', props.guildSelectedData?.guildDatabaseData?.accentColor?.replace('0x', '') || '9b42f5');
        selectedAccentColor.value = props.guildSelectedData?.guildDatabaseData?.accentColor.replace('0x', '') || '9b42f5';
        // Admin IDs
        guildConfigurationForm.value.setFieldValue('adminIds', props.guildSelectedData?.guildDatabaseData?.adminRoleIds || [])
        // Signup Channel
        guildConfigurationForm.value.setFieldValue('panelChannel', props.guildSelectedData?.guildDatabaseData?.sessionSignup?.panelChannelId || null)
        // Signup Post Time:
        const postTimeData = props.guildSelectedData?.guildDatabaseData?.sessionSignup?.dailySignupPostTime
        const postTimeDate = new Date(); postTimeDate.setHours(postTimeData?.hours || 5, postTimeData?.minutes || 30, 0, 0)
        guildConfigurationForm.value.setFieldValue('postTime', postTimeDate)
        // Signup Mention Roles:
        guildConfigurationForm.value.setFieldValue('mentionRoles', props.guildSelectedData?.guildDatabaseData?.sessionSignup?.mentionRoleIds)


        console.log('Values', guildConfigurationForm.value.states)
    }

    // Form Validation:
    const resolver = ({values}) => {
        const errors = {};

        // Confirm timezone:
        if (!values.timeZone || String(values.timeZone).trim().length <= 0) {
            errors['timeZone'] = [{ message: 'Timezone is required!' }];
        }

        // Confirm accent color:
        if (!values.accentColor){
            errors['accentColor'] = [{ message: 'Accent Color is Invalid!' }]
        }

        return {
            values,
            errors
        };
    }

    // Submit Form:
    const submissionLoading = ref(false)
    const submitGuildConfiguration = (f) => {
        submissionLoading.value = true
        if(f?.valid){
            // Valid - Proceed:
            console.info('VALID', f);

        } else { 
            // Invalid - Don't Proceed:
            console.warn('INVALID', f);
        }
        setTimeout(() => {
            submissionLoading.value = false
        }, 1_000);
    }


</script>

<template>
<Dialog v-bind:visible="viewGuildConfigurationPanel" :draggable="false" :modal="true" @show="initializePanelValues()">
    
    <!-- Panel Header -->
    <template #header>
        <div class="flex flex-row-reverse w-full justify-between items-start">
            <!-- Close Button -->
            <Button hidden unstyled @click="emits('closePanel');" class="hover:bg-white/15 p-2 rounded-full">
                <XIcon />
            </Button>

            <!-- Title/Heading -->
            <div class="flex flex-wrap flex-col gap-1.5 content-center w-full">
                <p class="text-xl font-bold w-full text-start"> Guild Configuration </p>
                <!-- Guild name & icon -->
                <div class="bg-white/10 ring-1 ring-white/20 p-0.75 w-fit rounded-md flex flex-row gap-1 flex-wrap justify-start items-center">
                    <img class="w-5 h-5 rounded-md ring-1 ring-ring" :src="guildSelectedData?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'" alt="Guild Icon">
                    <p class="text-sm"> {{ guildSelectedData?.guildGeneral?.name }} </p>
                </div>
            </div>
        </div>
    </template>

    <!-- Panel Contents -->
    <template #default>
    <Form v-slot="$form" ref="guildConfigurationForm" :resolver @submit="submitGuildConfiguration" class="flex flex-col flex-wrap gap-4 mx-4">
        
        <!-- Timezone -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Guild’s preferred timezone:
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

            <Message v-if="$form.timeZone?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.timeZone.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

        <!-- Accent Color -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Guild’s Accent Color:
            </p>

            <ColorPicker 
                v-model:model-value="selectedAccentColor"
                name="accentColor" 
                format="hex"
                class="block"
                :pt="{preview: '!w-22 m-1 mx-0.75 ring-1 ring-ring hover:ring-white/30 transition-all'}"
            />

            <Message v-if="$form.accentColor?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.accentColor.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

        <!-- Admin Ids -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Admin Roles:
            </p>

            <IftaLabel>
                <MultiSelect
                name="adminIds" 
                fluid filter
                class="!max-w-64"
                option-label="name"
                option-value="id"
                placeholder="None selected"
                :options="adminRoleOptions"
                />

                <label for="adminIds" class="flex gap-0.75 items-center justify-center content-center"> 
                    <UserLockIcon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Admin Roles: </p>
                </label>
            </IftaLabel>

            <Message v-if="$form.adminIds?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.adminIds.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

        <!-- Signup Channel -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Signup Channel:
            </p>

            <!-- Select Channel -->
            <IftaLabel variant="in">
                <Select
                    name="panelChannel"
                    optionLabel="label" optionValue="value"
                    optionGroupLabel="label" optionGroupChildren="items"
                    class="min-w-64" filter fluid
                    :options="channelOptions" placeholder="Make a selection..."
                >
                    <template #optiongroup="slotProps">
                        <div class="flex flex-row gap-2 justify-start items-center">
                            <LayersIcon :size="18"/>
                            <p> {{slotProps.option.label }}</p>
                        </div>
                    </template>
                </Select>

                <label for="panelChannel" class="flex gap-0.75 items-center justify-center content-center"> 
                    <MessageSquareTextIcon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Signup Channel </p>
                </label>
            </IftaLabel>

            <Message v-if="$form.panelChannel?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.panelChannel.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

        <!-- Signup Post Time -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Daily Post Time:
            </p>

            <IftaLabel>
                <DatePicker
                name="postTime" 
                fluid
                class="!max-w-65"
                time-only
                :step-minute="5"
                hour-format="12"
                />
                <label for="postTime" class="flex gap-0.75 items-center justify-center content-center"> 
                    <Clock4Icon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Post Time: </p>
                </label>
            </IftaLabel>
            <Message v-if="$form.postTime?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.postTime.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

        <!-- Signup Mention Roles -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Mention Roles:
            </p>

            <IftaLabel>
                <MultiSelect
                name="mentionRoles" 
                fluid filter
                class="!max-w-65"
                option-label="name"
                option-value="id"
                :options="mentionRoleOptions"
                placeholder="None selected"
                />

                <label for="mentionRoles" class="flex gap-0.75 items-center justify-center content-center"> 
                    <BellRingIcon :size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Mention Roles: </p>
                </label>
            </IftaLabel>

            <Message v-if="$form.mentionRoles?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.mentionRoles.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

        <!-- Footer/Buttons -->
        <section class="flex justify-end items-center content-center gap-1.5 flex-wrap w-full p-1.5">
            <!-- Cancel Button -->
            <Button @click="emits('closePanel'); guildConfigurationForm.reset();" :disabled="submissionLoading" severity="secondary" class="w-fit" label="Cancel" />
            <!-- Submit Button -->
            <Button :loading="submissionLoading" type="submit" severity="success" class="w-fit" label="Save" />
        </section>
    
    </Form>
    </template>

    <!-- Hide default close button -->
    <template #closebutton>
        <span hidden class="hidden w-px h-px" />
    </template>

</Dialog>
</template>
