<script setup>
  // Imports:
  import { ref } from 'vue';

  // Components:
  import siteHeader from './components/siteHeader.vue';
  import siteFooter from './components/siteFooter.vue';

  // Vairables:
  const siteVersion = ref("0.2.2ba")
</script>


<template>

  <siteHeader :siteVersion="siteVersion" />
  <!-- ↓ Header Padding ↓ -->
  <div class="h-12 sm:h-14 w-full"></div>

  <router-view />

  <siteFooter :siteVersion="siteVersion" />

</template>

