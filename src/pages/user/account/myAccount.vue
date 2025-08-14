<script setup>

    import { useAuthStore } from '@/utils/stores/auth';
    import { LogOutIcon, Trash2Icon, UserCircleIcon, ViewIcon } from 'lucide-vue-next';
    import defaultProfileIcon from '@/assets/profile-icon-default.jpg'
    import router from '@/utils/router';
    

    const auth = useAuthStore()
    const userData = computed(() => auth.userData)
    const isAuthenticated = computed(() => auth.isAuthenticated)
    const viewUserData = () => {console.info('User Data', userData); alert(JSON.stringify(userData.value, null, 2));}
   
    // Watch auth state:
    watch(isAuthenticated, (curVal, oldVal) => {
        console.log('auth change within dashboard', {curVal, oldVal})
        if(curVal == false) router.push('/user/sign-in');
    })

</script>

<template>
<main v-if="isAuthenticated" class="flex flex-1 !max-w-screen w-full flex-col justify-center items-center gap-3 p-3 text-wrap flex-wrap">

    <div class="p-4 bg-zinc-900 rounded-md ring-2 ring-ring text-white font-medium flex flex-col gap-4 max-w-250 justify-center items-center">
        <!-- Heading -->
         <div class="flex flex-row gap-1 items-center self-start content-center">
            <UserCircleIcon size="25" />
            <p class="text-3xl font-bold"> User Account </p>
         </div>
        
         <div class="bg-zinc-600 rounded-md px-4 py-2 flex flex-row gap-2">
            <!-- Profile Image -->
            <img :src="userData?.Pinia?.avatar || defaultProfileIcon" class="w-8 h-8 rounded-full self-center ring-1 ring-white/50" alt="Profile Image" draggable="false">
            <!-- Display Name -->
            <p class="text-3xl font-bold"> {{ userData?.Pinia?.displayName }} </p>
         </div>

        <!-- Integration Info -->
         <p class="text-white/70 max-w-[70%]"> User account information is fetched and synced from Discord. </p>

        <!-- Sign out -->
         <Button @click="auth.signOut" unstyled class="flex flex-row w-fit gap-1.5 p-2 rounded-md transition-all hover:brightness-115 bg-amber-600 cursor-pointer">
            <LogOutIcon />
            <p> Sign Out</p>
         </Button>
        <!-- Delete Account -->
         <Button hidden unstyled class="flex flex-row w-fit gap-1.5 p-2 rounded-md transition-all hover:brightness-115 bg-rose-600 cursor-pointer">
            <Trash2Icon />
            <p> Delete Account </p>
         </Button>
        <!-- View Data -->
         <Button v-if="userData?.Pinia?.id == '252949527143645185'" @click="viewUserData" unstyled class="flex flex-row w-fit gap-1.5 p-2 rounded-md transition-all hover:brightness-115 bg-sky-600 cursor-pointer">
            <ViewIcon />
            <p> View Data </p>
         </Button>

    </div>

    
    

</main>
</template>