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
   const issuedAt = DateTime.fromSeconds(userData.value?.Pinia?.iat)
   const minutesAgo = DateTime.now().diff(issuedAt, 'minutes').minutes
   const cooldownActive = minutesAgo < 5

   accRefreshStatus.value = 300; // set loading

   if(cooldownActive){
      toaster.warning(`Please wait! You cannot refresh your account data for ${(Math.floor(5-minutesAgo))} minuet(s).`)
   }else{
      const result = await auth.refreshAuthToken()

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
   <main v-if="isAuthenticated"
      class="flex flex-1 !max-w-screen w-full flex-col justify-center items-center gap-3 p-3 text-wrap flex-wrap">

      <div class="p-4 bg-black/20 rounded-md ring-2 ring-ring text-white font-medium flex flex-col gap-4 max-w-250 justify-center items-center flex-wrap">
         <!-- Heading -->
         <div class="flex flex-row gap-1 items-center self-start content-center">
            <UserCircleIcon size="25" />
            <p class="text-3xl font-bold"> User Account </p>
         </div>

         <div class="bg-zinc-800 ring-1 ring-ring rounded-md px-4 py-2 flex flex-row gap-2">
            <!-- Profile Image -->
            <img :src="userData?.Pinia?.avatar || defaultProfileIcon"
               class="size-7 rounded-full self-center ring-1 ring-white/50" alt="Profile Image" draggable="false">
            <!-- Display Name -->
            <p class="text-2xl font-bold"> {{ userData?.Pinia?.displayName }} </p>
         </div>

         <!-- Integration Info -->
         <p class="text-white/70 max-w-[70%] text-center"> Your user account was created with Discord. </p>

         <Button @click="refreshUserData()" :disabled="accRefreshStatus != 0" :loading="accRefreshStatus == 300" class="px-2.5 py-1.5 gap-1 rounded-md flex flex-row disabled:opacity-60 disabled:cursor-not-allowed flex-nowrap justify-center items-center content-center cursor-pointer hover:brightness-115 transition-all" unstyled
            :class="{
               'bg-purple-900/60': accRefreshStatus == 0,
               'bg-emerald-700/60': accRefreshStatus <= 200,
               'bg-amber-600/60': accRefreshStatus >= 201,
               'bg-rose-800/60': accRefreshStatus >= 301,
            }">
            <RefreshCcwIcon :class="{'spin': accRefreshStatus >= 201}"/>
            <p> Refresh Data</p>
         </Button>

         <Button v-if="userData?.Pinia?.id == '252949527143645185'" @click="viewUserData" class="bg-sky-700/50 px-2.5 py-1.5 gap-1 rounded-md flex flex-row  flex-nowrap justify-center items-center content-center cursor-pointer hover:brightness-115 transition-all" unstyled>
            <ViewIcon/>
            <p> View Data</p>
         </Button>

         <Button @click="auth.signOut" class="bg-orange-700/50 px-2.5 py-1.5 gap-1 rounded-md flex flex-row  flex-nowrap justify-center items-center content-center cursor-pointer hover:brightness-115 transition-all" unstyled>
            <LogOutIcon/>
            <p> Sign Out</p>
         </Button>

      </div>




   </main>
</template>