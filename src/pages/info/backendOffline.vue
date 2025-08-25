<script setup>
import { ServerOffIcon } from 'lucide-vue-next';


</script>

<template>
<div class="text-white bg-stone-950 p-4 flex justify-center items-center content-center flex-col w-full h-full flex-1 ">

    <section class="flex flex-col gap-1.5">
        <div class="py-3 mb-3 flex flex-row items-center gap-3">
            <ServerOffIcon :stroke-width="2.5" :size="55" />
            <h1 class="text-6xl font-black"> Uh oh! </h1>
        </div>
        <p> It appears we're having server connection issues,</p> 
        <p> Please visit our <a class="underline" href="https://status.sessionsbot.fyi" target="_blank">status page</a> for more details.</p>
    </section>
    

</div>
</template>