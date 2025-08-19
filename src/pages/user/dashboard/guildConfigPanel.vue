<script setup lang="ts">
    //@ts-ignore
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod'
    import { GuildData } from '@sessionsbot/api-types';
    import { BellRingIcon, CalendarCogIcon, Clock4Icon, LayersIcon, MessageSquareTextIcon, UserLockIcon, XIcon } from 'lucide-vue-next';
    import { friendlyTimezones } from '@/utils/modules/friendlyTimezones';
    import { FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { useAuthStore } from '@/utils/stores/auth';
    import { POSITION, useToast } from 'vue-toastification';

    const toaster = useToast()
    const auth = useAuthStore()
    const authToken = computed(() => auth.authToken)

    const props = defineProps<{
        viewGuildConfigurationPanel: boolean;
        guildSelectedData: GuildData | undefined;
    }>()

    const emits = defineEmits(['closePanel', 'updateDashboard'])

    const guildId = computed(() => props?.guildSelectedData?.guildGeneral?.id || null)


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

    // Initialize configuration form values on open/reset:
    async function initializePanelValues() {
        // Timezone
        guildConfigurationForm.value.setFieldValue('timeZone', {label:props.guildSelectedData?.guildDatabaseData?.timeZone, value:props.guildSelectedData?.guildDatabaseData?.timeZone});
        // Accent Color
        guildConfigurationForm.value.setFieldValue('accentColor', props.guildSelectedData?.guildDatabaseData?.accentColor?.replace('0x', '') || '9b42f5');
        selectedAccentColor.value = props.guildSelectedData?.guildDatabaseData?.accentColor.replace('0x', '') || '9b42f5';
        // Admin IDs
        adminRoleOptions.value = props.guildSelectedData?.guildGeneral?.roles || [];
        guildConfigurationForm.value.setFieldValue('adminIds', props.guildSelectedData?.guildDatabaseData?.adminRoleIds || [])
        // Signup Channel
        guildConfigurationForm.value.setFieldValue('panelChannel', props.guildSelectedData?.guildDatabaseData?.sessionSignup?.panelChannelId || null)
        // Signup Post Time:
        const postTimeData = props.guildSelectedData?.guildDatabaseData?.sessionSignup?.dailySignupPostTime
        const postTimeDate = new Date(); postTimeDate.setHours(postTimeData?.hours || 0, postTimeData?.minutes || 30, 0, 0)
        guildConfigurationForm.value.setFieldValue('postTime', postTimeDate)
        // Signup Mention Roles:
        guildConfigurationForm.value.setFieldValue('mentionRoles', props.guildSelectedData?.guildDatabaseData?.sessionSignup?.mentionRoleIds)
        mentionRoleOptions.value = props.guildSelectedData?.guildGeneral?.roles || [];
    }


    // Form Validation:
    const resolver = zodResolver(
        z.object({
            accentColor: z.string().min(1, {message: 'Accent color is required!'}),
            timeZone: z.object({label: z.string(), value: z.string()}, {message: 'Invalid Message'}),
            adminIds: z.array(z.string()).default([]),
            panelChannel: z.string().min(1, {message: 'Signup Channel is required!'}),
            postTime: z.coerce.date().refine(val => !isNaN(val.getTime()), {
                message: 'Post Time is Invalid',
            }),
            mentionRoles: z.array(z.string().min(1, {message: 'Mention roles invalid!'}), {message: 'Mention roles invalid!'}).default([]),
        })
    )

    // Submit Form:
    const submissionLoading = ref(false)
    const submitGuildConfiguration = async (f:FormSubmitEvent) => {
        // Show loading:
        submissionLoading.value = true
        let configurationData = {};
        if(f?.valid){
            // Valid - Proceed:
            try {
                // Prepare- Accent Color:
                const convertedHex = new String().concat('0x', f?.values?.accentColor)
                
                // Prepare - Daily Post Time:
                const requestedHours = new Date(f?.values?.postTime).getHours() || 0
                const requestedMinuets = new Date(f?.values?.postTime).getMinutes() || 30

                // Prepare - Full Submission:
                configurationData['accentColor'] = convertedHex || '0x9b42f5'
                configurationData['timeZone'] = f?.values?.timeZone?.value || 'America/Chicago'
                configurationData['adminRoleIds'] = f?.values?.adminIds || []
                configurationData['panelChannelId'] = f?.values?.panelChannel || null
                configurationData['dailySignupPostTime'] = {hours: requestedHours, minutes: requestedMinuets}
                configurationData['signupMentionIds'] = f?.values?.mentionRoles || []
                configurationData['allGuildSchedules'] = props?.guildSelectedData?.guildDatabaseData?.sessionSchedules || []


                // 1. Attempt request/save:
                const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/v2/guilds/${guildId.value}/configuration`;
                const response = await fetch(requestUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken.value}`
                    },
                    body: JSON.stringify({
                        configuration: configurationData
                    })
                })

                // 2. Get Response:
                const body = await response.json();

                // 3. Read Response:
                if(response.ok){
                    // Success:
                    // console.log('Success:', response.status, body)
                    // Close panel & reload:
                    submissionLoading.value = false
                    emits('closePanel');
                    emits('updateDashboard');
                }else {
                    // Error:
                    submissionLoading.value = false
                    console.warn('Error - Response:', response.status, body)
                    toaster.error('Failed to save guild configuration, Please try again!', {position: POSITION.TOP_CENTER});
                }

                


            } catch (error) {
                // Save error - Debug:
                console.error('Network/Server ERROR', 'Secure Action')
                console.warn(error)
                // Complete loading:
                toaster.error('Failed to save guild configuration, Please try again!', {position: POSITION.TOP_CENTER});
                submissionLoading.value = false
            }

        } else { 
            // Invalid - Don't Proceed:
            console.warn('INVALID - Guild Config Submission', f);
            toaster.error('Configuration Invalid, Please try again!', {position: POSITION.TOP_CENTER});
            // Complete loading:
            submissionLoading.value = false
        }
    }

</script>

<template>
<Dialog v-bind:visible="viewGuildConfigurationPanel" :draggable="false" :modal="true" @show="initializePanelValues()" class="max-w-[80%]">
    
    <!-- Panel Header -->
    <template #header>
        <div class="flex flex-row-reverse w-full justify-between items-start">
            <!-- Close Button -->
            <Button hidden unstyled @click="emits('closePanel');" class="hover:bg-white/15 p-2 rounded-full">
                <XIcon />
            </Button>

            <!-- Title/Heading -->
            <div class="flex flex-wrap flex-col gap-2 content-center w-full">
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
    <Form v-slot="$form" ref="guildConfigurationForm" :resolver @submit="submitGuildConfiguration" class="flex flex-col flex-wrap gap-4 mx-7">

        <!-- Accent Color -->
        <section class="flex flex-col gap-1">

            <p class="step-heading required-step font-semibold text-primary"> 
                Guild’s Accent Color:
            </p>

            <ColorPicker 
                v-model:model-value="selectedAccentColor"
                name="accentColor" 
                format="hex"
                :pt="{preview: '!w-64 m-1 mx-0.75 ring-1 ring-ring hover:ring-white/30 transition-all'}"
            />

            <Message v-if="$form.accentColor?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
                <ul class="flex flex-col gap-1">
                    <li v-for="(error, index) of $form.accentColor.errors" class="text-red-300" :key="index"> {{ error.message }}
                    </li>
                </ul>
            </Message>

        </section>

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
                    class="max-w-64" filter fluid
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
                fluid :show-icon="true"
                class="!max-w-64"
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
                class="!max-w-64"
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
            <Button @click="emits('closePanel'); guildConfigurationForm.reset();" :disabled="submissionLoading" severity="secondary" class="w-fit" label="Cancel" />
            <!-- Submit Button -->
            <Button @click="guildConfigurationForm.submit();" :loading="submissionLoading" type="submit" severity="success" class="w-fit" label="Save" />
        </section>

    </template>

</Dialog>
</template>
