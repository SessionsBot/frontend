<script setup>
// Vue:
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'

// Auth:
import { useAuthStore } from '../../../utils/stores/auth.js'
import { createLucideIcon, HomeIcon, Icon, LayoutDashboard, UserCircle2Icon } from 'lucide-vue-next';

// UI:
const breadCrumbValues = ref([
    {label: 'Home', href: '/', icon: HomeIcon},
    {label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard},
])

const auth = useAuthStore()
const userLoggedIn = computed(() => auth.isAuthenticated)
const router = useRouter()
const route = useRoute()

</script>

<template>

    <div class="flex flex-1 flex-col justify-start items-center gap-3 p-6">

        <!-- Page Breadcrumb: -->
        <Breadcrumb class="self-start rounded-md !px-4 !py-3" 
            :model="
            [
                {label: 'Home', href: '/', icon: HomeIcon},
                {label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard},
            ]"
            >
            <template #item="{ item }">
                
                <div class="cursor-pointer hover:underline" @click="(e) => router.push(String(item.href), console.log(route.path))"
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

        
    </div>



</template>


<style lang="css" scoped>

</style>