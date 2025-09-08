<script setup lang="ts">
    import { defaultWindow, useWindowScroll } from '@vueuse/core';
    import { ArrowBigUpIcon, ArrowUpToLineIcon } from 'lucide-vue-next';

    const { y } = useWindowScroll() // current scroll y pos
    const showScrollToTopButton = computed(() => y.value > 200)

    function scrollToTop(){
        defaultWindow.scrollTo({top: 0, behavior: 'smooth'})
    }

</script>

<template>
    <Transition name="fade">
    <Button v-if="showScrollToTopButton" @click="scrollToTop" unstyled class=" bg-indigo-500 grayscale-25 p-2 mx-2 my-1 rounded-md cursor-pointer shadow-md shadow-black/25">
        <ArrowBigUpIcon />
    </Button>
    </Transition>
</template>