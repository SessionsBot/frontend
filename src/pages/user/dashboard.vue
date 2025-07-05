<script setup>
// Vue:
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'

// Auth:
import { useAuthStore } from '../../utils/stores/auth.js'

// UI:

const auth = useAuthStore()
const userLoggedIn = computed(() => auth.isAuthenticated)

const alertUserData = async () => {
    const data = await auth.getUserData()
    let prettyUserData = JSON.stringify(data, '*', 2);
    alert('Your account information : \n' + prettyUserData);
}

const value = ref([
    { label: 'Assigned', color1: '#34d399', color2: '#fbbf24', value: 25, icon: 'pi pi-table' },
    { label: 'Available', color1: '#fbbf24', color2: '#60a5fa', value: 15, icon: 'pi pi-inbox' },
    { label: 'All Roles', color1: '#60a5fa', color2: '#c084fc', value: 20, icon: 'pi pi-image' },
    { label: 'System', color1: '#c084fc', color2: '#c084fc', value: 10, icon: 'pi pi-cog' }
]);


</script>

<template>

    <div class="flex flex-1 flex-col justify-center items-center gap-3 p-6">

        <h1 class="font-extrabold text-[32px] mb-30 text-shadow-lg bg-zinc-900 px-2.5 rounded-md border-1 ring-zinc-700"> User Dashboard </h1>

        <MeterGroup :value="value" labelPosition="start">
            <template #label="{ value }">
                <div class="flex flex-wrap gap-4">
                    <template v-for="val of value" :key="i">
                        <Card class="flex-1 border border-surface shadow-none">
                            <template #content>
                                <div class="flex justify-between gap-8">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ val.label }}</span>
                                        <span class="font-bold text-lg">{{ val.value }}%</span>
                                    </div>
                                    <span class="w-8 h-8 rounded-full inline-flex justify-center items-center text-center" :style="{ backgroundColor: `${val.color1}`, color: '#ffffff' }">
                                        <i :class="val.icon" />
                                    </span>
                                </div>
                            </template>
                        </Card>
                    </template>
                </div>
            </template>
            <template #meter="slotProps">
                <span :class="slotProps.class" :style="{ background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`, width: slotProps.size }" />
            </template>
            <template #start="{ totalPercent }">
                <div class="flex justify-between mt-4 mb-2 relative">
                    <span>Storage</span>
                    <span :style="{ width: totalPercent + '%' }" class="absolute text-right">{{ totalPercent }}%</span>
                    <span class="font-medium">1TB</span>
                </div>
            </template>
            <template #end>
                <div class="flex justify-between mt-4">
                    <Button label="Manage Storage" outlined size="small" />
                    <Button label="Update Plan" size="small" />
                </div>
            </template>
        </MeterGroup>
    </div>



</template>


<style lang="css" scoped>

</style>