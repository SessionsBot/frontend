<script setup>
    import { useNavStore } from '@/utils/stores/nav';
import { InfoIcon, SendIcon } from 'lucide-vue-next';

    const appVersion = __APP_VERSION__;
    const nav = useNavStore()

</script>


<template>
    <footer 
        v-if="nav.footerVisible"
        class="bg-black/30 text-white/40 fill-white/45 text-xs flex flex-col justify-center items-center content-center flex-wrap gap-1 p-2 w-full h-fit">

        <!-- <div class="w-[95%] h-[1.5px] bg-white"></div> -->

        <!-- Site/Running Version: -->
        <div class="flex flex-wrap w-full pt-2 justify-between items-center content-center text-center gap-1 p-1">
            
            <p class="flex items-center gap-1 hover:underline underline-offset-2">
                <InfoIcon :size="12" />
                <p class="text-[11px] relative bottom-[0.45px]"> {{ 'Running Version: ' + appVersion }} </p>
            </p>

            <a class="flex items-center gap-1 hover:underline underline-offset-2" href="https://forms.gle/Ajei7RUhvEfEaJBK8" target="_blank">
                <SendIcon :size="12" />
                <p class="text-[11px] relative bottom-[0.45px]"> Send Feedback </p>
            </a>
            
        </div>

    </footer>
</template>