<script setup>

    // ------------------------- [ App Imports ] ------------------------- \\
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useNavStore } from '@/utils/stores/nav';
    import { useAuthStore } from '@/utils/stores/auth';

    // UI:
    import { CableIcon, CalendarCog, EyeOff, FilePlus2, Info, Link2Icon, LockIcon, PlayCircleIcon, PlaySquareIcon, SparklesIcon, Trash2, TriangleAlert } from 'lucide-vue-next';
    import Button from 'primevue/button';
    import Card from 'primevue/card';
    import Step from 'primevue/step';
    import StepItem from 'primevue/stepitem';
    import StepPanel from 'primevue/steppanel';
    import Stepper from 'primevue/stepper';
    import { AutoComplete, useConfirm } from 'primevue';
    import IftaLabel from 'primevue/iftalabel';
    import IconField from 'primevue/iconfield';
    import InputIcon from 'primevue/inputicon';
    import FloatLabel from 'primevue/floatlabel';
    import ConfirmDialog from 'primevue/confirmdialog';
    import DatePicker from 'primevue/datepicker';

    import ProgressSpinner from 'primevue/progressspinner';
    import { motion, animate } from 'motion-v';

    // ------------------------- [ Variables ] ------------------------- \\
    const router = useRouter()
    const route = useRoute()
    const auth = useAuthStore()
    const userLoggedIn = ref(auth.$state.isAuthenticated);


    // ------------------------- [ Guild Data ] ------------------------- \\
    const guildData = ref(null)
    const guildIconImg = computed(() => {
        return guildData.value?.guildIcon 
        ? guildData.value?.guildIcon 
        : 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'
    });
    const guildName = computed(() => {
        return guildData.value?.data.name 
        ? guildData.value?.data.name 
        : 'GUILD'
    });


    // ------------------------- [ Setup Steps ] ------------------------- \\
    const activeComponent = ref(null) // used for tranistion within page


    const deferSetupContent = ref(true)
    const currentStep = ref("0")
    const setupStarted = computed(()=>{return Number(currentStep.value) > 0})
    const submitting = ref(false)
    function onStepChange(val) {
        currentStep.value = val
        // do other stuff
    }


    // ------------------------- [ Timezone / Autocomplete ] ------------------------- \\
    const timezoneInputVal = ref(null);
    const timezoneSuggestions = ref(['US - Chicago','US - New York','US - Chicago',]);
    const search = (event) => {
        timezoneSuggestions.value = ['US - Chicago','US - New York','US - Chicago',];
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
    onMounted(() => {
        // Hide Standard Header:
        const nav = useNavStore()
        nav.headerVisible = false;

        // Get query:
        const query = useRoute().query
        const guildId = query.guildId

        // Fetch Guild Data:
        const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + guildId;
        fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response - NOT OK!', response);
            }
            return response.json();
        })
        .then(data => {
            guildData.value = data
            deferSetupContent.value = false
        })
        .catch(error => {
            console.error('FAILED TO FETCH GUILD DATA: ', error);
        });

        console.log('setupStarted', setupStarted.value)

    })


</script>

<template> <main class="text-white w-full bg-black/30 text-center flex gap-2 flex-1 flex-col flex-wrap justify-start items-center content-center">

    <!-- Custom Header: -->
    <Transition name="fade" duration="1">
    <header v-show="!deferSetupContent" class="bg-zinc-900 ring-2 h-15 ring-zinc-700/70 w-full flex justify-between">
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

    </header>
    </Transition>

    <!-- <Transition name="fade" mode="out-in">
        <component :is="activeComponent"></component>
    </Transition> --> UTILIZE THIS!

    <!-- Full Not Ready Wrap -->
    <section v-show="deferSetupContent" class="w-full flex-1 gap-4 md:w-full p-3 flex justify-center items-center content-center flex-col">

        <!-- Please Wait - Card -->
        <Card v-show="userLoggedIn" class="px-10 py-2">
            <template #content>
                <ProgressSpinner/>
                <p class="opacity-50 mt-5"> Please wait </p>
                
            </template>
        </Card>

        <!-- Sign In - Card -->
        <Card v-show="!userLoggedIn" class="p-4 md:w-[60%] m-10">
            
            <template #header>
                <div class="bg-indigo-500/30 rounded-md gap-2 p-2 flex-col flex justify-center items-center content-center">
                    
                    <p class="text-3xl font-semibold w-full text-left p-0 m-0"> 👋 Hey There! </p>
                    <p class="text-lg ml-4 w-full text-left"> Welcome to Sessions Bot </p> 

                </div>
            </template>

            <template #content >
                <div class="gap-1.5 p-2 flex-col flex justify-center items-center content-center">
                    
                    <p class="mt-5 text-md font-light w-full text-left p-0 m-0"> To start the configuration setup for this Guild, you must be signed into an account! Please simply sign in using Discord below. </p> 

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


    </section>

    <!-- Full Setup Wrap: -->
    <Transition name="fade" duration="1">
    <section
        v-show="!deferSetupContent" 
        class="w-full gap-4 md:w-[80%] p-3 flex justify-center flex-1 flex-wrap items-center content-center flex-col"
    >

        <!-- Start Setup Card: -->
        <Card 
            v-show="!setupStarted" 
            id="beginSetupWrap"  
            class="
                w-[85%]
                border-2 border-ring
                overflow-clip
                !bg-black/40
            "
        >

            <template #header>
                <div class="bg-zinc-900 border-b-2 border-b-ring !w-full !flex !flex-wrap !justify-start !items-center !content-center flex-row !text-nowrap">
                    
                    <p class="inline-flex font-bold content-center items-center w-fit h-fit p-2 pr-1">
                        <Info class="bg-ring w-fit rounded-md p-0.75 mr-1 inline h-fit m-0" />
                        You're setting up:
                    </p>

                    <p class=" 
                        bg-accent/50 
                        py-0.25 px-1.5 ml-0.5 rounded-md 
                        border-ring cursor-pointer
                        hover:border-modern-purple-discord border-1
                        inline w-fit h-fit p-0 m-0
                        font-bold text-sm ">
                        {{ guildName.toUpperCase() }}
                    </p>

                </div>
            </template>

            <template #content>

                <div class="flex flex-col justify-center items-center gap-5 ">

                    <p class="font-semibold text-xl"> Welcome to Sessions Bot! </p>

                    <div class="flex h-full justify-center gap-2.5 items-center content-center flex-row" id="guild-sessions-img-wrapper">
                        
                        <img src="../../assets/sessionsBotWithText.png" class="bg-zinc-400 rounded-full ring-2 ring-ring w-15 h-15">

                        <span class="bg-zinc-700 scale-75 w-fit px-1.5 rounded-2xl">
                            <Link2Icon class="scale-90" />
                        </span>

                        <img :src="guildIconImg" class="bg-zinc-400 rounded-full ring-2 ring-ring w-15 h-15">

                    </div>

                </div>
                
                

            </template>


            <template #footer>
            <div class="flex flex-col justify-center items-center gap-5 mt-5 ">

                <Button
                    @click="() => { if(Number(currentStep) <= 0) currentStep='1' } "
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
        <Stepper 
            v-show="setupStarted" 
            :value="currentStep" 
            @update:value="onStepChange" 
            linear
            class="w-[85%] !rounded-2xl overflow-clip border-2 border-zinc-700"
        >

            <!-- Timezone: -->
            <StepItem value="1">

                <Step class="!ring-2 !ring-offset ring-zinc-700">
                    <p :class="currentStep > 1 ? '!text-emerald-500' : ''"> Set Guild Timezone </p>
                </Step>
                <StepPanel v-slot="{ activateCallback }">
                    <div class="flex text-left pr-7 flex-col gap-2.5 py-6 w-full">

                        <p class="font-light text-primary"> Choose the preferred timezone within your guild: </p>

                        <IftaLabel class="inline w-fit h-auto">
                            <AutoComplete forceSelection dropdown dropdown-mode="blank" v-model="timezoneInputVal"
                                inputId="timezoneSelect" :suggestions="timezoneSuggestions" @complete="search"
                                variant="filled" />
                            <label for="timezoneSelect" class="flex items-center">
                                <CalendarCog class="opacity-80 m-0 p-0 mr-0.75 w-3.5 h-3.5" /> Timezone
                            </label>
                        </IftaLabel>

                        <Button class="w-fit" label="Next" @click="activateCallback('2')" />
                    </div>
                </StepPanel>

            </StepItem>

            <!-- Daily Signup: -->
            <StepItem value="2">
                <Step class="!ring-2 !ring-offset ring-zinc-700"> Configure Daily Singup </Step>
                <StepPanel v-slot="{ activateCallback }">


                    <div class="flex flex-col gap-2.5 pr-20 py-6 overflow-scroll flex-wrap max-w-full">


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



                                    <Button
                                        class="!text-foreground/80 !bg-accent/50 hover:bg-accent! w-fit flex flex-nowrap"
                                        size="small" variant="text" raised>
                                        <EyeOff class="w-4 h-4" />
                                        <p class="text-sm">Dismiss</p>
                                    </Button>

                                    <Button severity="success"
                                        class="!bg-accent/50 hover:bg-accent! w-fit flex flex-nowrap" size="small"
                                        variant="text" raised>
                                        <FilePlus2 class="w-4 h-4" />
                                        <p class="text-sm">Create</p>
                                    </Button>

                                </div>
                            </template>


                        </Card>

                        <IftaLabel class="inline w-fit h-auto">
                            <DatePicker input-id="postTimeSelect" class="w-fit" />
                            <label for="postTimeSelect">Post Time:</label>
                        </IftaLabel>



                        <div class="flex flex-row gap-3 flex-wrap">
                            <Button class="w-fit" label="Back" severity="secondary"
                                @click="activateCallback('1')" />
                            <Button class="w-fit" label="Next" @click="activateCallback('3')" />
                        </div>


                    </div>

                </StepPanel>
            </StepItem>

            <!-- Daily Schedules: -->
            <StepItem value="3">
                <Step class="!ring-2 !ring-offset ring-zinc-700"> Create Daily Schedules </Step>
                <StepPanel v-slot="{ activateCallback }">


                    <div class="flex flex-col gap-2.5 py-6">

                        <p class="text-zinc-300/50 text-left"> Coming Soon </p>

                        <div class="flex flex-row gap-3 flex-wrap">
                            <Button class="w-fit" label="Back" severity="secondary"
                                @click="activateCallback('2')" />
                            <Button class="w-fit text-shadow-2xs text-accent" raised label="Submit"
                                severity="success" @click="activateCallback('4'); submitting = true">
                            </Button>
                        </div>


                    </div>

                </StepPanel>
            </StepItem>

            <!-- HIDDEN - COMPLETE -->
            <StepItem value="4" v-show="submitting">

                <Step class="! ring-offset ring-2 ring-zinc-700"
                    pt:number:class="relative overflow-clip before:flex before:items-center before:justify-center before:content-center before:text-center before:content-['✓'] before:z-100 before:absolute before:w-full before:h-full before:bg-zinc-900">
                    COMPLETE!
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

    </section>
    </Transition>

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

</style>