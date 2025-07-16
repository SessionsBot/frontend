<script setup>
// Vue:
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'

// Auth:
import { useAuthStore } from '../../../utils/stores/auth.js'
import { createLucideIcon, HomeIcon, Icon } from 'lucide-vue-next';

// UI:
const breadCrumbValues = ref([
    {label: 'Home', href: '/', icon: HomeIcon},
    {label: 'Dashboard', href: '/dashboard'},
])
const breadCrumbNavigate = () => {}

const auth = useAuthStore()
const userLoggedIn = computed(() => auth.isAuthenticated)

</script>

<template>

    <div class="flex flex-1 flex-col justify-start items-center gap-3 p-6">

        <Breadcrumb :home="home" :model="breadCrumbValues">
            <template #item="{ item }">
                <span> {{ item.label }} </span>
            </template>
        </Breadcrumb>

        <h1 class="font-extrabold text-[32px] mb-30 text-shadow-lg bg-zinc-900 px-2.5 rounded-md border-1 ring-zinc-700"> User Dashboard </h1>


        
    </div>



</template>


<style lang="css" scoped>

</style>