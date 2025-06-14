<script setup> 
    // Imports:
    import { ref, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router'

    import { useAuthStore } from '../utils/stores/auth'

    // Auth:
    const auth = useAuthStore()
    const userLoggedIn = computed(() => auth.isAuthenticated)

    const alertUserData = async () => {
        const data = await auth.getUserData()
        let prettyUserData = JSON.stringify(data, '*', 2);
        alert('Your account information : \n' + prettyUserData);
    } 


</script>

<template> <div class="flex flex-col w-full h-full flex-1 items-center justify-start">

    <!-- No Access Wrap: -->
    <main v-if="!userLoggedIn" class=" flex flex-col w-full h-full flex-1 items-center justify-center text-shadow-black/50 shadow-black/50 drop-shadow-black/50">
       
        <div class="text-white bg-white/40 w-[85%] sm:w-140 rounded-lg overflow-clip shadow-md shadow-black/50 flex-col flex flex-wrap justify-center items-center content-center text-center">
            <!-- Card Header -->
            <header class="flex p-2.5 mb-3 gap-1.5 w-full bg-black/50 text-start text-xs flex-wrap justify-start items-center content-center">
                <p class="w-fit text-center bg-modern-red-default/70 contrast-125 px-2 py-0.5 rounded-md text-2xl font-bold text-shadow-sm text-shadow-black/20"> 🔒 No Access!</p>
                <p class="w-full text-white/80 font-light text-[15px] pl-1.5 text-shadow-sm text-shadow-black/50"> You have to login using Discord before accessing the Web Dashboard Panel! </p>
            </header>

            <!-- More Info - Discord Intg. Wrap -->
            <div class="w-full mb-1.5 flex flex-nowrap justify-center items-center content-center text-center flex-row">
                <div class="flex flex-[0.05] bg-black/50 h-[5px]"></div>
                <p class="text-white/80 py-0.75 px-2 rounded-md text-[10px] font-mono bg-black/50"> Integration Information: </p>
                <div class="flex flex-1 bg-black/50 h-[5px]"></div>
            </div>
            <div class="flex px-3 py-2 gap-2 text-black/80 w-full text-start text-xs flex-wrap justify-center items-center content-center">

                <div class="bg-black/50 flex flex-row w-full mx-5 flex-nowrap justify-start items-start content-center rounded-sm gap-1.5">
                    <svg class="bg-modern-red-default/70 ring-2 ring-gray-800 fill-white/80 pr-[1px] pb-[1.5px] p-[1px] h-4.5 w-4.5 rounded-sm shrink-0" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M444-288h72v-240h-72v240Zm35.79-312q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm.49 504Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    <p class="font-mono text-[10px] py-1 text-start text-white/80">  Your Discord password and other sensitive information is never shared with us and always private. </p>
                </div>

                <div class="bg-black/50 flex flex-row w-full mx-5 flex-nowrap justify-start items-start content-center rounded-sm gap-1.5">
                    <svg class="bg-modern-red-default/70 ring-2 ring-gray-800 fill-white/80 pr-[1px] pb-[1.5px] p-[1px] h-4.5 w-4.5 rounded-sm shrink-0" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M444-288h72v-240h-72v240Zm35.79-312q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm.49 504Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    <p class="font-mono text-[10px] py-1 text-start text-white/80">  No need to create an annoying password, you'll always just use Discord to log in. </p>
                </div>

                <div class="bg-black/50 flex flex-row w-full mx-5 flex-nowrap justify-start items-start content-center rounded-sm gap-1.5">
                    <svg class="bg-modern-red-default/70 ring-2 ring-gray-800 fill-white/80 pr-[1px] pb-[1.5px] p-[1px] h-4.5 w-4.5 rounded-sm shrink-0" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M444-288h72v-240h-72v240Zm35.79-312q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm.49 504Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    <p class="font-mono text-[10px] py-1 text-start text-white/80">  This integration can be removed at any time in your Discord account settings. </p>
                </div>

            </div>

            <footer class="text-white bg-black/50 w-full gap-2 mt-3 p-3 flex flex-wrap justify-center items-center content-center text-center">
                <!-- Discord Login -->
                <button @click="auth.authWithDiscord()" class=" bg-modern-purple-discord w-fit h-fit p-2 gap-1.5 cursor-pointer rounded-sm hover:bg-modern-purple-discord/75 hover:scale-105 active:scale-90 shadow-sm shadow-black/50 transition-all flex flex-nowrap items-center content-center justify-start">
                    <svg class="h-5 w-5 mx-0.5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
                        <g>
                            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">

                            </path>
                        </g>
                    </svg>
                    <p class="text-nowrap font-semibold text-sm"> Log In with Discord </p>
                </button>
            </footer>

            

        </div>

    </main>

    <!-- Dashboard Wrap: -->
    <main v-if="userLoggedIn" class=" flex flex-col w-full h-full flex-1 items-center justify-center text-shadow-black/50 shadow-black/50 drop-shadow-black/50">
       
        <div class="text-white bg-white/40 w-[85%] sm:w-140 rounded-lg overflow-clip shadow-md shadow-black/50 flex-col flex flex-wrap justify-center items-center content-center text-center">
            <!-- Card Header -->
            <header class="flex p-2.5 mb-3 gap-1.5 w-full bg-black/50 text-start text-xs flex-wrap justify-start items-center content-center">
                <p class="w-fit text-center bg-modern-green-default/70 contrast-125 px-2 py-0.5 rounded-md text-2xl font-bold text-shadow-sm text-shadow-black/20"> 🔓 Access Granted!</p>
                <p class="w-full text-white/80 font-light text-[15px] pl-1.5 text-shadow-sm text-shadow-black/50"> Click below to perform account actions. </p>
            </header>

            <!-- More Info - Discord Intg. Wrap -->
            <div class="w-full mb-1.5 flex flex-nowrap justify-center items-center content-center text-center flex-row">
                <div class="flex flex-[0.05] bg-black/50 h-[5px]"></div>
                <p class="text-white/80 py-0.75 px-2 rounded-md text-[10px] font-mono bg-black/50"> Integration Information: </p>
                <div class="flex flex-1 bg-black/50 h-[5px]"></div>
            </div>
            <div class="flex px-3 py-2 gap-2 text-black/80 w-full text-start text-xs flex-wrap justify-center items-center content-center">

                <div class="bg-black/50 flex flex-row w-full mx-5 flex-nowrap justify-start items-start content-center rounded-sm gap-1.5">
                    <svg class="bg-modern-green-default/70 ring-2 ring-gray-800 fill-white/80 pr-[1px] pb-[1.5px] p-[1px] h-4.5 w-4.5 rounded-sm shrink-0" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M444-288h72v-240h-72v240Zm35.79-312q15.21 0 25.71-10.29t10.5-25.5q0-15.21-10.29-25.71t-25.5-10.5q-15.21 0-25.71 10.29t-10.5 25.5q0 15.21 10.29 25.71t25.5 10.5Zm.49 504Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm-.28-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/></svg>
                    <p class="font-mono text-[10px] py-1 text-start text-white/80">  You have successfuly linked your Discord Account with the Sessions Bot Dashboard! </p>
                </div>

            </div>

            <footer class="text-white bg-black/50 w-full gap-2 mt-3 p-3 flex flex-wrap justify-center items-center content-center text-center">

                <!-- View My Account Data: -->
                <button @click="alertUserData" class=" bg-modern-green-default w-fit h-fit p-2 gap-1.5 cursor-pointer rounded-sm hover:bg-modern-green-default/75 hover:scale-105 active:scale-90 shadow-sm shadow-black/50 transition-all flex flex-nowrap items-center content-center justify-start">
                    <svg class="h-5 w-5 mx-0.5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid"><g><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"></path></g></svg>
                    <p class="text-nowrap font-semibold text-sm"> 
                        My Account
                    </p>
                </button>
            </footer>

            

        </div>

    </main>

</div> </template>


<style lang="css" scoped>

</style>