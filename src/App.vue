<script setup>
// Imports:
import { ref } from 'vue';

// Components:
import siteHeader from './components/siteHeader.vue';
import siteFooter from './components/siteFooter.vue';

// Vairables:
const siteVersion = ref("0.2.8b")
</script>


<template>

  
  <siteHeader />
  <!-- ↓ Header Padding ↓ -->
  <div class="h-12 sm:h-14 w-full"></div>

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>

  
  <Transition name="fade" mode="out-in">
    <siteFooter :siteVersion="siteVersion"></siteFooter>
  </Transition>

</template>
