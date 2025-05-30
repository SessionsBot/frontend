<script setup>
 import siteHeader from './components/siteHeader.vue';
 import siteFooter from './components/siteFooter.vue';
</script>


<template>
  <siteHeader />
  <div class="h-12 sm:h-14 w-full"> <!-- Header Padding  --> </div>
  
  <router-view />

  <siteFooter siteVersion="0.2.1a" />

  
</template>

