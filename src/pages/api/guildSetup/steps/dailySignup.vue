<script setup>
    // Imports:
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod';
    import { ArrowBigDownDash, Clock4Icon, EyeOffIcon, FilePlus2, InfoIcon, LayersIcon, LockKeyholeIcon, MessageSquareTextIcon, SparklesIcon } from 'lucide-vue-next';
    import { computed, onMounted, warn, watch } from 'vue';
    import { useAuthStore } from '@/utils/stores/auth';
    import { Select } from 'primevue';


    // Incomming Props:
    const props = defineProps({
        guildData: Object,
        changeStep: Function
    })

    // Outgoing Emits:
    const emits = defineEmits(
        ['updateDraft']
    )

    // TEST SECURE ACTION:
    const auth = useAuthStore()
    const userWebToken = computed(() => auth.authToken)

    const testSecureAction = async () => {

        // Attempt request:
        const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/secure-action`;
       
        try {
            // 1. Attempt fetch:
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userWebToken.value}`
                },
                body: JSON.stringify({
                    actionType: 'DELETE_EVENT',
                    data: 'EXAMPLE'
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
                console.warn('Error!', 'Secure Action', body)
            } else{
                // Success from Backend:
                const debugObject = {
                    statusCode: response.status,
                    statusMessage: body?.message,
                    errorData: body?.data
                }
                console.info('Success!', 'Secure Action', body)
            }

        } catch (error) {
            // Debug error:
            console.error('Error!', 'Secure Action', {error, response})
        }
        
        

    }

    // Guild Channels Selections:
    const guildChannels = computed(() => props.guildData?.guildChannels || []) // Raw guild channels data
    const channelOptions = ref([]) // Channel/Category options sent to selector


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
            if (guild?.type === 0) { // is text channel
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

//exaxaxa
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
    const submitDailySignup = (f) => {
        if(f?.valid){
            // Valid Submission:
            console.info('Daily Signup Submmited:', 'VALID', f)
        }else {
            // Invalid Submission:
            console.info('Daily Signup Submmited:', 'INVALID', f)
        }
    }


    // On Mount:
    onMounted(() => {
        fetchChannelOptions()
    })

</script>

<template>
    
<Form v-slot="$form" :resolver @submit="submitDailySignup" class="flex text-left pr-15 py-6 flex-col gap-4.5 w-full">


    <!-- Signup Channel Input -->
    <p class="text-primary/80"> 
        Determine the Text Channel used for Daily Session Signup 'Panels' 
    </p>

    <!-- Automatic Signup Channel Info -->
    <Panel :collapsed="true" legend='Auto Create Signup Channel' toggleable class="!max-w-125">
        <template #header>
            <div class="flex gap-1.5 flex-row items-center justify-center">
                <SparklesIcon size="17" />
                <p class="text-sm font-semibold"> Auto Create Signup Channel </p>
            </div>
        </template>

        <template #default>

            <p>
                Test a secure action below
            </p>

            <Button
             severity="warn"
             size="small"
             class=" !my-2"
             :loading="false"
             @click="testSecureAction"
             :disabled="false"
             label="Test Secure Action"
             
            >
                <template #icon> <LockKeyholeIcon/> </template>
                
            </Button>
        </template>
    </Panel>

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