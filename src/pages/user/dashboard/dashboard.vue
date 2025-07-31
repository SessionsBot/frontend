<script setup>
// Imports:
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../utils/stores/auth.js'
import { Calendar1Icon, ClockIcon, ContactRoundIcon, createLucideIcon, Globe2Icon, HomeIcon, Icon, LayoutDashboard, PencilIcon, Trash2Icon, UserCircle2Icon } from 'lucide-vue-next';
import { getGuildData } from '@/utils/modules/backendApi.ts';
import { TYPE, useToast } from 'vue-toastification';
// import { GuildDataResponse } from '@sessionsbot/api-types';
const toast = useToast()


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
/** Array for 'Guild Select' options that controls dashboard view. */
const manageableGuildSelectOptions = ref([])
/** Current Guild Id Selected to manage within dashboard. */
const manageableGuildIdSelected = ref(null)
/** Current Guild's Data Object Selected to manage within dashboard. */
const manageableGuildSelected = ref({})

// Computed Guild Data:

const todaysSessionCount = computed(() => manageableGuildsData.value[manageableGuildIdSelected.value].guildDatabaseData?.upcomingSessions?.length)

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
            if(!manageableGuildIdSelected.value) manageableGuildIdSelected.value = fetchedData?.data?.guildGeneral?.id
        } else{
            // Bot not in guild:
            console.warn('SessionsBot is not a member within', guildId);
        }
        
    }

}


// Top level - Load/refresh all user dashboard contents:
async function fetchUserDashboard() {

    // Fetch Manageable Guilds Data:
    await getManageableGuilds()
    
}


// On page load:
const pageReady = ref(false)
onMounted(async () => {

    await fetchUserDashboard()
    pageReady.value = true;

})

</script>

<template>
    <div id="userDashboardPage" class="flex flex-1 flex-col justify-start items-center gap-3">

        <!-- Sub-Header - Breadcrumb / Guild Select -->
        <section
            class="flex flex-wrap flex-row justify-between items-start content-start gap-3 px-2 py-3 w-full">

            <!-- Page Breadcrumb: -->
            <Transition name="scale-fade" mode="out-in">
            <Breadcrumb v-if="pageReady" class="self-start rounded-md !px-4 !py-3" :model="[
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
            </Transition>

            <!-- Select Guild Dropdown: -->
            <Transition name="scale-fade" mode="out-in">
            <Select v-if="pageReady" :options="manageableGuildSelectOptions" option-label="guildName" option-value="guildId"
                :model-value="manageableGuildIdSelected" :loading="!pageReady">

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
            </Transition>

        </section>

        <Transition name="scale-fade" mode="out-in">

        <!-- Loading - Page not Ready -->
        <section v-if="!pageReady" class="flex flex-col flex-1 h-full w-full justify-center items-center">
        
            
            <div class="flex gap-4 p-12 m-5 flex-col justify-center items-center bg-zinc-900 italic  rounded-lg ring-2 ring-ring">
                
                <ProgressSpinner stroke-width="3" />

                <p class="text-md text-center"> Please wait...</p>
                
                <p class="text-sm text-neutral-400 text-center"> Fetching your Dashboard!</p>

            </div>


        </section>


        <!-- Dashboard View -->
        <section v-else-if="pageReady" class="flex flex-wrap gap-7 p-7 flex-1 h-full w-full justify-center items-center content-center">
        
            
            <!-- Todays Outlook: -->
            <div class="flex flex-col overflow-clip justify-between min-w-75 max-w-[80%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
                <!-- Heading -->
                <div class="flex bg-white/5 flex-row text-center justify-start items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
                    <Calendar1Icon />
                    <p class="font-medium"> Todays Outlook</p>
                </div>

                <!-- Results -->
                <div class="flex flex-col text-white/65 gap-2 p-3 ring-ring w-full flex-1">
                    
                    <!-- Todays Sessions Count -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Todays Sessions: </p>
                        <p class="outlookRowValue"> {{ todaysSessionCount || '?' }} </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Available Roles: </p>
                        <p class="outlookRowValue"> % </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Roles Assigned: </p>
                        <p class="outlookRowValue"> % </p>
                    </div>

                </div>

            </div>


            <!-- Member Outlook: -->
            <div class="flex flex-col overflow-clip justify-between min-w-75 max-w-[80%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
                <!-- Heading -->
                <div class="flex flex-row bg-white/5 text-center justify-start items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
                    <ContactRoundIcon />
                    <p class="font-medium"> Member Outlook</p>
                </div>

                <!-- Results -->
                <div class="flex flex-col text-white/65 gap-2 p-3 ring-ring w-full flex-1">
                    
                    <!-- Most Active -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Most Active: </p>
                        <p class="outlookRowValue"> @USER </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <!-- Roles Assigned -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Roles Assigned: </p>
                        <p class="outlookRowValue"> % </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <!-- Sessions Hosted -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Sessions Hosted: </p>
                        <p class="outlookRowValue"> % </p>
                    </div>

                </div>

            </div>


            <!-- Guild Outlook: -->
            <div class="flex flex-col overflow-clip justify-between min-w-75 max-w-[80%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
                <!-- Heading -->
                <div class="flex bg-white/5 flex-row text-center justify-start items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
                    <Globe2Icon />
                    <p class="font-medium"> Guild Outlook</p>
                </div>

                <!-- Results -->
                <div class="flex flex-col text-white/65 gap-2 p-3 ring-ring w-full flex-1">
                    
                    <!-- Schedules Setup -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Schedules Setup: </p>
                        <p class="outlookRowValue"> % </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <!-- Daily Post Time -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Daily Post Time: </p>
                        <p class="outlookRowValue"> 00:00 AM </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <!-- Subscription Plan -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Current Plan: </p>
                        <p class="outlookRowValue"> FREE </p>
                    </div>

                </div>

            </div>


            <!-- Upcoming Sessions: -->
            <div class="flex flex-col overflow-clip justify-between min-w-125 max-w-[80%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
                <!-- Heading -->
                <div class="flex bg-white/5 flex-row text-center justify-between items-center flex-wrap gap-2 p-3 w-full h-fit border-b-2 rounded-tr-md">
                    <div class="flex flex-row gap-2 justify-between items-center content-center">
                        <ClockIcon />
                        <p class="font-medium"> Upcoming Sessions </p>
                    </div>

                    <div class="flex flex-row gap-2 justify-between items-center content-center">
                        <p class="font-medium text-sm bg-emerald-700/70 p-1 px-1.5 rounded-md"> % Sessions </p>
                    </div>
                    
                </div>

                <!-- Results -->
                <div class="flex flex-col text-white/65 gap-2 p-3 ring-ring w-full flex-1">
                    
                    <!-- Schedule: -->
                    <div class="flex flex-row justify-between p-1.5 gap-4.5 items-center content-center">
                        
                        <!-- Sch Title -->
                         <p>
                            SESSION TITLE
                         </p>

                        <!-- Sch Roles Available -->
                         <p>
                            ROLES AVAILABLE
                         </p>

                        <!-- Sch Roles Assigned -->
                         <p>
                            ROLES ASSIGNED
                         </p>

                        <!-- Sch Actions -->
                         <div class="flex flex-wrap flex-col justify-center items-center content-center text-center p-3 gap-3">

                            <Button unstyled class="upcomingSch_actionBtnEdit">
                                <PencilIcon size="13" />
                                <p> Edit </p>
                            </Button>

                            <Button unstyled class="upcomingSch_actionBtnDelete">
                                <Trash2Icon size="13" />
                                <p> Delete </p>
                            </Button>

                         </div>

                    </div>


                    <div class="w-[100%] h-[2px] bg-ring self-center" />

                </div>

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


.outlookRowValue {
    background: var(--color-zinc-800);
    padding: 2px 6px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
}

.upcomingSch_actionBtnEdit{
    background: var(--color-cyan-700);
    filter: grayscale(.3);
    font-weight: 600;
    padding: 4px 8px;
    font-size: small;
    border-radius: 6px;
    display: flex;
    gap: 3px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.upcomingSch_actionBtnDelete{
    background: var(--color-rose-800);
    filter: grayscale(.4);
    font-weight: 600;
    padding: 4px 8px;
    font-size: small;
    border-radius: 6px;
    display: flex;
    gap: 3px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    align-content: center;
}
</style>