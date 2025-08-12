<script setup>
    // Imports:
    import { BadgeHelpIcon, FileTextIcon, HomeIcon, LayoutDashboard, MailIcon } from 'lucide-vue-next';
import supportActionCard from './supportActionCard.vue'
    // Variables:
    const route = useRoute()
    const router = useRouter()
    

</script>

<template>
    
        
<main class="flex flex-1 justify-start items-center flex-col max-w-full">
    
    <!-- Sub-Header - Breadcrumb -->
    <section class="flex flex-wrap justify-between items-center flex-row gap-3 px-2 pt-3 pb-0  w-full h-fit">
        
        <!-- Page Breadcrumb: -->
        <Breadcrumb  class="rounded-md !min-w-fit !px-4 !py-3" 
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

    </section>

    <!-- Hero Section -->
    <div class="flex flex-row w-full h-fit">

        <section class="flex flex-1/10 flex-col justify-center items-center p-3.5 w-full h-fit ">

            <!-- Page Heading -->
            <div class="flex w-full py-2 pb-5 gap-1.5 items-center justify-center content-center flex-row">
                <BadgeHelpIcon size="38" stroke-width="2.5" class="drop-shadow-md drop-shadow-black/50" />
                <h1 class="font-stretch-95% w-fit font-bold text-center text-shadow-md text-shadow-black/30 text-4xl"> Support Center </h1>
            </div>

            <h1 class="font-stretch-95% font-bold text-start text-shadow-md text-shadow-black/30 text-xl"> Need help with Sessions Bot? </h1>
            <p class="leading-snug pl-1"> We’re here to make your events run smoothly. Let’s get your issue resolved! </p>

        </section>

    </div>


    <!-- Action Cards -->
    <h1 class="p-3.5 py-4 pb-0 font-stretch-95% font-bold text-start text-shadow-md text-shadow-black/30 text-xl w-full"> Quick Links: </h1>
    <section class="flex flex-wrap justify-center px-15 items-center gap-3 p-3.5 h-fit w-full">

        <supportActionCard :title="'View Documentation'" :emoji="'📙'" />
        <supportActionCard :title="'FAQs'" :emoji="'❓'" />
        <supportActionCard :title="'Feature Requests'" :emoji="'🙏'" />
        <supportActionCard :title="'Report a Bug'" :emoji="'🐛'" />

    </section>


    <!-- FAQs -->
    <h1 class="p-3.5 py-4 font-stretch-95% font-bold text-start text-shadow-md text-shadow-black/30 text-xl w-full"> FAQs: </h1>
    <section class="bg-zinc-900 mb-10 flex flex-wrap justify-start items-center gap-3 p-3.5 h-60 w-full">

    

    </section>

    

</main>
</template>