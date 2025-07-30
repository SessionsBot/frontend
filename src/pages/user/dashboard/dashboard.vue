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

// Router:
const router = useRouter()
const route = useRoute()

// Select Guild - View Selected:
const manageableGuildSelectOptions = ref([])
const manageableGuildSelected = ref(null)

// Static - Manageable Guilds Data:
const manageableGuildsData = ref({})
const getManageableGuilds = async () => { // Fetched on page load

    // Get guild data from backend:
    for (const guildId of userData_manageableGuilds.value) {
        // Fetch guild data
        const fetchedData = await getGuildData(guildId);
        // On fetch error:
        if (!fetchedData.success || !fetchedData.data ) return console.warn(`Failed to fetch guild ${guildId}:`, fetchedData);
        // Add guild to 'static' manageable guilds data:
        manageableGuildsData.value[guildId] = fetchedData.data
        // Check if SessionsBot is a member of this guild:
        if(fetchedData?.data?.sessionsBotInGuild){
            // Add manageable guild select option:
            manageableGuildSelectOptions.value.push({
                guildName: fetchedData?.data?.guildGeneral?.name,
                guildId: fetchedData?.data?.guildGeneral?.id,
                guildIcon: fetchedData?.data?.guildIcon,
            });
            // Select as guild:
            if(!manageableGuildSelected.value) manageableGuildSelected.value = fetchedData?.data?.guildGeneral?.id
        } else{
            // Bot not in guild:
            console.warn('SessionsBot is not a member within', guildId);
        }
        
    }

}


// Top level - Load/refresh all user dashboard contents:
async function fetchUserDashboard() {

    // Fetch 'Select Guild' Options:
    await getManageableGuilds()

}


// On page load:
const pageReady = ref(false)
onMounted(async () => {
    console.info('pageReady', pageReady.value);
    await fetchUserDashboard()
    pageReady.value = true;
    console.info('pageReady', pageReady.value);
})

</script>

<template>
    <div id="userDashboardPage" class="flex flex-1 flex-col justify-start items-center gap-3">

        <!-- Sub-Header - Breadcrumb / Guild Select -->
        <section
            class="flex flex-wrap flex-col sm:flex-row sm:justify-between justify-center items-center content-center gap-3 px-2 py-3 w-full">

            <!-- Page Breadcrumb: -->
            <Breadcrumb class="self-start rounded-md !px-4 !py-3" :model="[
                    { label: 'Home', href: '/', icon: HomeIcon },
                    { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
                ]">
                <template #item="{ item }">

                    <div class="cursor-pointer flex justify-center hover:underline"
                        @click="(e) => router.push(String(item.href))" :class="String(item.href) === String(route.path) ? '!text-blue-400' : ''">
                        <!-- Icon -->
                        <component class="!inline mx-1" v-if="item?.icon" :is="item?.icon" :size="17" />
                        <!-- Crumb Label -->
                        <span class="text-sm"> {{ item.label }} </span>
                    </div>
                </template>
            </Breadcrumb>

            <!-- Select Guild Dropdown: -->
            <Select :options="manageableGuildSelectOptions" option-label="guildName" option-value="guildId"
                :model-value="manageableGuildSelected" :loading="!pageReady">

                <template #empty>
                    SELECT
                </template>


                <template #option="slotProps">
                    <div class="flex gap-2 justify-center items-center ">
                        <img class="max-w-6"
                            :src="slotProps.option?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'">
                        <p> {{ slotProps.option?.guildName }}</p>
                    </div>
                </template>

                <template #value="slotProps">
                    <div class="flex gap-2 justify-center items-center ">
                        <img class="max-w-6"
                            :src="manageableGuildsData[slotProps.value]?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'">
                        <p> {{ manageableGuildsData[slotProps.value]?.guildGeneral?.name || 'Select Guild' }} </p>
                    </div>
                </template>

            </Select>

        </section>

        <Transition name="scale-fade" mode="out-in">

        <!-- Loading - Page not Ready -->
        <section v-if="!pageReady" class="flex flex-col flex-1 h-full w-full justify-center items-center">
        
            
            <div class="flex gap-4 p-5 m-5 flex-col justify-center items-center bg-zinc-900 italic  rounded-lg ring-2 ring-ring">
                
                <ProgressSpinner stroke-width="4" />

                <p class="text-md text-center"> Please wait...</p>
                
                <p class="text-sm text-neutral-400 text-center"> Fetching your Dashboard!</p>

            </div>


        </section>


        <section v-else-if="pageReady" class="flex flex-col flex-1 h-full w-full justify-center items-center">
        
            
            <div class="flex gap-4 p-5 m-5 flex-col justify-center items-center bg-zinc-900 italic  rounded-lg ring-2 ring-ring">
                

                <p class="text-4xl text-center"> GUILD DASHBOARD</p>
                
                <p class="text-sm text-neutral-400 text-center"> This is your Dashboard! </p>

            </div>


        </section>


        </Transition>
        

        
    </div>
</template>


<style lang="css" scoped>
#userDashboardPage {
    /* <Select> - background color */
    --p-select-background: var(--color-zinc-900);
}
</style>