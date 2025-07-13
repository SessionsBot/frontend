<script setup>

    // ------------------------- [ App Imports ] ------------------------- \\
    import { onMounted, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useNavStore } from '@/utils/stores/nav';
    import { useAuthStore } from '@/utils/stores/auth';

    
    // UI:
    import { CableIcon, EarthIcon, LayoutDashboardIcon, Link2Icon, LockIcon, MailIcon, PartyPopperIcon, Trash2, TriangleAlert, WrenchIcon } from 'lucide-vue-next';
    import Card from 'primevue/card';
    import Step from 'primevue/step';
    import StepItem from 'primevue/stepitem';
    import StepPanel from 'primevue/steppanel';
    import Stepper from 'primevue/stepper';
    import { useConfirm, Button } from 'primevue';
    import ConfirmDialog from 'primevue/confirmdialog';
    import ProgressSpinner from 'primevue/progressspinner';
    import { motion } from 'motion-v';


    // Setup Step Components:
    import TimezoneSetup from './steps/guildSettings.vue'
    import DailySignupSetup from './steps/signupPanels.vue'
    import SessionSchedules from './steps/sessionSchedules.vue'


    // ------------------------- [ Variables ] ------------------------- \\
    const router = useRouter()
    const route = useRoute()
    const auth = useAuthStore()
    const nav = useNavStore()
    const userLoggedIn = computed(() => auth.isAuthenticated)
    const userWebToken = computed(() => auth.authToken)
    const guildId = ref('GUILD_ID')
    // Watch Authentication:
    watch(userLoggedIn, (newVal, oldVal) => {
        if(!newVal){ // Signed out - force sign in...
            currentCard.value = 'signIn';
        }
    })
    

    // ------------------------- [ Guild Data ] ------------------------- \\
    const guildData = ref(null)
    const guildIconImg = computed(() => {
        return guildData.value?.guildIcon 
        ? guildData.value?.guildIcon 
        : 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'
    });
    const guildName = computed(() => {
        return guildData.value?.guildGeneral.name 
        ? guildData.value.guildGeneral.name 
        : 'GUILD'
    });


    // ------------------------- [ FULL Setup Draft ] ------------------------- \\
    const guildSetupDraft = ref({})
    // Debugging:
    // watch(guildSetupDraft, (newVal, oldVal) => {
    //     console.info('GUILD DRAFT UPDATE', newVal)
    // })

    // Color Convertor:
    function rgbToDiscordHex({ r, g, b }) {
        const hex = (r << 16) + (g << 8) + b;
        return `0x${hex.toString(16).padStart(6, '0')}`;
    }


    // Submit Full Setup to Backend:
    const submitSetupDraft = async () => {
        let setupSubmissionData = {}
        try {
            // 0. Prepare - Debug:
            // Prepare - Guild Accent Color:
            const colorObj = guildSetupDraft.value?.accentColor || {r:155, g:66, b:245}
            const convertedHex = rgbToDiscordHex(colorObj)
            
            // Prepare - Daily Post Time:
            const requestedHours = new Date(guildSetupDraft.value?.postTime).getHours() || 5
            const requestedMinuets = new Date(guildSetupDraft.value?.postTime).getMinutes() || 30

            // Prepare - Full Submission:
            setupSubmissionData['accentColor'] = convertedHex || '0x9b42f5'
            setupSubmissionData['timeZone'] = guildSetupDraft.value?.timeZone?.value || 'America/Chicago'
            setupSubmissionData['adminRoleIds'] = guildSetupDraft.value?.adminIds || []
            setupSubmissionData['panelChannelId'] = guildSetupDraft.value?.panelChannel || null
            setupSubmissionData['dailySignupPostTime'] = {hours: requestedHours, minutes: requestedMinuets}
            setupSubmissionData['signupMentionIds'] = guildSetupDraft.value?.mentionRoles || []
            setupSubmissionData['allGuildSchedules'] = guildSetupDraft.value?.sessionSchedules || []


            // Debug:
            // console.info('Submitting Guild Setup:', setupSubmissionData)


            // 1. Attempt request/save:
            const requestUrl = `https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/secure-action`;
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userWebToken.value}`
                },
                body: JSON.stringify({
                    actionType: 'SETUP-GUILD',
                    guildId: guildId.value,
                    data: {
                        configuration: setupSubmissionData
                    }
                })
            })

            // 2. Get Response:
            const body = await response.json();

            // 3. Read Response:
            if(response.ok){
                // Success:
                // console.log('Success:', response.status, body)
                // Show success card:
                currentCard.value = 'setupSuccess';
            }else {
                // Error:
                console.warn('Error - Response:', response.status, body)
            }

            


        } catch (error) {
            // Debug error:
            console.error('Network/Server ERROR', 'Secure Action')
            console.warn(error)
        }
    }


    // ------------------------- [ Guild Setup Steps: ] ------------------------- \\
    const currentCard = ref('null') // Controls active visible content
    const deferSetupContent = ref(true) // Hides all contents
    const currentStep = ref("1") // Control current 'setup step'

    // Check for Final Submission Step:
    function onStepChange(val) {
        currentStep.value = val

        // IF FINAL/SUBMIT STEP:
        if(val === 4 || val === '4'){
            
            submitSetupDraft()
        }
    }


    // ------------------------- [ ABORT SETUP / Confirmation ] ------------------------- \\
    const confirm = useConfirm();
    const requireConfirmation = () => {
        confirm.require({
            group: 'headless',
            header: '😢 Are you sure?',
            message: `If you proceed, you'll lose your progress and have to finish setting this guild up later.`,
            accept: () => {
                router.push('/')
            },
            reject: () => {
                return
            }
        });
    };


    // ------------------------- [ Page Load / Mounted ] ------------------------- \\
    // -- Get Guild Data
    // -- Check Authentication
    onMounted(async () => {
        // Hide Standard Header:
        const nav = useNavStore()
        nav.headerVisible = false;

        // Get query:
        const query = useRoute().query
        const G_ID = query.guildId

        // Fetch Guild Data:
        const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + G_ID;
        await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async response => {
            // Get response:
            const responseData = await response.json()
                .then((d) => {return d})
                .catch((e) => {return 'Failed to get guild data response body!'})

            return responseData;
        })
        .then(data => {
            if(data.success){
                // Update varaibles & page:
                guildData.value = data.data
                guildId.value = data.data?.guildGeneral?.id
                deferSetupContent.value = false
                currentCard.value = 'wait'
            } else {
                // Error:
                currentCard.value = 'dataError'
                throw new Error("Response did not return success!" + JSON.stringify(data, '', 2));
            }
        })
        .catch(error => {
            console.error('FAILED TO FETCH GUILD DATA: ', error);
        });

        // Data error takes priority - ABORT
        if(currentCard.value === 'dataError') return 

        // Check authetication:
        if(!auth.isAuthenticated){
            // Force sign in:
            currentCard.value = 'signIn';
        }else{
            currentCard.value = 'startSetup';
        }

    })


</script>

<template> <main class="text-white w-full bg-black/30 text-center flex gap-2 flex-1 flex-col flex-wrap justify-start items-center content-center">

    <!-- Custom Header: -->
    <Transition name="fade" duration="1"> <header v-show="!deferSetupContent" class="bg-zinc-900 ring-2 h-15 ring-zinc-700/70 w-full flex justify-between">
        <!-- Site Title -->
        <section class="w-fit p-2 px-4 flex flex-row gap-2.5 justify-start items-center content-center">
            <img class="h-8 w-8 rounded-full ring-border ring-2" :src="guildIconImg">
            <h1 class="text-3xl text-primary font-semibold text-left">
                Guild Setup
            </h1>
        </section>


        <!-- Abort Setup PopUp: -->
        <ConfirmDialog group="headless" class="max-w-[90%]">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-8 bg-surface-0 rounded">
                    <div
                        class="rounded-full ring-ring ring-3 bg-destructive-foreground text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                        <TriangleAlert class="text-white drop-shadow-md drop-shadow-black/50 w-18 h-18 p-1 mb-2" />
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0 text-center px-5">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button size="small" label="Continue Setup" severity="success" variant="outlined"
                            @click="rejectCallback"
                            class="w-fit !border-emerald-500 hover:!bg-emerald-800 text-shadow-sm text-shadow-black/30"></Button>
                        <Button size="small" label="Leave & Discard" severity="danger" @click="acceptCallback"
                            class="w-fit"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>

        <!-- Abort Setup Button: -->
        <Button @click="requireConfirmation()" variant="text" severity="danger" size='small'
            class="flex justify-center items-center content-center flex-row flex-nowrap w-fit h-fit my-auto mr-2.5">
            <Trash2 class="w-4 h-4" />
            <p>Abort Setup</p>
        </Button>

    </header> </Transition>

    <!-- Full Body Wrap -->
    <section class="flex flex-1 flex-col flex-wrap gap-3 p-5 w-full text-center justify-center items-center content-center">
    <Transition name="fade-slide" mode="out-in">

        <!-- Please Wait - Card -->
        <Card v-if="currentCard === 'wait'"
            id="loadingCard"
            class="px-10 py-2"
        >
            <template #content>
                <ProgressSpinner/>
                <p class="opacity-50 mt-5"> Please wait </p>
            </template>
        </Card>


        <!-- Sign In - Card -->
        <Card v-else-if="currentCard === 'signIn'"
            id="signInCard"
            class="!p-0 md:w-[60%] m-10 !ring-2 ring-ring !overflow-clip"
        >
            
            <template #header>
                <div class="bg-zinc-800/50 rounded-md border-b-2 ring-ring rounded-br-none rounded-bl-none gap-2.5 px-3 py-4 flex-col flex justify-center items-center content-center">
                    
                    <p class="text-3xl font-semibold w-full text-left p-0 m-0"> 👋 Hey There! </p>
                    <p class="text-lg ml-4 w-full text-left"> Welcome to Sessions Bot </p> 

                </div>
            </template>

            <template #content>
                <div class="gap-2.5 !w-full flex-col flex justify-center items-center content-center">


                    <!-- Guild info -->
                    <div class="flex w-full rounded-md flex-row items-center content-center justify-start">

                        <p class="inline-flex text-zinc-300 bg-zinc-800 p-1 rounded-md rounded-tr-none rounded-br-none border-inset border-2 ring-ring font-semibold content-center items-center w-fit h-fit">
                            <EarthIcon size="22" stroke-width="2.5" class=" rounded-md p-0.75 m-0 mr-0.5 inline" />
                            Guild:
                        </p>

                        <p class="p-1 px-1.5 font-semibold ring-2 ring-ring ring-offset rounded-md rounded-tl-none rounded-bl-none inline-flex justify-center items-center gap-1 flex-nowrap">
                            {{ guildName.toUpperCase() }}
                            <img :src="guildIconImg" class="h-4 inline-flex rounded-full" >
                        </p>

                    </div>

                    <!-- Information Text -->
                    <p class=" text-md font-light w-full text-left p-0 m-0"> 
                        To start the configuration setup for this Guild, you must be signed into an account! Please simply sign in using Discord below. 
                    </p> 

                    <Button @click="auth.authWithDiscord($route.fullPath)" class="mt-10 !bg-modern-purple-discord hover:!bg-indigo-600 !text-white !border-0 font-semibold">
                        <svg class="h-5 w-5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid"> <g><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"></path></g> </svg>
                        Continue with Discord
                    </Button>

                    <div class="mt-2 flex gap-1 justify-center items-center content-center text-sm opacity-50">
                        <LockIcon class="scale-80 rotate-14"/>
                        Your information is always secure and private!
                    </div>

                </div>
            </template>
        </Card>


        <!-- Data/Guild Error - Card -->
        <Card v-else-if="currentCard === 'dataError'"
            class="!p-0 md:w-[60%] m-10 !ring-2 ring-ring !overflow-clip"
        >
            
            <template #header>
                <div class="bg-zinc-800/50 rounded-md border-b-2 ring-ring rounded-br-none rounded-bl-none gap-2.5 px-3 py-4 flex-col flex justify-center items-center content-center">
                    
                    <p class="text-3xl font-semibold w-full text-left p-0 m-0"> 👋 Uh oh! </p>
                    <p class="text-lg ml-4 w-full text-left"> We can't find your Discord Guild! </p> 

                </div>
            </template>

            <template #content>
                <div class="gap-2.5 !w-full flex-col flex justify-center items-center content-center">


                    <!-- Guild info -->
                    <div class="flex w-full rounded-md flex-row items-center content-center justify-start">

                        <p class="inline-flex text-zinc-300 bg-zinc-800 p-1 rounded-md rounded-tr-none rounded-br-none border-inset border-2 ring-ring font-semibold content-center items-center w-fit h-fit">
                            <EarthIcon size="22" stroke-width="2.5" class=" rounded-md p-0.75 m-0 mr-0.5 inline" />
                            Guild:
                        </p>

                        <p class="p-1 px-2 font-semibold ring-2 ring-ring ring-offset rounded-md rounded-tl-none rounded-bl-none inline-flex justify-center items-center gap-1 flex-nowrap">
                            ?
                        </p>

                    </div>

                    <p
                     class="w-full text-left px-2 text-xs opacity-40"> 
                        ID: {{guildId}} 
                    </p>

                    <!-- Information Text -->
                    <p class=" text-md font-light w-full text-left p-0 m-0"> 
                        Our system can't detect your Discord guild/server! Make sure Sessions Bot is a member within your guild and also has appropriate permissions!
                    </p> 

                    <Button @click=" nav.externalPaths().inviteBotUsingDiscord()" class="mt-10 !bg-sky-600 hover:!bg-sky-800 !text-white !border-0 font-semibold">
                        <svg class="h-5 w-5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid"> <g><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"></path></g> </svg>
                        Invite Sessions Bot
                    </Button>

                    <div class="mt-2 flex gap-1 justify-center items-center content-center text-sm opacity-50">
                        <MailIcon class="scale-80 rotate-14"/>
                        Re-invite Sessions Bot to your Guild here!
                    </div>

                </div>
            </template>
        </Card>


        <!-- Start Setup Card: -->
        <Card v-else-if="currentCard === 'startSetup'" 
            id="beginSetupCard"
            class="
                w-[90%] sm:w-[80%]
                max-w-lg
                border-2 border-ring
                overflow-clip
                !bg-black/40"
        >

            <template #header>
                <div class="bg-zinc-900 border-b-2 border-b-ring p-2 !w-full !flex !flex-wrap !justify-between !items-center !content-center flex-row !text-nowrap">
                    
                    <!-- Card Title -->
                    <p class="inline-flex font-bold content-center items-center w-fit h-fit">
                        <WrenchIcon class="bg-ring w-fit rounded-md p-0.75 mr-1.5 inline h-fit" />
                        Guild Setup
                    </p>

                    <!-- Guild info -->
                    <div class="flex w-fit rounded-md flex-row items-center content-center justify-center" title="Guild">

                        <div class="inline-flex text-zinc-300 bg-zinc-800 p-1 rounded-md rounded-tr-none rounded-br-none border-2 ring-ring font-semibold justify-center content-center items-center w-fit h-fit">
                            <EarthIcon size="20" stroke-width="2.5" class=" rounded-md p-0.75 m-0 inline" />
                        </div>

                        <p class="p-1 text-sm px-1.5 font-semibold ring-2 ring-ring ring-offset rounded-md rounded-tl-none rounded-bl-none inline-flex justify-center items-center gap-1 flex-nowrap">
                            {{ guildName.toUpperCase() }}

                        </p>

                    </div>

                </div>
            </template>

            <template #content>

                <div class="flex flex-col justify-center items-center gap-5 ">

                    <!-- Heading -->
                    <p class="font-semibold text-2xl"> Welcome to Sessions Bot! </p>

                    <!-- Guild/Sessions Icons -->
                    <div class="flex h-full justify-center gap-1.5 items-center content-center flex-row" id="guild-sessions-img-wrapper">
                        
                        <img src="../../../assets/sessionsBotWithText.png" class="bg-zinc-400 rounded-full ring-2 ring-ring w-15 h-15">

                        <span class="bg-zinc-700 scale-75 w-fit px-1.5 rounded-2xl">
                            <Link2Icon class="scale-90" />
                        </span>

                        <img :src="guildIconImg" class="bg-zinc-400 rounded-full ring-2 ring-ring w-15 h-15">

                    </div>

                    <!-- Description -->
                     <p class="font-light px-10 text-sm"> 
                        Click below to get started on configuring your Discord Guild for Sessions Bot! 
                    </p>

                </div>
                
                

            </template>


            <template #footer>
            <div class="flex flex-col justify-center items-center gap-5 mt-5 ">

                <Button
                    @click="() => { if(Number(currentStep) <= 0) currentStep='1'; currentCard='guildSetup' } "
                    class="!gap-1"
                    severity=""
                >
                    <CableIcon size="26" stroke-width="2.25" />
                    <p>Begin Setup</p>
                </Button>

            </div>
            </template>

        </Card>


        <!-- Guild Setup Steps: -->
        <Stepper v-else-if="currentCard === 'guildSetup'"
            id="guildSetupCard"
            :value="currentStep" 
            @update:value="onStepChange" 
            linear
            class="w-[90%] sm:w-[80%] !rounded-2xl overflow-clip border-2 border-zinc-700"
        >

            <!-- Timezone: -->
            <StepItem value="1">

                <Step class="!ring-2 !ring-offset ring-zinc-700">
                    <p :class="{'!text-emerald-500': currentStep > 1}">
                         Set Guild Settings
                    </p>
                </Step>

                <StepPanel v-slot="{ activateCallback }">
                    
                        <TimezoneSetup
                            :changeStep="activateCallback" 
                            :guildData="guildData"
                            @updateDraft="(data) => { guildSetupDraft = data }"
                        />

                </StepPanel>

            </StepItem>


            <!-- Daily Signup: -->
            <StepItem value="2">

                <Step class="!ring-2 !ring-offset ring-zinc-700"> 
                    Configure Singup Panels
                </Step>

                <StepPanel v-slot="{ activateCallback }">

                    <DailySignupSetup
                        v-if="guildData" 
                        :guildData="guildData"
                        :changeStep="activateCallback" 
                        @updateDraft="(data) => { guildSetupDraft = { ...guildSetupDraft, ...data } }"
                    />

                </StepPanel>
                
            </StepItem>


            <!-- Daily Schedules: -->
            <StepItem value="3">

                <Step class="!ring-2 !ring-offset ring-zinc-700"> 
                    Create Session Schedules 
                </Step>

                <StepPanel v-slot="{ activateCallback }">

                    <SessionSchedules 
                        :guildData="guildData"
                        :change-step="activateCallback"
                        @updateDraft="(data) => { guildSetupDraft = { ...guildSetupDraft, ...data } }"
                    />

                </StepPanel>
            </StepItem>


            <!-- SUBMIT BUTTONS TEMPLATE -->
            <template>
                <div class="hidden flex-col gap-2.5 py-6">

                    <p class="text-zinc-300/50 text-left"> Coming Soon </p>

                    <div class="flex flex-row gap-3 flex-wrap">
                        <Button class="w-fit" label="Back" severity="secondary"
                            @click="activateCallback('2')" />
                        <Button class="w-fit text-shadow-2xs text-accent" raised label="Submit"
                            severity="success" @click="activateCallback('4')">
                        </Button>
                    </div>


                </div>
            </template>


            <!-- HIDDEN - COMPLETE -->
            <StepItem value="4" v-show="Number(currentStep) >= 4">

                <Step class="! ring-offset ring-2 ring-zinc-700"
                    pt:number:class="relative overflow-clip before:flex before:items-center before:justify-center before:content-center before:text-center before:content-['✓'] before:z-100 before:absolute before:w-full before:h-full before:bg-zinc-900">
                    Submitting...
                </Step>

                <StepPanel class="relative h-25" v-slot="{ activateCallback }">

                    <div
                        class="absolute flex text-center justify-center items-center content-center flex-col left-0 w-full h-full">


                        <ProgressSpinner class="!h-12 !w-12 m-0 p-0" />
                        <motion.p class="text-zinc-300/50 w-full text-sm ml-2 relative top-1">
                            Please Wait...
                        </motion.p>


                    </div>

                </StepPanel>
            </StepItem>


        </Stepper>


        <!-- Setup Success/Finished  Card: -->
        <Card v-else-if="currentCard === 'setupSuccess'" 
            class="
                w-[90%] sm:w-[80%]
                max-w-lg
                border-2 border-ring
                overflow-clip
                !bg-black/40"
        >

            <template #header>
                <div class="bg-zinc-900 border-b-2 border-b-ring p-2 !w-full !flex !flex-wrap !justify-between !items-center !content-center flex-row !text-nowrap">
                    
                    <!-- Card Title -->
                    <p class="inline-flex font-bold content-center items-center w-fit h-fit">
                        <PartyPopperIcon class="bg-ring w-fit rounded-md p-0.75 mr-1.5 inline h-fit" />
                        Setup Completed!
                    </p>

                </div>
            </template>

            <template #content>

                <div class="flex flex-col justify-center items-center gap-5 ">

                    <!-- Heading -->
                    <p class="font-semibold text-2xl"> Congratulations! </p>

                    <!-- Guild/Sessions Icons -->
                    <div class="flex h-full justify-center gap-1.5 items-center content-center flex-row" id="guild-sessions-img-wrapper">
                        
                        <img src="../../../assets/sessionsBotWithText.png" class="bg-zinc-400 rounded-full ring-2 ring-ring w-15 h-15">

                        <span class="bg-zinc-500/80 scale-75 w-fit px-1.5 rounded-2xl">
                            <Link2Icon class="scale-90" />
                        </span>

                        <img :src="guildIconImg" class="bg-zinc-400 rounded-full ring-2 ring-ring w-15 h-15">

                    </div>

                    <!-- Description -->
                     <p class="font-light px-10 text-sm"> 
                        You have successfully completed all of the setup steps to start using Sessions Bot within your Discord Server!
                    </p>
                    

                </div>
                
                

            </template>


            <template #footer>
            <div class="flex flex-col justify-center items-center gap-5 mt-5 ">

                <Button
                    @click="() => { router.push({name: 'dashboard'}) } "
                    class="!gap-1 !bg-emerald-400/80 !border-0 mb-1 hover:brightness-125 !transition-all duration-400"
                    severity="success"
                >
                    <LayoutDashboardIcon size="22" stroke-width="2.25" />
                    <p>My Dashboard</p>
                </Button>

            </div>
            </template>

        </Card>


    </Transition>
    </section>
    


</main> </template>


<style scoped>
    /* Stepper Panel Styles: */
    :deep().p-steppanel {
        background: rgba(0, 0, 0, 0.4) !important;
    }
    :deep().p-step-header[data-p*="completed"], 
    :deep().p-step-number[data-p*="completed"], 
    :deep().p-step-title[data-p*="completed"] {
        color: var(--color-emerald-500) !important;
        
    }
    :deep().p-step{
        background: var(--color-zinc-900);
        opacity: .8 !important;
        
    }


    /* Card animations: */
    /* Fade-slide transition for Vue <Transition name="fade-slide"> */
    .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
    }
    .fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
    }
    .fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
    }
    .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-16px);
    }
    .fade-slide-enter-active,
    .fade-slide-leave-active {
    transition: opacity 0.35s cubic-bezier(.4,2,.6,1), transform 0.35s cubic-bezier(.4,2,.6,1);
    }


    /* Inline Step Heading Star Icon */
    :deep().step-heading{
        position: relative;
        z-index: 0;
        color: var(--color-zinc-300);
        font-weight: 400;
    }
    :deep().step-heading::before{
        width: 17px;
        height: 17px;
        background-color: var(--color-indigo-400);
        filter: grayscale(.35);
        z-index: -1;
        content: '?';
        font-size: 12px;
        font-weight: 800;
        color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: auto;
        position: absolute;
        border-radius: 12%;
        top: 4px;
        left: -28px;
        transition: background .3s;
    }


    /* How can i tell in this css if a .step-hadding also has the class : required-step? */
    :deep(.step-heading.required-step)::before{
        background: rgb(254, 114, 114);
        content: '★';
        font-size: 11px;
    }

</style>