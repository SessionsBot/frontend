<script setup>

// App Imports:
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNavStore } from '@/utils/stores/nav';

// UI:
import { CalendarCog, EyeOff, FilePlus2, SettingsIcon, Trash2, TriangleAlert } from 'lucide-vue-next';
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

// Variables:
const router = useRouter()

const guildIconImg = ref('https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg');
const guildName = ref('GUILD_NAME');


// Guild Setup STEPS:
const currentStep = ref("1")
const submitting = ref(false)

function onStepChange(val) {
  currentStep.value = val
  // do other stuff
}


// TIME ZONE AUTO COMPLETE:
const timezoneInputVal = ref(null);
const timezoneSuggestions = ref(['US - Chicago','US - New York','US - Chicago',]);
const search = (event) => {
    timezoneSuggestions.value = ['US - Chicago','US - New York','US - Chicago',];
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

        <header class="bg-zinc-900 ring-2 h-15 ring-zinc-700/70 w-full flex justify-between">
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
                    <div class="rounded-full ring-ring ring-3 bg-destructive-foreground text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20">
                        <TriangleAlert class="text-white drop-shadow-md drop-shadow-black/50 w-18 h-18 p-1 mb-2"/>
                    </div>
                    <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
                    <p class="mb-0 text-center px-5">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-6">
                        <Button size="small" label="Continue Setup" severity="success" variant="outlined" @click="rejectCallback"class="w-fit !border-emerald-500 hover:!bg-emerald-800 text-shadow-sm text-shadow-black/30"></Button>
                        <Button size="small" label="Leave & Discard" severity="danger" @click="acceptCallback" class="w-fit" ></Button>
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


        <div class="w-full md:w-[80%] p-3">

            <Stepper linear class="!rounded-2xl overflow-clip border-2 border-zinc-700" :value="currentStep" @update:value="onStepChange">

                <StepItem value="1">
                    
                    <Step class="!ring-2 ring-zinc-700"> 
                        <p  :class="currentStep > 1 ? '!text-emerald-500' : ''"> Set Guild Timezone </p>
                    </Step>
                    <StepPanel v-slot="{ activateCallback }">
                        <div class="flex text-left pr-7 flex-col gap-2.5 py-6 w-full">
                            
                            <p class="text-primary"> Please choose the Universal Timezone used for your Discord Guild.</p>
                            
                            <IftaLabel class="inline w-fit h-auto">
                                <IconField>
                                    <InputIcon> <CalendarCog class="opacity-80 m-0 p-0 pr-1 absolute"/> </InputIcon>
                                    <AutoComplete forceSelection v-model="timezoneInputVal" inputId="timezoneSelect" :suggestions="timezoneSuggestions" @complete="search" variant="filled" />
                                </IconField>
                                
                                <label for="timezoneSelect"> Timezone:</label>
                            </IftaLabel>

                            <Button class="w-fit" label="Next" @click="activateCallback('2')" />
                        </div>
                    </StepPanel>

                </StepItem>

                <StepItem value="2">
                    <Step class="!ring-2 ring-zinc-700"> Configure Daily Singup </Step>
                    <StepPanel v-slot="{ activateCallback }">


                        <div class="flex flex-col gap-2.5 py-6">
                            

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


                        <div class="flex flex-col gap-2.5 py-6">
                            
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
                <StepItem value="4" class="hidden">
                    <Step class="!ring-0 ring-zinc-700"> COMPLETE! </Step>
                    <StepPanel class="relative h-25" v-slot="{ activateCallback }">

                        <div class="absolute flex text-center justify-center items-center content-center flex-col left-0 w-full h-full">

                            
                            <ProgressSpinner class="!h-12 !w-12 m-0 p-0">
                                Please Wait
                            </ProgressSpinner>
                            <p class="text-zinc-300/50 w-full text-[8px] ml-2 relative top-1"> Please Wait... </p>


                        </div>

                    </StepPanel>
                </StepItem>

            </Stepper>
        </div>

    </main>

</template>


<style scoped>
    :deep().p-steppanel {
        background: rgba(0, 0, 0, 0.4) !important;
    }

    /* Make completed steps a different color if you want */
    :deep().p-step-header[data-p*="completed"], 
    :deep().p-step-number[data-p*="completed"], 
    :deep().p-step-title[data-p*="completed"] {
        color: var(--color-emerald-500) !important;
    }

    :deep().p-step{
        background: var(--color-zinc-900);
    }
</style>