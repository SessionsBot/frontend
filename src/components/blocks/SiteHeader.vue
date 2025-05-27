<script setup>
    // Imports:
    import { ref } from 'vue';

    // Variables:
    const userLoggedIn = ref(false)

    // Functions:
    function signInUsingDiscord() {
        const discordLoginLink = 'https://discord.com/oauth2/authorize?client_id=1137768181604302848&response_type=code&redirect_uri=https%3A%2F%2Fbrilliant-austina-sessions-bot-discord-5fa4fab2.koyeb.app%2Fdashboard%2Flogin%2Fdiscord-redirect&scope=identify+guilds';
        window.open(discordLoginLink, '_blank'); // <-- can be changed to '_self' after development!
    }

</script>


<template>


    <header class="bg-modern-yellow-default/95 relative w-full p-2 pr-3 flex flex-wrap flex-row justify-between items-center text-center overflow-clip">

        <!-- Site Icon & Title: -->
        <div id="header_siteTitle" class="!cursor-pointer flex justify-center items-center flex-row gap-2" title="Sessions Discord Bot">
            <img class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-md shadow-black/50" draggable="false" src="../../assets/sessionsBot.png">
            <h1 class="text-2xl sm:text-3xl font-stretch-70% font-black text-shadow-md text-shadow-black/40"> Sessions Bot </h1>
        </div>

        <!-- [LG SCREENS] Header Buttons: -->
        <div class="flex-wrap flex-row gap-3 hidden sm:!flex">
            <!-- Invite Discord Bot: -->
            <button title="Invite Bot to Discord Server" class="bg-modern-green-default px-2 py-1 rounded-md !cursor-pointer font-semibold flex flex-row items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md shadow-black/35">
                <span class="material-symbols-rounded !w-fit !h-fit select-none !cursor-pointer">
                    add
                </span>
                <p>
                    Invite Bot
                </p>
            </button>

            <!-- Login w/ Discord Button: -->
            <button @click="signInUsingDiscord" title="Sign in with Discord" class="h-8 px-3 py-5 font-semibold rounded-md cursor-pointer flex items-center bg-modern-purple-discord hover:scale-105 active:scale-95 transition-all shadow-md shadow-black/35">

                <svg class="h-6 w-6 mr-1.5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
                    <g>
                        <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">

                        </path>
                    </g>
                </svg>

                <span> Continue with Discord </span>

            </button>
        </div>

        <!-- [SM SCREENS] Nav Button: -->
        <button class="flex sm:!hidden bg-modern-green-default shadow-md shadow-black/35 hover:scale-115 active:scale-95 rounded-md p-2 material-symbols-rounded transition-all !cursor-pointer" title="Main Menu">
            menu
        </button>

    </header>


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

</style>