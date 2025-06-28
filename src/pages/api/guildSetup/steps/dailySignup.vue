<script setup>
    // Imports:
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod';
    import { ArrowBigDownDash, ChevronDown, ChevronDownCircle, Clock4Icon, EyeOffIcon, FileCheck, FilePlus2, FileWarning, InfoIcon, LayersIcon, ListStartIcon, Loader2, LockKeyholeIcon, MessageSquareTextIcon, SparklesIcon } from 'lucide-vue-next';
    import { ref, computed, onMounted, warn, watch } from 'vue';
    import { useAuthStore } from '@/utils/stores/auth';
    import { Select } from 'primevue';


    // Variables:
    const auth = useAuthStore()
    const userWebToken = computed(() => auth.authToken)

    const userId = async () => { 
        const user = await auth.getUserData()
        return user?.Firebase?.uid
    }


    // Incomming Props:
    const props = defineProps({
        guildData: Object,
        changeStep: Function
    })

    // Outgoing Emits:
    const emits = defineEmits(
        ['updateDraft']
    )

    

    // Auto Channel Creation:
    const channelCreationStatus = ref(0)
    const createChannelLabel = computed(() => {
        if(channelCreationStatus.value >= 300){
            // Creation Error:
            return 'Failed!'
        }else if(channelCreationStatus.value >= 200){
            // Creation Success:
            return 'Created!'
        }else if(channelCreationStatus.value >= 1){
            // Loading:
            return 'Loading'
        }else{
            // Default
            return 'Create Channel'
        }
    })
    const createAutoSignupChannel = async () => {

        // Set viewable status:
        channelCreationStatus.value = 100

        // Attempt request:
        const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/secure-action`;
       
        try {
            // 1. Attempt fetch:
            const guildId = props.guildData?.guildGeneral?.id
            const adminId = await userId();
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userWebToken.value}`
                },
                body: JSON.stringify({
                    actionType: 'CREATE_AUTO-SIGNUP-CHANNEL',
                    data: {
                        guildId,
                        adminId
                    }
                })
            })

            // 2. Get response:
            let body;
            try{ 
                body = await response.json(); 
            }catch{ 
                response.status = 400;
                body = {
                    success: false,
                    data: null,
                    error: 'Front-end received no response body!'
                } 
            }
            
            // 3. Read response/body:
            if(!response.ok){
                // Error from Backend:
                const debugObject = {
                    errorCode: response.status,
                    errorMessage: body?.message,
                    errorData: body?.data
                }
                // Set viewable status:
                channelCreationStatus.value = 400
                // Debug:
                console.warn('Error!', 'Secure Action', body)
            } else{
                // Success from Backend:
                const creationData = body?.data?.creationResult?.data
                const newCategory = creationData?.sessionsCategory?.sessionsCategory
                const newChannel = creationData?.signupChannel?.signupChannel
                // Add NEW CHANNEL to select options:
                channelOptions.value.push( 
                    { 
                        label: newCategory?.name, 
                        items: [ { label: newChannel?.name, value: newChannel?.id } ]
                    } 
                )
                // Set as selection:
                dailySignupForm.value?.setFieldValue('panelChannel', newChannel?.id)
                // Set viewable status:
                channelCreationStatus.value = 200
                // Switch cards:
                setTimeout(() => {
                    channelSelectType.value = 'select'
                }, 500);
            }

        } catch (error) {
            // Set viewable status:
            channelCreationStatus.value = 400
            // Debug error:
            console.error('Error!', 'Secure Action', {error, response})
        }
        
        

    }


    // Existing Guild Channels Selection:
    const channelSelectType = ref('create')
    const guildChannels = computed(() => props.guildData?.guildChannels || []) // Raw guild channels data
    const channelOptions = ref([]) // Channel/Category options sent to selector
    const signupChannelSelection = ref(null) // Reactive current channel selection

    const guildCategories = ref([])
    function fetchChannelOptions() {
        guildCategories.value = []; // Reset
        channelOptions.value = []; // Reset

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
        channelOptions.value = guildCategories.value
            .filter(category => category.items.length)
            .map(category => ({
                label: category.name,
                items: category.items,
            }));
    }

    // Set Default Post Time:
    const setDefaultPostTime = () => {
        const defaultPostTime = new Date()
        defaultPostTime.setHours(5, 30, 0) 
        dailySignupForm.value?.setFieldValue('postTime', defaultPostTime)
    }


    // Form Validation:
    const resolver = zodResolver(
        z.object({
            panelChannel: z.union([
                z.string().min(1, {message: 'Signup Channel is invalid'}),
                z.any().refine((val) => false, { message: 'Signup Channel is required' })
            ]),
            postTime: z.preprocess((val) => {
                if (val === '' || val === null) {
                    return null;
                }

                return new Date(val);
            }, z.union([z.date(), z.null().refine((val) => val !== null, { message: 'Post Time is required.' })]))
        })
    );


    // Form Submission:
    const dailySignupForm = ref(null)
    const submitDailySignup = (f) => {
        if(f?.valid){
            // Valid Submission:
            console.info('Daily Signup Submmited:', 'VALID', f)
            // Save Values:
            emits('updateDraft', f?.values)
            // Procced:
            props.changeStep('3')
        }else {
            // Invalid Submission:
            console.info('Daily Signup Submmited:', 'INVALID', f)
            // Dont Procced:
            props.changeStep('2')
        }
    }


    // On Mount:
    onMounted(() => {
        // Load existing guild channels:
        fetchChannelOptions()
        setDefaultPostTime()
    })

</script>

<template>
    
<Form v-slot="$form" ref="dailySignupForm" :resolver @submit="submitDailySignup" class="flex text-left pr-15 py-6 flex-col gap-4.5 w-full">


    <!-- Signup Channel Input -->
    <p class="text-primary/80"> 
        Assign the Text Channel used for Daily Session Signup Panels
    </p>

    <!-- Create Automatic Signup Channel -->
    <Panel :collapsed="channelSelectType != 'create'" class="!max-w-125">
        <template #header>
            <div 
             @click="()=>{channelSelectType = 'create'}" 
             class="flex w-full gap-1.5 flex-row items-center justify-between p-0"
            >
                <!-- Panel Title -->
                <div 
                 class="flex flex-wrap flex-row gap-1.5 items-center justify-center"
                >
                    <SparklesIcon size="17" />
                    <p class="text-sm font-semibold"> Auto Create Signup Channel </p>
                </div>


                <!-- View Icon -->
                <div
                    class="relative h-full w-5.5"
                >
                    <ChevronDown
                     class="p-0.5 m-auto cursor-pointer transition-all "
                     :class="[channelSelectType === 'create' ? '!opacity-0' : 'animate-pulse']"
                    />
                </div>
                
            </div>
        </template>

        <template #default>

            <div
             class="gap-2.5 font-light flex flex-col flex-wrap justify-center items-start"
            >

                <div class="w-full mb-0.5 h-[1.5px] bg-zinc-700 rounded-full" />

                <p>
                    Sessions Bot can create a <i> brand new </i> text channel to be used for Signup Panels within your Guild.
                </p>

                <p class="text-sm bg-zinc-800 px-2 py-1 rounded-md">
                    <b><u>Keep in mind:</u></b> you must configure access control permissions after creation such as who can view the channel itself.
                </p>

                <Button
                severity="warn"
                size="small"
                class=" !my-2 !gap-1"
                :class="[
                    channelCreationStatus>=200 ? '!bg-emerald-400 !border-transparent' : '',
                    channelCreationStatus>=300 ? '!bg-red-500 !border-transparent' : '',
                ]"
                :loading="false"
                @click="createAutoSignupChannel"
                :disabled="channelCreationStatus >= 1"
                :label="createChannelLabel"
                showIcon="loading"
                
                >
                    <template #icon="showIcon">
                    
                        <FilePlus2 v-if="channelCreationStatus === 0" size="22"/>
                        <FileWarning v-else-if="channelCreationStatus >= 300" size="22"/>
                        <FileCheck v-else-if="channelCreationStatus >= 200" size="22"/>
                        <Loader2 v-else-if="channelCreationStatus > 0" class="animate-spin" size="22"/>
                        
                    </template>

                    
                </Button>
            </div>

        </template>

    </Panel>

    <!-- Or Divider -->
    <div class="flex justify-center items-center !max-w-125 h-fit flex-row flex-nowrap">     
        <div class="flex gap-3 justify-center items-center w-[40%] h-fit flex-row flex-nowrap">

            <div class="flex-1 h-[1.5px] bg-zinc-700" />

            <p class="text-zinc-700"> OR </p>

            <div class="flex-1 h-[1.5px] bg-zinc-700" />

        </div>
    </div>

    <!-- Select Existing Signup Channel -->
    <Panel :collapsed="channelSelectType != 'select'" class="!max-w-125">
        
        <template #header>
            <div 
             @click="()=>{channelSelectType = 'select'}" 
             class="flex w-full gap-1.5 flex-row items-center justify-between py-0"
            >
                <!-- Panel Title -->
                <div 
                 class="flex flex-wrap flex-row gap-1.5 items-center justify-center"
                >
                    <ListStartIcon size="17" />
                    <p class="text-sm font-semibold"> Select Existing Signup Channel </p>
                </div>


                <!-- View Icon -->
                <div
                    class="relative h-full w-5.5"
                >
                    <ChevronDown
                     class="p-0.5 m-auto cursor-pointer transition-all "
                     :class="[channelSelectType === 'select' ? '!opacity-0' : 'animate-pulse']"
                    />
                </div>

            </div>
        </template>

        <template #default>

            <!-- Select Channel -->
            <IftaLabel variant="in">
                <Select
                    name="panelChannel"
                    optionLabel="label"
                    optionValue="value"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                    class="!w-full !max-w-56 !flex" 
                    :options="channelOptions"

                >
                    <template #optiongroup="slotProps">
                        <div class="flex flex-row gap-2 justify-start items-center">
                            <LayersIcon size="20"/>
                            <p> {{slotProps.option.label }}</p>
                        </div>
                    </template>
            
                
            
            
                </Select>
                <label for="panelChannel" class="flex gap-0.75 items-center justify-center content-center"> 
                    <MessageSquareTextIcon size="14" class="!inline !pt-0.25"/>
                    <p class="!inline"> Signup Channel </p>
                </label>
            </IftaLabel>

            
        </template>

    </Panel>

    <!-- Form | Channel Error Messages -->
    <Message v-if="$form.panelChannel?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.panelChannel.errors" class="text-red-300" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>
    


    <Divider class="!my-2 !mb-0" />


    <!-- Signup Post Time Input -->
    <p class="text-primary/80"> 
        Choose the time the 'Signup Panels' will be posted each day
    </p>
    <IftaLabel>
        <DatePicker
         name="postTime" 
         class="w-fit" 
         time-only
         :step-minute="5"
         hour-format="12"
        />
        <label for="postTime" class="flex gap-0.75 items-center justify-center content-center"> 
            <Clock4Icon size="14" class="!inline !pt-0.25"/>
            <p class="!inline"> Post Time: </p>
        </label>
    </IftaLabel>
    <Message v-if="$form.postTime?.invalid" severity="error" class="opacity-75" size="small" variant="simple">
        <ul class="flex flex-col gap-1">
            <li v-for="(error, index) of $form.postTime.errors" class="text-red-300" :key="index"> {{ error.message }}
            </li>
        </ul>
    </Message>

    <Divider class="!my-2 !mt-0.5" />

    <div class="flex flex-row gap-3 flex-wrap">
        <Button class="w-fit" label="Back" severity="secondary" @click="changeStep('1')" />
        <Button class="w-fit" label="Next" type="submit" />
    </div>

</Form>
</template>