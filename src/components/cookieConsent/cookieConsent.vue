<script lang="ts" setup>
    import { Button } from 'primevue';

    // Visibility Toggles:
    const viewCookieConsent = ref(false)
    const viewCookiePreferences = ref(false)

    // Consent Choices:
    const necessaryChoice = ref(true);
    const analyticsChoice = ref(true);
    const preferencesChoice = ref(true);
    const marketingChoice = ref(true)

    // Saved Cookie Consent Choices:
    const savedChoices = computed(() => localStorage.getItem('cookieConsent'))

    // Save New Cookie Concent Choices:
    function saveChoices(selectAll?:boolean){

        let chose = [];
        if(necessaryChoice.value || selectAll) chose.push('necessary');
        if(analyticsChoice.value || selectAll) chose.push('analytics');
        if(preferencesChoice.value || selectAll) chose.push('preferences');
        if(marketingChoice.value || selectAll) chose.push('marketing');
        localStorage.setItem('cookieConsent', JSON.stringify(chose));

        // Update google consent:
        // @ts-ignore
        window.gtag('consent', 'update', {
            'analytics_storage': analyticsChoice.value || selectAll ? 'granted' : 'denied',
            'ad_storage': marketingChoice.value || selectAll ? 'granted' : 'denied'
        });
    }


    onMounted(() => {
        // Check for consent:
        if(!savedChoices.value){
            // Never consented - show dialog
            console.info('No cookie preferences found!')
            viewCookieConsent.value = true;
        } else {
            // Previously consented
            // console.log('Cookie preferences found!', savedChoices.value)
            viewCookieConsent.value = false;
        }
    })

</script>

<template>

    <!-- Cookie Consent Banner - Bottom of Page -->
    <Transition name="scale-fade">
    <div v-show="viewCookieConsent" class="bg-zinc-900 ring-1 ring-ring/50 shadow-md shadow-black/30 z-50 fixed bottom-2 gap-2.5 right-2 p-4 rounded-md mx-4 my-2 flex flex-col">

        <div class="flex flex-row">
            <p class="font-semibold"> 🍪 Want Cookies? </p>
        </div>
        
        <p class="text-xs mb-0.75 text-zinc-400 px-2 max-w-70"> We use cookies and similar technologies to help personalize content and offer a better experience. You can opt to customize them by clicking the preferences button. </p>

        <div class="flex justify-end flex-row gap-2.5 text-white">
            <Button @click="viewCookieConsent=false; $nextTick(); viewCookiePreferences=true;" unstyled class="bg-zinc-700/80 py-1.25 px-2 rounded-md text-xs font-medium cursor-pointer hover:brightness-110 transition-all" >
                Preferences
            </Button>
            <Button @click="viewCookieConsent=false; saveChoices(true);" unstyled class="bg-indigo-500 py-1.25 px-2 rounded-md text-xs font-medium cursor-pointer hover:brightness-110 transition-all" >
                Accept All
            </Button>
        </div>

    </div>
    </Transition>

    <!--  -->
    <Dialog v-model:visible="viewCookiePreferences" modal header="Edit Profile" :style="{ width: '25rem', margin: '15px' }">
    <template #container="$this">
    <div class="flex flex-col gap-2 p-4 pt-2.5 m-4">

        <h1 class="font-bold"> 🍪 Cookie Preferences </h1>

        <div class="w-[88%] my-1.75 self-center h-[2px] rounded-full bg-ring" />

        <!-- Necessary Cookies -->
        <div class="flex flex-row flex-nowrap">
            <!-- Cookie Detail -->
             <div class="flex flex-wrap flex-col gap-1">
                <p class="font-semibold text-sm"> Necessary <span class="text-xs text-zinc-400 italic"> (Always on) </span> </p>
                <p class="text-zinc-400 mx-3 text-xs"> Essential for the website to function properly (e.g. remembering your cookie preferences, security, and core features). These cannot be disabled. </p>
            </div>
            <!-- Cookie Toggle -->
             <div class="m-1 ml-3">
                <ToggleSwitch disabled v-model="necessaryChoice" />
             </div>
        </div>

        <!-- Analytics Cookies -->
        <div class="flex flex-row flex-nowrap">
            <!-- Cookie Detail -->
             <div class="flex flex-wrap flex-col gap-1">
                <p class="font-semibold text-sm"> Analytics </p>
                <p class="text-zinc-400 mx-3 text-xs"> Helps us understand how visitors use our site so we can improve performance and content. (e.g. Google Analytics) </p>
            </div>
            <!-- Cookie Toggle -->
             <div class="m-1 ml-3">
                <ToggleSwitch v-model="analyticsChoice" />
             </div>
        </div>

        <!-- Preference Cookies -->
        <div class="flex flex-row flex-nowrap">
            <!-- Cookie Detail -->
             <div class="flex flex-wrap flex-col gap-1">
                <p class="font-semibold text-sm"> Preferences </p>
                <p class="text-zinc-400 mx-3 text-xs"> Allows the site to remember your choices (like language, theme, or layout) to give you a more personalized experience. </p>
            </div>
            <!-- Cookie Toggle -->
             <div class="m-1 ml-3">
                <ToggleSwitch v-model="preferencesChoice" />
             </div>
        </div>

        <!-- Marketing Cookies -->
        <div class="flex flex-row flex-nowrap">
            <!-- Cookie Detail -->
             <div class="flex flex-wrap flex-col gap-1">
                <p class="font-semibold text-sm"> Marketing </p>
                <p class="text-zinc-400 mx-3 text-xs"> Used to deliver relevant ads and measure their effectiveness, often across different websites and apps. </p>
            </div>
            <!-- Cookie Toggle -->
             <div class="m-1 ml-3">
                <ToggleSwitch v-model="marketingChoice" />
             </div>
        </div>

        

        <Button @click="$this.closeCallback(); saveChoices();" unstyled class="bg-indigo-500 py-1.25 px-2 w-[75%] min-w-fit self-center mt-4 rounded-md text-xs font-medium cursor-pointer hover:bg-indigo-400 transition-all" >
            Save
        </Button>

    </div>
    </template>

    <template #closebutton>
        <span hidden />
    </template>
    </Dialog>


    

</template>


<style scoped>

    :deep().p-toggleswitch{
        --p-toggleswitch-checked-background: var(--color-indigo-500);
        --p-toggleswitch-checked-hover-background: var(--color-indigo-400);
    }

    :deep().p-toggleswitch-checked{
        --p-toggleswitch-disabled-background: var(--color-indigo-500)
    }

    .p-toggleswitch.p-disabled{
        opacity: .5;
    }


</style>