<script setup>

  // Imports:
  import { ref } from 'vue';

  // Components:
  import siteHeader from './components/siteHeader.vue';
  import siteFooter from './components/siteFooter.vue';

  import alertPopup from './components/alertPopup.vue'
  import { useNavStore } from './utils/stores/nav';

  // Vairables:
  const siteVersion = ref("0.3.3ea")
  const nav = useNavStore()


</script>



<template>
  <siteHeader />

  <router-view v-slot="{ Component }" :class="nav.headerVisible ? 'pt-12 sm:pt-24': ''">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>

  <alertPopup  :visible='false' :actions="[{label: 'Example', fn:() => {console.log('Example ran!')}}]" description="This is the very important description ;p" title="This is an example popup notification!" > </alertPopup>

  <Transition name="fade" mode="out-in">
    <siteFooter :siteVersion="siteVersion"></siteFooter>
  </Transition>

</template>
