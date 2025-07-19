<script setup>
// Imports:
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../utils/stores/auth.js'
import { createLucideIcon, HomeIcon, Icon, LayoutDashboard, UserCircle2Icon } from 'lucide-vue-next';


// Auth:
const auth = useAuthStore()
const userLoggedIn = computed(() => auth.isAuthenticated)
const userData = computed(() => auth.userData)
const userData_manageableGuilds = computed(() => auth.userData?.Firebase?.claims?.manageableGuilds)
const userId = computed(() => auth.userData?.Firebase?.uid)

const manageableGuildOptions = ref([])

// Router:
const router = useRouter()
const route = useRoute()

const getManageableGuilds = async () => {

    if(!userData.value) { 
        console.log('No user data for managable guilds')
        return ['DATA ERROR']; 
    }

    const manageableGuildsData = userData.value?.Firebase?.claims?.manageableGuilds
    if(!manageableGuildsData) return [];

    console.log('Managable Guilds', manageableGuildsData)

    manageableGuildOptions.value = manageableGuildsData

    return manageableGuildsData
}


onMounted(() => {
    console.log('Auth Data', {
        LoggedIn: userLoggedIn.value,
        UserId: userId.value,
        ManageableGuilds: userData_manageableGuilds.value,
        UserData: userData.value
    });
    
})

</script>

<template>
<div id="userDashboardPage" class="flex flex-1 flex-col justify-start items-center gap-3">

    <!-- Sub-Header - Breadcrub / Guild Select -->
    <section class="flex flex-wrap flex-col sm:flex-row sm:justify-between justify-center items-center content-center gap-3 px-2 py-3 w-full">
        
        <!-- Page Breadcrumb: -->
        <Breadcrumb class="self-start rounded-md !px-4 !py-3" 
            :model="
            [
                {label: 'Home', href: '/', icon: HomeIcon},
                {label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard},
            ]"
            >
            <template #item="{ item }">
                
                <div class="cursor-pointer flex justify-center hover:underline" @click="(e) => router.push(String(item.href))"
                    :class="
                    String(item.href) === String(route.path) ? '!text-blue-400' : ''"
                    >
                    <!-- Icon -->
                    <component class="!inline mx-1" v-if="item?.icon" :is="item?.icon" :size="17" />
                    <!-- Crumb Label -->
                    <span class="text-sm"> {{ item.label }} </span>
                </div>
            </template>
        </Breadcrumb>

        <!-- Select Guild Dropdown: -->
        <Select 
            :options="userData_manageableGuilds"
        />
    
    </section>
        
</div>
</template>


<style lang="css" scoped>

    #userDashboardPage{
        --p-select-background: var(--color-zinc-900); /* Your custom color */
    }
    

</style>