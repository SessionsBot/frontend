<script setup>

  // Imports:
  import { ref } from 'vue';

  // Components:
  import siteHeader from './components/siteHeader.vue';
  import siteFooter from './components/siteFooter.vue';

  import alertPopup from './components/alertPopup.vue'

  // Vairables:
  const siteVersion = ref("0.3.1c")

</script>



<template>
  
  <siteHeader />

  <router-view v-slot="{ Component }" class="pt-12 sm:pt-14">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>

  <alertPopup  :visible='false' :actions="[{label: 'Example', fn:() => {console.log('Example ran!')}}]" description="This is the very important description ;p" title="This is an example popup notification!" > </alertPopup>

  <Transition name="fade" mode="out-in">
    <siteFooter :siteVersion="siteVersion"></siteFooter>
  </Transition>

</template>
