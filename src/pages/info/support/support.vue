<script setup>
    // Imports:
    import { BadgeHelpIcon, FileTextIcon, HomeIcon, LayoutDashboard, MailIcon } from 'lucide-vue-next';
    import supportActionCard from './supportActionCard.vue'
    import { defaultDocument, defaultLocation, defaultWindow } from '@vueuse/core';
    import { useToast } from 'vue-toastification';
import { useNavStore } from '@/utils/stores/nav';
    
    // Variables:
    const route = useRoute()
    const router = useRouter()
    const toaster = useToast()
</script>

<template>
    
        
<main class="flex flex-1 justify-start items-center flex-col max-w-full">

    
    <!-- Sub-Header - Breadcrumb -->
    <section class="bg-black/30 py-1.5 pb-8 flex flex-wrap flex-col w-full h-fit gap-2">
        <div class="flex flex-wrap justify-between items-center flex-row pb-3 sm:pb-0 px-2.5 py-0 w-full h-fit">
            
            <!-- Page Breadcrumb: -->
            <Breadcrumb  class="rounded-md ring-1 ring-ring !min-w-fit !px-2.75 !py-2.25 relative top-3" 
                :model="[
                    { label: 'Home', href: '/', icon: HomeIcon },
                    { label: 'Support', href: '/support', icon: BadgeHelpIcon },
                ]">
                <template #item="{ item }">

                    <div 
                    class="cursor-pointer flex justify-center flex-row items-center content-center hover:underline"
                    @click="(e) => router.push(String(item.href))" 
                    :class=" String(item.href) === String(route.path) ? '!text-sky-400' : '',
                    String(item.href) == String(route?.matched[0]?.aliasOf?.path) ? 'text-sky-400' : ''">
                        <!-- Icon -->
                        <component class="!inline mx-1" v-if="item?.icon" :is="item?.icon" :size="17" />
                        <!-- Crumb Label -->
                        <span class="text-sm"> {{ item.label }} </span>
                    </div>

                </template>
            </Breadcrumb>

        </div>

        <!-- Hero Section -->
        <div class="flex flex-row w-full h-fit">

            <section class="flex flex-col justify-center items-center p-3.5 pt-2.5 w-full h-fit ">

                <!-- Page Heading -->
                <div class="flex w-full pb-2 pt-0 mb-3 gap-1.5 items-center justify-center content-center flex-row">
                    <BadgeHelpIcon size="38" stroke-width="2.5" class="drop-shadow-md drop-shadow-black/50" />
                    <h1 class="w-fit max-w-fit font-bold text-center text-shadow-md text-shadow-black/30 text-4xl"> Support Center </h1>
                </div>

                <i>
                <h1 class="font-stretch-95% font-bold text-center text-shadow-md text-shadow-black/30 text-xl"> Need help with Sessions Bot? </h1>
                <p class="mt-0.75 leading-snug sm:w-fit px-5 text-center text-zinc-400/70"> We’re here to make your events run smoothly. Let’s get your issue resolved! </p>
                </i>

            </section>

        </div>
    </section>


    <!-- Action Cards -->
    <h1 class="p-3.5 py-4 pb-0 font-stretch-95% font-bold text-center text-shadow-md text-shadow-black/40 text-xl w-full"> Quick Links </h1>
    <section class="flex flex-wrap justify-center px-15 items-center gap-3 p-3.5 h-fit w-full">

        <supportActionCard :title="'View Documentation'" :emoji="'📙'" :action="(e) => { defaultWindow.open('https://docs.sessionsbot.fyi', '_blank') }" />
        <supportActionCard :title="'FAQs'" :emoji="'❓'" :action="(e) => { defaultDocument.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' }) }"/>
        <supportActionCard :title="'Feature Requests'" :emoji="'🙏'" :action="(e) => {defaultWindow.open('https://github.com/orgs/SessionsBot/discussions/categories/ideas', '_blank')}"/>
        <supportActionCard :title="'Report a Bug'" :emoji="'🐛'" :action="(e) => {defaultWindow.open('https://github.com/SessionsBot/backend/issues', '_blank')}"/>
        <supportActionCard :title="'Contact Support'" :emoji="'📧'" :action="(e) => {defaultLocation.href = 'mailto:support@sessionsbot.fyi'}"/>
        <supportActionCard :title="'Status Page'" :emoji="'📡'" :action="(e) => {defaultWindow.open('https://status.sessionsbot.fyi', '_blank')}"/>

    </section>


    <!-- FAQs -->
    <h1 id="faqs" class="p-3.5 py-4 font-stretch-95% font-bold text-center text-shadow-md text-shadow-black/40 text-xl w-full"> FAQs </h1>
    <section class="bg-zinc-900 mb-2 flex flex-wrap justify-start items-start gap-3 h-fit w-full">

        <Accordion class="w-full">

            <AccordionPanel value="0">
                <AccordionHeader>
                     How do I get started? 
                </AccordionHeader>

                <AccordionContent><div class="text-white/60 leading-loose">
                    <p> - <i class="text-blue-300/80 cursor-pointer underline-offset-3 hover:underline" @click="useNavStore().externalPaths().inviteBotUsingDiscord()">Invite Sessions Bot</i> to your Discord Server (or any server you manage) </p>
                    <p> - Follow the setup link Session Bot will send to any available text channel within your server </p>
                    <p> - Follow the guild configuration process through the web dashboard </p>
                    <p> - Setup complete! </p>
                </div></AccordionContent>
            </AccordionPanel>

            <AccordionPanel value="1">
                <AccordionHeader>
                     How do I modify my guild's settings? 
                </AccordionHeader>

                <AccordionContent><div class="text-white/60 leading-loose">
                    <p> - Visit the Sessions Bot web dashboard at <i class="text-blue-300/80">sessionsbot.fyi</i> (you're here now) </p>
                    <p> - Sign in using your Discord account </p>
                    <p> - View your <i class="text-blue-300/80 cursor-pointer underline-offset-3 hover:underline" @click="$router.push('/dashboard')">Guild Dashboard</i> </p>
                    <p> - Modify configurations as you wish! </p>
                </div></AccordionContent>
            </AccordionPanel>

        </Accordion>

    </section>


    <!-- Contact Support -->
    <h1 id="contact" class="p-3.5 py-4 pb-0 font-stretch-95% font-bold text-center text-shadow-md text-shadow-black/40 text-xl w-full"> Still need help? </h1>
    <section class=" mb-7 flex flex-wrap flex-col justify-start md:items-center items-start  gap-3 p-3.5 pt-1.5 w-full">

        <p> Feel free to email our Support Team anytime! Please allow up to 48 hours for a response. </p>

        <Button @click="(e) => {defaultLocation.assign('mailto:support@sessionsbot.fyi')}" unstyled class="bg-amber-600/80 mt-2 hover:brightness-115 px-2 py-1.5 rounded-md flex flex-row gap-1 items-center justify-center transition-all">
            <MailIcon size="19" stroke-width="2.5" />
            <p class="font-medium">Contact Support</p>
        </Button>

    </section>

    

</main>
</template>