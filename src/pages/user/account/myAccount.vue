<script setup>

import { useAuthStore } from '@/utils/stores/auth';
import { LogOutIcon, RefreshCcwIcon, Trash2Icon, UserCircleIcon, ViewIcon } from 'lucide-vue-next';
import defaultProfileIcon from '@/assets/profile-icon-default.jpg'
import router from '@/utils/router';
import { toaster } from '@/utils/defaultExports';
import { DateTime } from 'luxon';


const auth = useAuthStore()
const userData = computed(() => auth.userData)
const isAuthenticated = computed(() => auth.isAuthenticated)
const viewUserData = () => { console.info('User Data', userData); alert(JSON.stringify(userData.value, null, 2)); }

// Watch auth state:
watch(isAuthenticated, (curVal, oldVal) => {
   if (curVal == false) router.push('/user/sign-in');
})


const accRefreshStatus = ref(0)
async function refreshUserData(){

   // Check for cooldown - 5 mins:
   const cooldownInMinuets = 5;
   const allowedAt = DateTime.fromSeconds(Number(userData.value?.Pinia?.iat) + (cooldownInMinuets * 60))
   const allowedDif = allowedAt.diffNow(['minutes', 'seconds'])

   const timeLeftString = allowedDif.minutes < 1 ? Math.floor(allowedDif.seconds) + 's' : allowedDif.minutes + ' mins';
   const cooldownActive = allowedDif.seconds > 0;

   accRefreshStatus.value = 300; // set loading

   if(cooldownActive){
      toaster.warning(`Please wait! You cannot refresh your account data for ${timeLeftString}.`)
   }else{
      const result = await auth.refreshAuthToken(true)

      if(result.success){
         accRefreshStatus.value = 200; // set success
         toaster.success('Account data refreshed!')
      }else {
         accRefreshStatus.value = 400; // set errored
         toaster.success('Account refresh ERROR! Please wait and try again!')
      }
   }

   // reset button status:
   setTimeout(()=> accRefreshStatus.value = 0 ,3000)
   
}

</script>

<template>

   <main v-if="isAuthenticated" class="flex flex-1 !max-w-screen w-full flex-col justify-center items-center gap-3 p-3 text-wrap flex-wrap">

      <section class="flex gap-0 flex-col justify-center items-center max-w-115 bg-black/20 rounded-md ring-2 ring-ring">

         <!-- Subheader -->
         <div class="p-4 flex w-full bg-white/2 border-b-2 border-ring">
            <span class="flex flex-row gap-1 justify-start items-center">
               <UserCircleIcon />
               <p class="text-2xl font-semibold"> User Account </p>
            </span>
         </div>

         <!-- Account Details -->
         <div class="p-4 my-2 flex flex-col justify-center items-center gap-2">

            <!-- User Profile -->
            <div class="bg-zinc-800 acc-drop-shadow ring-1 ring-ring rounded-md my-2 px-6 py-2.5 flex flex-row gap-2 items-center justify-center">
               <!-- Profile Image -->
               <img :src="userData?.Pinia?.avatar || defaultProfileIcon"
                  class="size-7 rounded-full self-center ring-1 ring-white/50" alt="Profile Image" draggable="false">
               <!-- Display Name -->
               <p class="text-2xl font-bold text-wrap"> {{ userData?.Pinia?.displayName }} </p>
            </div>
            
            <!-- Integration Info -->
            <div class="flex flex-wrap justify-center items-center gap-2 p-2 mx-2 mt-1 text-white/70">
               <p class="text-sm text-center"> 
                  Last synced with Discord: 
               </p>
               <p class="bg-white/10 ring-1 ring-ring text-xs w-fit px-2 py-1 rounded-md"> 
                  {{ DateTime.fromSeconds(userData?.Pinia?.iat).toRelative({style: 'short'}) }} 
               </p>
            </div>

         </div>

         <!-- Account Actions -->
         <div class="p-4 w-full bg-white/2 border-t-2 border-ring">
            
            <div class="flex flex-row flex-wrap gap-2.5 justify-center items-center">

               <!-- Refresh Data -->
               <Button 
                  @click="refreshUserData()" :disabled="accRefreshStatus != 0" :loading="accRefreshStatus == 300"
                  class="hover:bg-zinc-700/90 px-2.5 py-1.5 gap-1 rounded-md flex flex-row  flex-nowrap justify-center items-center content-center cursor-pointer active:scale-95 transition-all" unstyled
                  :class="{
                     'bg-zinc-700/60': accRefreshStatus == 0,
                     'bg-emerald-700/60': accRefreshStatus <= 200,
                     '!bg-amber-600/60': accRefreshStatus >= 201,
                     '!bg-rose-800/60': accRefreshStatus >= 301,
                  }"
               >
                  <RefreshCcwIcon :class="{'spin': accRefreshStatus >= 201}"/>
                  <p class="font-semibold" > Refresh Data </p>
               </Button>

               <!-- Sign Out -->
               <Button @click="auth.signOut" class="bg-orange-700/50 hover:bg-orange-700/60 px-2.5 py-1.5 gap-1 rounded-md flex flex-row  flex-nowrap justify-center items-center content-center cursor-pointer active:scale-95 transition-all" unstyled>
                  <LogOutIcon/>
                  <p class="font-semibold" > Sign Out </p>
               </Button>

               <!-- View Data -->
               <Button v-if="userData?.Pinia?.id=='252949527143645185'" @click="viewUserData" class="bg-cyan-700/50 hover:bg-cyan-700/60 px-2.5 py-1.5 gap-1 rounded-md flex flex-row  flex-nowrap justify-center items-center content-center cursor-pointer active:scale-95 transition-all" unstyled>
                  <LogOutIcon/>
                  <p class="font-semibold" > View Data </p>
               </Button>


            </div>

         </div>

      </section>


   </main>

</template>


<style scoped>

.acc-drop-shadow{
   box-shadow: 4px 0px 7px var(--color-indigo-500),
   -4px 0px 7px var(--color-purple-500),
   0px 4px 7px var(--color-purple-500),
   0px -4px 7px var(--color-indigo-500)
}

#lastSyncedTime{
   box-shadow: 0px 0px 2.5px 1.75px var(--color-slate-700);
}

</style>