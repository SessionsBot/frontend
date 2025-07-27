<script setup>
// Imports:
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../utils/stores/auth.js'
import { createLucideIcon, HomeIcon, Icon, LayoutDashboard, UserCircle2Icon } from 'lucide-vue-next';
import { getGuildData } from '@/utils/modules/backendApi.ts';



// Auth:
const auth = useAuthStore()
const userLoggedIn = computed(() => auth.isAuthenticated)
const userData = computed(() => auth.userData)
const userData_manageableGuilds = computed(() => auth.userData?.Firebase?.claims?.manageableGuilds)
const userId = computed(() => auth.userData?.Firebase?.uid)

const manageableGuildSelectOptions = ref([])
const manageableGuildSelected = ref(null)

// Router:
const router = useRouter()
const route = useRoute()


const getManageableGuilds = async () => {

    // Get guild data from backend:
    for (const guild of userData_manageableGuilds.value) {
        const fetchedData = await getGuildData(guild)
        console.log('Dashboard Fetched:', fetchedData)
        fetchedData.
        // Add managable guild select option:
        manageableGuildSelectOptions.value.push({
            guildName: fetchedData?.data?.guildGeneral?.name,
            guildId: fetchedData?.data?.guildGeneral?.id,
            guildIcon: fetchedData?.data?.guildIcon,
        })
    }
    
    
    
    
}


onMounted(async () => {
    console.log('Auth Data', {
        LoggedIn: userLoggedIn.value,
        UserId: userId.value,
        ManageableGuilds: userData_manageableGuilds.value,
        UserData: userData.value
    });
    
    await getManageableGuilds()
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
            :options="manageableGuildSelectOptions"
            option-label="guildName"
            option-value="guildId"
            v-model:model-value="manageableGuildSelected"
        >
 
            <template #option="slotProps">
                <div class="flex gap-2 justify-center items-center ">
                    <img class="max-w-6" :src="slotProps.option?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'" >
                    <p> {{ slotProps.option?.guildName }}</p>
                </div>
            </template>

            <template #value="slotProps">
                <div class="flex gap-2 justify-center items-center ">
                    <img class="max-w-6" :src="slotProps.value?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'" >
                    <p> {{ manageableGuildSelected }}</p>
                </div>
            </template>

        </Select>
    
    </section>
        
</div>
</template>


<style lang="css" scoped>

    #userDashboardPage{
        --p-select-background: var(--color-zinc-900); /* Your custom color */
    }
    

</style>