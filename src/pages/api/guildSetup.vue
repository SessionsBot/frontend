<script setup>

// App Imports:
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNavStore } from '@/utils/stores/nav';

// UI:
import { EyeOff, FilePlus2, SettingsIcon, Trash2, TriangleAlert } from 'lucide-vue-next';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Step from 'primevue/step';
import StepItem from 'primevue/stepitem';
import StepPanel from 'primevue/steppanel';
import Stepper from 'primevue/stepper';
import { AutoComplete, useConfirm } from 'primevue';
import IftaLabel from 'primevue/iftalabel';
import ConfirmDialog from 'primevue/confirmdialog';
import DatePicker from 'primevue/datepicker';
import ProgressSpinner from 'primevue/progressspinner';

// Variables:
const router = useRouter()

const guildIconImg = ref('https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg');
const guildName = ref('GUILD_NAME');


// Guild Setup STEPS:
const currentStep = ref(1)
const submitting = ref(false)

function onStepChange(val) {
  currentStep.value = val
  // do other stuff
}


// TIME ZONE AUTO COMPLETE:
const timezoneInputVal = ref(null);
const timezoneSuggestions = ref([]);
const search = (event) => {
    timezoneSuggestions.value = [...Array(10).keys()].map((item) => event.query + '-' + item);
}


// Abort Setup - Confirmation:
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




// On Page Load:
onMounted(() => {
    // Hide Standard Header:
    const nav = useNavStore()
    nav.headerVisible = false;

    // Get query:
    const query = useRoute().query
    const guildId = query.guildId

    console.log('Query', query)
    console.log('Guild ID', guildId)

    const requestUrl = 'https://brilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app/api/discord/guild?guildId=' + guildId;

    fetch(requestUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Guild Data:', data);
            // You can now use the guild data as needed
            if (data?.guildIcon) {
                console.log('Updating img...')
                guildIconImg.value = data?.guildIcon
            }
            if (data?.data?.name) {
                console.log('Updating name...')
                guildName.value = data?.data?.name
            }
        })
        .catch(error => {
            console.error('Error fetching guild data:', error);
        });
})


</script>

<template>

    <main
        class="text-white text-center flex gap-2 flex-1 flex-col flex-wrap justify-start items-center content-center">

        <header class="bg-zinc-900 ring-2 ring-zinc-700/70 w-full flex justify-between">
            <!-- Site Title -->
            <section class="w-fit p-2 px-4 flex flex-row gap-2 justify-start items-center content-center">
                <img class="h-8 w-8 rounded-full ring-zinc-700 ring-2" :src="guildIconImg">
                <h1 class="text-3xl font-semibold text-left">
                    Guild Setup
                </h1>
                <SettingsIcon/>
            </section>

            
            <!-- Abort Setup PopUp: -->
            <ConfirmDialog group="headless" class="max-w-[90%]">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-8 bg-surface-0 rounded">
                    <div class="rounded-full ring-ring ring-3 bg-destructive-foreground text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                        <TriangleAlert class="text-white drop-shadow-md drop-shadow-black/50 w-18 h-18 p-1 mb-2"/>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0 px-5">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button size="small" label="Continue Setup" severity="success" raised @click="rejectCallback" class="w-fit"></Button>
                        <Button size="small" label="Leave & Discard" severity="danger" outlined @click="acceptCallback" class="w-fit"></Button>
                    </div>
                </div>
            </template>
            </ConfirmDialog>

            <!-- Abort Setup Button: -->
            <Button @click="requireConfirmation()" variant="text" severity="danger"
                size='small' class="flex justify-center items-center content-center flex-row flex-nowrap w-fit h-fit my-auto mr-2.5"
            >
                <Trash2 class="w-4 h-4"/>
                <p>Abort Setup</p>
            </Button>

        </header>


        <div class="w-full p-3">

            <Stepper class="!rounded-2xl overflow-clip border-2 border-zinc-700" :value="currentStep" @update:value="onStepChange">

                <StepItem value="1">
                    <Step class="!ring-2 ring-zinc-700"> <p :class="currentStep > 1 ? '!text-emerald-500' : ''"> Set Guild Timezone </p> </Step>
                    <StepPanel v-slot="{ activateCallback }">


                        <div class="flex flex-col gap-4.5 py-6 w-full">
                            <IftaLabel class="inline w-fit h-auto">
                                <AutoComplete v-model="timezoneInputVal" inputId="timezoneSelect"
                                    :suggestions="timezoneSuggestions" @complete="search" variant="filled" />
                                <label for="timezoneSelect">Timezone:</label>
                            </IftaLabel>

                            <Button class="w-fit" label="Next" @click="activateCallback('2')" />
                        </div>

                    </StepPanel>
                </StepItem>

                <StepItem value="2">
                    <Step class="!ring-2 ring-zinc-700"> Configure Daily Singup </Step>
                    <StepPanel v-slot="{ activateCallback }">


                        <div class="flex flex-col gap-4.5 py-6">
                            

                            <Card class="text-left w-fit !bg-blue-400/30 mr-4 shadow-md">

                                <template #title> 
                                    <p class="bg-accent w-fit p-0.5 rounded-sm shadow-sm">
                                        ✨ Automatic Signup Channel ✨ 
                                    </p>
                                </template>

                                <template #content><div class="flex flex-col">
                                    <ol class="list-inside list-disc text-sm">
                                        <li> Have Sessions Bot create a pre-configured 'Signup Channel' for your guild!</li>
                                        <li> By default, it creates a private text channel with only read access for all members.</li>
                                        <li> All you have to do is modify access permissions later! </li>
                                    </ol>
                                </div></template>

                                <template #footer>
                                    <div class="flex justify-start gap-2 mt-1">
                                    

                                        
                                        <Button class="!text-foreground/80 !bg-accent/50 hover:bg-accent! w-fit flex flex-nowrap" size="small" variant="text" raised>
                                            <EyeOff class="w-4 h-4"/>
                                            <p class="text-sm">Dismiss</p>
                                        </Button>

                                        <Button severity="success" class="!bg-accent/50 hover:bg-accent! w-fit flex flex-nowrap" size="small" variant="text" raised>
                                            <FilePlus2 class="w-4 h-4"/>
                                            <p class="text-sm">Create</p>
                                        </Button>

                                    </div>
                                </template>


                            </Card>

                            <IftaLabel class="inline w-fit h-auto">
                                <DatePicker input-id="postTimeSelect" class="w-fit"/>
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

                <StepItem value="3">
                    <Step class="!ring-2 ring-zinc-700"> Create Daily Schedules </Step>
                    <StepPanel v-slot="{ activateCallback }">


                        <div class="flex flex-col gap-4.5 py-6">
                            
                            <p class="text-zinc-300/50 text-left"> Coming Soon </p>

                            <div class="flex flex-row gap-3 flex-wrap">
                                <Button class="w-fit" label="Back" severity="secondary"
                                    @click="activateCallback('2')" />
                                <Button class="w-fit text-shadow-2xs text-accent" raised label="Submit" severity="success" @click="activateCallback('4'); submitting = true" >
                                </Button>
                            </div>


                        </div>

                    </StepPanel>
                </StepItem>

                <!-- HIDDEN - COMPLETE -->
                <StepItem value="4" v-show="submitting">
                    <Step> COMPLETE! </Step>
                    <StepPanel class="w-full" v-slot="{ activateCallback }">


                        <div class="w-full flex flex-col justify-center items-center content-center">
                            
                            <p class="text-zinc-300/50 w-full"> Please Wait </p>

                            <ProgressSpinner class="!h-5 !w-5 m-0 p-0"/>

                        </div>

                    </StepPanel>
                </StepItem>

            </Stepper>
        </div>

        <!-- OLD LANDING WRAP: -->
        <section
            class="hidden text-white bg-black/50 p-8 max-w-[90%] gap-3.5 text-center ring-2 ring-neutral-500/30 rounded-sm shadow-md shadow-black/50 flex-col flex-wrap justify-center items-center content-center">

            <!-- Heading: -->
            <h1 class="text-4xl font-extrabold">Welcome to Sessions Bot!</h1>

            <!-- Guild Connection Info: -->
            <div
                class="text-white text-shadow-md text-shadow-black/50 flex gap-1.5 flex-row flex-wrap justify-center items-center content-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#FFFFFF">
                    <path
                        d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                </svg>
                <p> You're tying to configure:</p>
                <div
                    class="bg-neutral-600/80 ring-2 ring-neutral-500/80 rounded-sm flex py-0.5 px-1.5 gap-1 flex-row flex-wrap justify-center items-center content-center">
                    <img class="h-5 w-5 rounded-full ring-2 ring-neutral-500" :src="guildIconImg" draggable="false">
                    {{ guildName }}
                </div>
            </div>

            <!-- Sessions Bot Logo & Guild Logo Image: -->

            <div class="flex p-3 gap-2.5 rounded-md flex-row justify-center items-center contain-content">

                <img class="max-w-18 rounded-full ring-2 ring-neutral-500 shadow-md shadow-black/50"
                    src="../../assets/sessionsBotWithText.png" draggable="false">

                <svg class="opacity-50 drop-shadow-md drop-shadow-black/70" xmlns="http://www.w3.org/2000/svg"
                    height="35px" viewBox="0 -960 960 960" width="35px" fill="#FFFFFF">
                    <path
                        d="M288-288q-79.68 0-135.84-56.23Q96-400.45 96-480.23 96-560 152.16-616q56.16-56 135.84-56h108q15.3 0 25.65 10.29Q432-651.42 432-636.21t-10.35 25.71Q411.3-600 396-600H288q-50 0-85 35t-35 85q0 50 35 85t85 35h108q15.3 0 25.65 10.29Q432-339.42 432-324.21t-10.35 25.71Q411.3-288 396-288H288Zm84.28-156q-15.28 0-25.78-10.29-10.5-10.29-10.5-25.5t10.34-25.71q10.34-10.5 25.62-10.5h215.76q15.28 0 25.78 10.29 10.5 10.29 10.5 25.5t-10.34 25.71Q603.32-444 588.04-444H372.28ZM564-288q-15.3 0-25.65-10.29Q528-308.58 528-323.79t10.35-25.71Q548.7-360 564-360h108q50 0 85-35t35-85q0-50-35-85t-85-35H564q-15.3 0-25.65-10.29Q528-620.58 528-635.79t10.35-25.71Q548.7-672 564-672h108q79.68 0 135.84 56.23 56.16 56.22 56.16 136Q864-400 807.84-344 751.68-288 672-288H564Z" />
                </svg>

                <img class="max-w-18 rounded-full ring-2 ring-neutral-500 shadow-md shadow-black/50" :src="guildIconImg"
                    draggable="false">

            </div>


            <!-- Buttons Wrap -->
            <div class="flex p-2 gap-5.5 flex-wrap flex-row justify-center items-center contain-content">
                <button class="default_button">
                    Homepage
                </button>

                <button class="default_button">
                    Begin Setup
                </button>
            </div>

            <!-- Permissions Required Info: -->
            <div
                class="bg-neutral-600/80 ring-2 ring-neutral-500/80 rounded-sm p-1 text-white text-shadow-md text-shadow-black/50 flex gap-1 flex-row flex-wrap justify-center items-center content-center">
                <svg class="opacity-55" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                    width="20px" fill="#FFFFFF">
                    <path
                        d="M263.72-96Q234-96 213-117.15T192-168v-384q0-29.7 21.15-50.85Q234.3-624 264-624h24v-96q0-79.68 56.23-135.84 56.22-56.16 136-56.16Q560-912 616-855.84q56 56.16 56 135.84v96h24q29.7 0 50.85 21.15Q768-581.7 768-552v384q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm216.49-192Q510-288 531-309.21t21-51Q552-390 530.79-411t-51-21Q450-432 429-410.79t-21 51Q408-330 429.21-309t51 21ZM360-624h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Z" />
                </svg>
                <p class="text-xs text-white/80"> You're need 'Administrator' permissions to do this!</p>
            </div>

        </section>

    </main>

</template>


<style>
.p-steppanel {
    background: rgba(0, 0, 0, 0.25) !important;
}

/* .p-step{
  border-bottom: 2px solid var(--color-zinc-700);
} */

/* Make completed steps a different color if you want */
.p-step-header[data-p*="completed"], .p-step-number[data-p*="completed"], .p-step-title[data-p*="completed"] {
  color: var(--color-emerald-500) !important;
}

.p-step{
    background: var(--color-zinc-900);
}
</style>