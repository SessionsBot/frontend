<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useAuthStore } from '../../utils/stores/auth';
    import { useRoute } from 'vue-router'
    
    const route = useRoute()
    
    const customSubHeading = computed(() => route.query.message || 'Sign In using Discord to continue...')
    const customDetailsString = ref('In order to access this page you must be signed in to an account! To procced, sign in using your Discord account by clicking on the button below.')

    const auth = useAuthStore()
    const authWithDiscord = () => auth.authWithDiscord()
    const discordIntegrationInfoRedirect = () => window.open('https://discord.com/developers/docs/topics/oauth2', '_blank')

    // Check for query data/messages:
    onMounted(() => {
        const q = route.query;
        // Discord Auth Error:
        if(q?.discordAuthError){
            customDetailsString.value = 'An error occured when attempting to authenticate with your Discord Account! Please start over and try again, if this issue persists please contact our support team.'
        }
    })

</script>


<template>
<div class="
    flex flex-wrap justify-center items-center content-center
    flex-1 w-full
">

    <!-- My Account Wrap: -->
    <div class="
        bg-neutral-900/50 text-white
        rounded-md ring-offset-4 ring-offset-neutral-200/30
        shadow-sm shadow-black/50 text-shadow-xs text-shadow-black/40
        flex flex-nowrap justify-center items-center content-center flex-col
        w-[80%] sm:w-[65%] md:w-155 h-fit
        p-2.5 gap-2
    ">

        <!-- Header / Welcome Msg: -->
        <div class="
            flex flex-nowrap items-start text-start flex-col
            w-full mt-1
        ">
            <h1 class="ml-0.5 text-3xl font-extrabold text-shadow-sm text-shadow-black/40">
                👋 Welcome Back!
            </h1>
            <p class="text-neutral-300/70 text-sm font-semibold ml-5.5 text-shadow-sm text-shadow-black/30">
                {{ customSubHeading }}
            </p>
            
        </div>


        <!-- Divider Line: -->
        <div class=" h-[2px] w-[90%] my-1 bg-gray-400/25 rounded-xs"> </div>


        <!-- More Information: -->
        <div class="
            flex flex-row flex-wrap justify-start 
            bg-gray-800/60 ring-2 ring-gray-300/65
            text-white/90
            gap-2 w-[82%] h-fit my-1.5
            rounded-sm overflow-clip
        ">

            <div class="p-1 w-fit bg-modern-red-default/55 flex justify-center items-center content-center">
                <svg class="mb-0.25" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#FFFFFF"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </div>


            <p class="font-stretch-semi-condensed flex flex-1 pl-0 p-1.5 flex-wrap text-sm"> {{ customDetailsString }} </p>

        </div>

        <!-- Divider Line: -->
        <div class=" h-[2px] w-[90%] my-1 bg-gray-400/25 rounded-xs"> </div>


        <!-- Login w/ Discord Button: -->
        <button @click="authWithDiscord" title="Sign in with Discord" class="bg-modern-purple-discord/90 px-3 py-2 mt-1.5 font-semibold rounded-md cursor-pointer flex items-center hover:scale-105 active:scale-95 transition-all shadow-sm shadow-black/70">
            <svg class="h-4.5 w-4.5 mr-1.75 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
                <g>
                    <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">

                    </path>
                </g>
            </svg>
            <p class="text-sm"> 
                Continue with Discord 
            </p>
        </button>


        <!-- Secure Login Info: -->
        <div class="
            flex flex-nowrap flex-row justify-center items-center content-center 
            text-neutral-400/50 fill-neutral-400/50 text-[10px] text-center 
            text-shadow-none font-stretch-condensed font-medium

            hover:text-green-400/30 hover:fill-green-400/30 rounded-xs
            p-0.5 cursor-pointer
            " 
            title="Discord Integration Information"
            @click="discordIntegrationInfoRedirect"
        >

            <svg class="fill-inherit rotate-12" xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#FFFFFF"><path d="M263.72-96Q234-96 213-117.15T192-168v-384q0-29.7 21.15-50.85Q234.3-624 264-624h24v-96q0-79.68 56.23-135.84 56.22-56.16 136-56.16Q560-912 616-855.84q56 56.16 56 135.84v96h24q29.7 0 50.85 21.15Q768-581.7 768-552v384q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm.28-72h432v-384H264v384Zm216.21-120Q510-288 531-309.21t21-51Q552-390 530.79-411t-51-21Q450-432 429-410.79t-21 51Q408-330 429.21-309t51 21ZM360-624h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Zm-96 456v-384 384Z"/></svg>

            <p> Secure Discord Authentication</p>

        </div>
        

    </div>

</div>
</template>


<style>

</style>