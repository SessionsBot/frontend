<script lang="ts" setup>

// Incoming Props:
defineProps(['title', 'emoji', 'desc'])

</script>

<template>
	<div class="bg-zinc-900 w-45 !h-fit rounded-md border-2 border-zinc-900 overflow-clip flex flex-col justify-center select-none cursor-pointer">
        <p class="w-full font-semibold p-1.5 border-b-2 border-ring/70"> {{ $props.title }} </p>
        <p class="text-6xl p-4 pb-3.5 bg-white/5 w-full text-center"> {{ $props.emoji }} </p>
    </div>
</template>
