<script setup lang="ts">

  // Imports:
  import { ref } from 'vue';
  // Components:
  import siteHeader from './components/header/siteHeader.vue';
  import siteFooter from './components/siteFooter.vue';
  import cookieConsent from './components/cookieConsent/cookieConsent.vue'
  import UpgradeAlert from './components/UpgradeAlert.vue';

  import alertPopup from './components/alertPopup.vue'
  import { useNavStore } from './utils/stores/nav';
  
  // Variables:
  const nav = useNavStore()

  const showUpgradeComingAlert = ref(false)

  onMounted(() => {
    // Show upgrade coming alert:
    setTimeout(() => {
      showUpgradeComingAlert.value = true;
    }, 777)
  })

</script>



<template>  

  <siteHeader/>

  <router-view v-slot="{ Component }" :class="nav.headerVisible ? 'mt-16 sm:mt-20': ''">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>

  <!-- Alert System -->
  <alertPopup/>

  <!-- Upgrade Alert -->
  <UpgradeAlert v-model:visible="showUpgradeComingAlert" />

  <!-- Cookie Consent -->
  <cookieConsent/>

  

  <Transition name="fade" mode="out-in">
    <siteFooter></siteFooter>
  </Transition>

</template>