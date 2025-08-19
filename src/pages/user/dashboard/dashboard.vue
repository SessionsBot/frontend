<script setup>
    // Imports:
    import { ref, computed, onMounted, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router'
    import { useAuthStore } from '../../../utils/stores/auth.ts'
    import { Calendar1Icon, CheckCircle2Icon, ClockIcon, ContactRoundIcon, Globe2Icon, HomeIcon, LayoutDashboard, PencilIcon, PlusCircleIcon, PlusSquareIcon, SettingsIcon, Trash2Icon, UserCircleIcon } from 'lucide-vue-next';
    import { getGuildData } from '@/utils/modules/backendApi.ts';
    import { useToast } from 'vue-toastification';
    import { objectEntries } from '@vueuse/core';
    import { DateTime } from 'luxon';
    import upcomingSessionsTable from './upcomingSessionsTable.vue'
    import guildConfigPanel from './guildConfigPanel.vue'
    import guildSchedules from './schedules/guildSchedules.vue'

    // Guild Config Panel:
    const viewGuildConfigurationPanel = ref(false)

    // Auth:
    const auth = useAuthStore()
    const userLoggedIn = computed(() => auth.isAuthenticated)
    const userData = computed(() => auth.userData)
    const userData_manageableGuilds = computed(() => auth.userData?.Firebase?.claims?.manageableGuilds)
    const userId = computed(() => auth.userData?.Firebase?.uid)

    // Router:
    const router = useRouter()
    const route = useRoute()

    const toast = useToast()


    /** Array for __ALL__ 'Guild Select' options that controls dashboard view. */
    const manageableGuildSelectOptions = ref([])

    /** __Current Guild__ Id Selected to manage/view within dashboard. */
    const guildSelectedId = ref(null)

    /** __Current Selected Guild's__ Data Object to manage/view within dashboard. 
     * @type  { import('vue').ComputedRef <import('@sessionsbot/api-types').GuildData>}
    */
    const guildSelectedData = computed(() => manageableGuildsData.value[guildSelectedId.value]);


    /** Static -- All Manageable Guilds Data */
    const manageableGuildsData = ref({})

    /** Used to fetch all manageable guild data for dashboard 
     * - Used on initial page load
     * - Also auto selects `guildSelectedId` by first fetched
    */
    const getManageableGuilds = async () => { // Fetched on page load

        // Reset previous options:
        manageableGuildSelectOptions.value = [];

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
                // Select as guild if non selected:
                if(!guildSelectedId.value) guildSelectedId.value = fetchedData?.data?.guildGeneral?.id;
            } else{
                // Bot not in guild:
                console.info('SessionsBot is not a member within manageable guild:', guildId);
            }
            
        }

    }

    /** Used to re-fetch a certain manageable guild's data for dashboard 
     * - Used after certain events that modify data
     * @param { string } guildId The guild id to refresh data for
    */
    const refreshGuildData = async (guildId) => {
        pageReady.value = false;
        try {
            const fetchResults = await getGuildData(guildId)
            if(!fetchResults.success || !fetchResults.data) throw fetchResults;
            // Update static data value:
            manageableGuildsData.value[guildId] = fetchResults?.data
        } catch (err) {
            console.warn('[Dashboard] Failed to refresh guild data!', err)
            
        }
        pageReady.value = true;
    }


    // Computed Guild Data:
    const todaysSessionCount = computed(() => {
        const upcomingSessionsObj = guildSelectedData.value?.guildDatabaseData?.upcomingSessions
        return upcomingSessionsObj ? objectEntries(upcomingSessionsObj).length : `ERROR`;
    });

    const availableRolesCount = computed(() => {
        let totalAvailable = 0;
        const upcomingSessions = guildSelectedData.value?.guildDatabaseData?.upcomingSessions
        if (!upcomingSessions) return 0;

        objectEntries(upcomingSessions).forEach((session) => {

            if (!session[1]?.roles) 
                return console.log('No roles?');
            else {
                Array.from(session[1]?.roles).forEach(role => {
                    const availInRole = role?.roleCapacity - role?.users.length
                    totalAvailable += availInRole
                })
            }
            
        })

        return totalAvailable

    });

    const rolesAssignedCount = computed(() => {
        let totalAssigned = 0;
        const upcomingSessions = guildSelectedData.value?.guildDatabaseData?.upcomingSessions
        if (!upcomingSessions) return 0;

        objectEntries(upcomingSessions).forEach((session) => {

            if (!session[1]?.roles) 
                return
            else {
                Array.from(session[1]?.roles).forEach(role => {
                    totalAssigned += role?.users?.length || 0;
                })
            }
            
        })

        return totalAssigned

    });

    const schedulesSetupCount = computed(() => {
        let totalSetup = 0;
        const sessionSchedules = guildSelectedData.value?.guildDatabaseData?.sessionSchedules
        if (!sessionSchedules) return 0;

        totalSetup = objectEntries(sessionSchedules).length

        return totalSetup

    });

    const dailyPostTime = computed(() => {
        let result = '00:00 AM';

        const time = guildSelectedData.value?.guildDatabaseData?.sessionSignup?.dailySignupPostTime;
        if (!time) return '?';

        const timezone = guildSelectedData.value?.guildDatabaseData?.timeZone || 'America/Chicago';
        
        const date = DateTime.fromObject({hour: time.hours, minute: time.minutes}, {zone: timezone})
        if (!date.isValid) return '?';

        result = date.toLocaleString(DateTime.TIME_SIMPLE)

        return result

    });

    const upcomingSessionsObj = computed(() =>  {
        return guildSelectedData.value?.guildDatabaseData?.upcomingSessions
    });


    /** Reload User Dashboard with `selectedGuildId` to refresh data/view. */
    async function reloadUserDashboard(selectedGuildId) {
        pageReady.value = false;
        if(selectedGuildId){
            await refreshGuildData(guildSelectedId.value)
        } else await getManageableGuilds()
        pageReady.value = true
    }


    // On page load:
    const pageReady = ref(false)
    onMounted(async () => {
        
        // Show loading:
        pageReady.value = false;
        // Fetch Manageable Guilds Data:
        await getManageableGuilds()
        // Show dashboard:
        pageReady.value = true;

        
    })


</script>

<template>
    <div id="userDashboardPage" class=" flex flex-1 max-w-full w-full flex-col justify-start items-center gap-3 p-3 flex-wrap">

        <!-- Sub-Header - Breadcrumb / Guild Select -->
        <section
            class="flex flex-wrap flex-row justify-between items-start content-start gap-3 pt-1 w-full">

            <!-- Page Breadcrumb: -->
            <Transition name="scale-fade" mode="out-in">
            <Breadcrumb  class="rounded-md !min-w-fit !px-2.75 !py-2.25" 
            :model="[
                { label: 'Home', href: '/', icon: HomeIcon },
                { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
            ]">
            <template #item="{ item }">

                <div 
                  class="cursor-pointer flex justify-center flex-row items-center content-center hover:underline"
                  @click="(e) => router.push(String(item.href))" 
                  :class=" String(item.href) === String(route.path) ? '!text-sky-400' : '',
                  String(item.href) == String(route?.matched[0]?.aliasOf?.path) ? 'text-sky-400' : ''">
                    <!-- Icon -->
                    <component class="!inline mx-1" v-if="item?.icon" :is="item?.icon" :size="17" />
                    <!-- Crumb Label -->
                    <span class="text-sm"> {{ item.label }} </span>
                </div>

            </template>
            </Breadcrumb>
            </Transition>

            <!-- Guild Select/Config Buttons: -->
            <Transition name="scale-fade" mode="out-in" duration="1">
            <div class="flex flex-row flex-wrap gap-2 justify-center items-center content-center">

                <!-- View/Edit Guild Config Button: -->
                <Button @click="()=>{viewGuildConfigurationPanel = true}" :disabled="!pageReady" v-tooltip.left="{value: 'Modify Guild Configuration', pt: { text: '!bg-black/50 text-xs', root: '!border-black' }}" unstyled 
                    class="bg-zinc-900 cursor-pointer h-9.5 w-9.5 ring-1 ring-white/20 hover:ring-white/35 rounded-md transition-all flex items-center justify-center content-center"
                >
                    <SettingsIcon class="m-auto text-white/80" :stroke-width="1.25"/>
                </Button>

                <!-- View Guild Selector -->
                <Select 
                    :loading="!pageReady"
                    :options="manageableGuildSelectOptions" 
                    option-label="guildName" 
                    option-value="guildId"
                    v-model="guildSelectedId"
                    @update:model-value="reloadUserDashboard"
                >
                    <template #option="slotProps">
                        <div class="flex gap-2 justify-center items-center ">
                            <img class="max-w-6 rounded-sm"
                                :src="slotProps.option?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'">
                            <p> {{ slotProps.option?.guildName }}</p>
                        </div>
                    </template>

                    <template #value="slotProps">
                        <div class="flex gap-2 justify-center items-center ">
                            <img class="max-w-6 rounded-sm"
                                :src="manageableGuildsData[slotProps.value]?.guildIcon || 'https://static.vecteezy.com/system/resources/previews/006/892/625/non_2x/discord-logo-icon-editorial-free-vector.jpg'">
                            <p> {{ manageableGuildsData[slotProps.value]?.guildGeneral?.name || 'Loading' }} </p>
                        </div>
                    </template>

                    <template #footer>
                        <div hidden class="mb-1 px-1 !w-full h-fit gap-1 flex flex-wrap flex-col justify-center items-center content-center">
                            <div class="w-[90%] h-px bg-zinc-700" />
                            <Button unstyled class="hover:bg-white/5 p-1.75 pl-2.75  rounded-md w-full flex flex-row gap-1.5 justify-start items-center content-center">
                                <PlusSquareIcon :stroke-width="1.25" class="text-zinc-400/90" />
                                <p class="text-zinc-400/90 font-stretch-80% italic"> Invite to another server </p>
                            </Button> 
                        </div>
                    </template>
                </Select>

            </div>
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
        <section v-else-if="pageReady" class="flex flex-wrap flex-col gap-7 p-5 flex-1 h-full w-full justify-center items-center content-start">
        
            <!-- Section 1 -->
            <section class="flex flex-wrap gap-7 p-7 flex-1 h-full w-full justify-center items-center content-start">
            <!-- Todays Outlook: -->
            <div class="flex flex-col overflow-clip justify-between w-75 lg:w-95 max-w-[100%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
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
                        <p class="outlookRowValue"> {{ todaysSessionCount | '?' }} </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Available Roles: </p>
                        <p class="outlookRowValue"> {{ availableRolesCount | '?' }} </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Roles Assigned: </p>
                        <p class="outlookRowValue"> {{ rolesAssignedCount | '?' }} </p>
                    </div>

                </div>

            </div>


            <!-- Member Outlook: HIDDEN -->
            <div hidden class="flex relative flex-col overflow-clip justify-between w-75 lg:w-115 max-w-[100%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
                <!-- Coming Soon Banner -->
                 <div class="absolute w-[200%] h-10 bg-red-900/50 ring-2 ring-white/70 flex top-[48%] rotate-13 gap-2 p-2 justify-center items-center content-center text-center">
                    <p class="text-lg font-black" style="font-family: Verdana"> Coming Soon </p>
                 </div>


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
            <div class="flex flex-col overflow-clip justify-between w-75 lg:w-95 max-w-[100%] bg-zinc-900 ring-2 ring-ring items-center rounded-md">
                
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
                        <p class="outlookRowValue"> {{ schedulesSetupCount | '?' }} </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <!-- Daily Post Time -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Daily Post Time: </p>
                        <p class="outlookRowValue"> {{ dailyPostTime }} </p>
                    </div>

                    <div class="w-[95%] h-[2px] bg-ring self-center" />

                    <!-- Subscription Plan -->
                    <div class="flex flex-row justify-between p-1.5 gap-3 items-center content-center">
                        <p> Current Plan: </p>
                        <p class="outlookRowValue"> FREE </p>
                    </div>

                </div>

            </div>
            </section>


            <!-- Upcoming Sessions - TABLE VIEW -->
            <upcomingSessionsTable :guildSelectedData="guildSelectedData" :upcomingSessionsObj="upcomingSessionsObj" :todaysSessionCount="todaysSessionCount" />

            <!-- Guild Schedules - TABLE VIEW -->
            <guildSchedules :guildSelectedData="guildSelectedData" @updateDashboard="(e)=>{reloadUserDashboard(guildId)}" />


        </section>

        </Transition>
        
        <!-- GUILD CONFIG DIALOG -->
        <guildConfigPanel @closePanel="(e)=>{viewGuildConfigurationPanel=false}" @updateDashboard="(e)=>{reloadUserDashboard()}" :viewGuildConfigurationPanel="viewGuildConfigurationPanel" :guildSelectedData="guildSelectedData" />

        
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
    text-align: center;
}

.upcomingSch_actionBtnEdit{
    background: var(--color-zinc-700);
    filter: grayscale(.5);
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
    filter: grayscale(.55);
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