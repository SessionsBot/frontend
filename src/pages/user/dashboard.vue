<script setup>
// Vue:
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'

// Auth:
import { useAuthStore } from '../../utils/stores/auth.js'

// UI:

const auth = useAuthStore()
const userLoggedIn = computed(() => auth.isAuthenticated)

const alertUserData = async () => {
    const data = await auth.getUserData()
    let prettyUserData = JSON.stringify(data, '*', 2);
    alert('Your account information : \n' + prettyUserData);
}


</script>

<template>

</template>


<style lang="css" scoped>

</style>