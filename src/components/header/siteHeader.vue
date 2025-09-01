<script setup lang="ts">
    // Imports:
    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    import { useAuthStore } from '@/utils/stores/auth'
    import { BadgeHelpIcon, LayoutDashboardIcon, MenuIcon, PlusCircle } from 'lucide-vue-next';
    import { useNavStore } from '@/utils/stores/nav';
    import { defaultDocument, defaultWindow, MaybeElementRef } from '@vueuse/core';
    import navigationMenu from './nav.vue'
    import DiscordIcon from '@/assets/svgs/discord-icon.vue';
    
    // Auth:
    const auth = useAuthStore()
    const userLoggedIn = computed(() => auth.isAuthenticated)
    const logoutUser = () => auth.signOut()

    // NAVIGATION:
    const nav =  useNavStore()
    const navMenuVisible = computed(() => nav.navVisible)
    const closeNav = () => nav.closeNav()
    const openNav = () => nav.openNav()

    // Redirect Fns:
    const router = useRouter()
    const homepage = () => router.push('/')
    const dashboard = () => router.push('/dashboard');
    const pricingPlans = () => router.push('/pricing');
    const myAccount = () => router.push('/account');

    // Router Path Checks - Hides Elements if Requested:
    const route = useRoute() 

</script>


<template>
    <transition name="fade" mode="out-in">
    <header v-if="nav.headerVisible">
        <!-- Main Site Header: -->
        <div class="bg-zinc-900 z-10 fixed top-0 right-0 left-0 text-white min-w-full gap-3 p-2.5 pr-3 flex flex-nowrap flex-row justify-between items-center text-center overflow-clip">

            <!-- Site Icon & Title: -->
            <div id="header_siteTitle" @click="homepage" class="!cursor-pointer flex justify-center items-center flex-row gap-2" title="Sessions Discord Bot">
                <img class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-md shadow-modern-purple-discord/80 ring-1 ring-white/15" draggable="false" src="/sessionsBot.png">
                <h1 class="text-white/90 text-2xl sm:text-3xl text-nowrap font-stretch-70% font-black text-shadow-md text-shadow-modern-purple-discord/70"> Sessions Bot </h1>
            </div>

            <!-- Side Buttons: -->
            <div class="flex flex-nowrap justify-center items-center content-center gap-3">
                <!-- [LG SCREENS] Buttons: -->
                <div class="flex-wrap justify-end flex-row gap-3 hidden sm:!flex">

                    <!-- Invite Discord Bot: -->
                    <Button unstyled @click="nav.externalPaths().inviteBotUsingDiscord()"
                        class="bg-zinc-600 my-2 px-2.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:scale-105 hover:brightness-115 transition-all"
                    > 
                        <DiscordIcon class="size-4.5 mr-1" />
                        Invite Bot 
                    </Button>

                    <!-- Login w/ Discord Button: -->
                     <!-- Invite Discord Bot: -->
                    <Button unstyled v-if="!userLoggedIn" @click="auth.authWithDiscord($route.path)"
                        class="bg-indigo-500 my-2 px-2.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:scale-105 hover:brightness-115 transition-all"
                    > 
                        <DiscordIcon class="size-4.5 mr-1" />
                        Continue with Discord
                    </Button>


                    <!-- View Dashboard: -->
                    <Transition name="fade">
                    <Button unstyled @click="router.push('/dashboard')"
                        v-if="userLoggedIn && route.name != 'dashboard'"
                        class="bg-indigo-500 my-2 px-2.25 py-2 font-semibold rounded-md cursor-pointer flex justify-center items-center content-center hover:scale-105 hover:brightness-115 transition-all"
                    > 
                        <LayoutDashboardIcon class="size-5 mr-1" />
                        Dashboard
                    </Button>
                
                    
                    </Transition>

                </div>

                <!-- [ALL SCREENS] Nav Button: -->
                <Button @click="openNav" title="Main Menu" class="bg-modern-green-default size-10 rounded-md flex flex-row  flex-nowrap justify-center items-center content-center cursor-pointer hover:brightness-115 hover:scale-105 transition-all" unstyled>
                    <MenuIcon />
                </Button>

            </div>

        </div>
        <!-- In Dev Alert / Msg - Bar: -->
        <div hidden class="bg-amber-600 fixed top-18.75 w-full h-fit p-2">
            <p class="font-black text-shadow-md"> 🛠️ Sessions Bot is still in active development, bugs are expected! </p>
        </div>
    </header>
    </transition>
    
    
    <!-- Nav Menu Screen: -->
    <Transition name="fade">
     <navigationMenu/>
    </Transition>


</template>

<style>

    #header_siteTitle{
        position: relative;
        z-index: 0;
        font-variant: small-caps;
    }

    #header_siteTitle::before{
        position: absolute;
        content: '';
        left: -15px;
        width: calc(110% + 10px);
        height: calc(110% + 51px);
        /* border-radius: 23%; */

        z-index: -1;
    }

    /* ---- Vue Animations: ---- */

    /* Nav Menu */
    .navMenu-enter-from,
    .navMenu-leave-to {
        opacity: 0;
        transform: translateX(2rem) scale(0.95);
    }

    .navMenu-enter-to,
    .navMenu-leave-from {
        opacity: 1;
        transform: translateX(0) scale(1);
    }

    .navMenu-enter-active,
    .navMenu-leave-active {
        transition: all 0.4s ease;
    }

</style>