<script setup>

  // Imports:
  import { ref } from 'vue';

  // Components:
  import siteHeader from './components/siteHeader.vue';
  import siteFooter from './components/siteFooter.vue';

  import alertPopup from './components/alertPopup.vue'
  import { useNavStore } from './utils/stores/nav';
  import { usePopupSystem } from './utils/stores/popup';

  // Variables:
  const nav = useNavStore()
  const popupSystem = usePopupSystem()

</script>



<template>

  <div class="flex flex-1 justify-center items-center w-full h-full">
    BACKEND OFFLINE!
  </div>
  
  <siteHeader />

  <router-view v-slot="{ Component }" :class="nav.headerVisible ? 'mt-14 sm:mt-16': ''">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>

  <!-- Alert System -->
  <alertPopup/>

  <Transition name="fade" mode="out-in">
    <siteFooter></siteFooter>
  </Transition>

</template>