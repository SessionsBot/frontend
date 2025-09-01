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
                <img class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-md shadow-modern-purple-discord/80 ring-1 ring-white/15" draggable="false" src="@/assets/sessionsBot.png">
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
                    <button v-if="!userLoggedIn" @click="auth.authWithDiscord()" title="Sign in with Discord" class="bg-modern-purple-discord px-3 py-2 font-semibold rounded-md cursor-pointer flex items-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/35">
                        <svg class="h-5 w-5 mr-1.5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
                            <g>
                                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">

                                </path>
                            </g>
                        </svg>
                        <p> 
                            Continue with Discord 
                        </p>
                    </button>

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