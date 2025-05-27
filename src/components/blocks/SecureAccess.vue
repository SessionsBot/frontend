<script setup>
import { computed, ref } from 'vue';

const correctPassword = ref('THISISCORRECTOK')
const accessGranted = computed(() => passwordInput.value == correctPassword.value)
const passwordInput = defineModel('password')

const attemptPassword = () => {
    alert(passwordInput.value)
    console.log('Attempt:')
    console.log(passwordInput.value)
    console.log('Access:')
    console.log(accessGranted.value)
}

</script>

<template>

    <!-- Site Locked: -->
    <div v-if="!accessGranted" class=" text-white flex flex-col justify-center items-center">

        <div class="m-10 p-5 rounded-lg ring-white ring-2 shadow-2xl shadow-black">
            <h1
                class="text-xl font-bold bg-gray-700 w-fit pt-1 pr-2 pb-1 pl-1 rounded-bl-lg rounded-tr-lg rounded-tl-lg mb-2.5">
                👋 Hi There!
            </h1>
            <div class="flex flex-wrap">
                <p class="testButton"> This site is currently </p>
                <p class=" inline-block bg-red-900/70 mx-1 px-1 rounded-md font-bold"> Password Protected! </p>
            </div>


            <div class="flex flex-col justify-center gap-4 items-center w-full mt-4">
                <input type="text" v-model="passwordInput" placeholder="🔑 Password "
                    class="bg-neutral-200/80 text-gray-800 rounded-md px-2.5 py-1 h-fit ">
                <!---->

                <button @click="attemptPassword()"
                    class="bg-orange-600/50 font-bold text-shadow-sm text-shadow-black/50 text-[12px] px-2.5 py-1 rounded-md
                        shadow-md shadow-black/50 cursor-pointer hover:bg-orange-400/60 hover:px-3 hover:scale-115 active:scale-90 transition-all">
                    Submit
                </button>

                <button
                    class="bg-blue-500/50 font-bold text-shadow-sm text-shadow-black/50 text-[12px] px-2.5 py-1 rounded-md
                        shadow-md shadow-black/50 cursor-pointer hover:bg-blue-400/60 hover:px-3 hover:scale-115 active:scale-90 transition-all">
                    Get Help
                </button>
            </div>

        </div>

    </div>

    <!-- Site Unlocked: -->
    <div v-if="accessGranted" class=" text-white flex flex-col justify-center items-center">

        <div class="m-10 p-5 rounded-lg ring-white ring-2 shadow-2xl shadow-black">
            <h1
                class="text-xl font-bold bg-gray-700 w-fit pt-1 pr-2 pb-1 pl-1 rounded-bl-lg rounded-tr-lg rounded-tl-lg mb-2.5">
                👋 Hi There!
            </h1>
            <div class="flex flex-wrap">
                <p> Welcome to the inside of my pussy </p>
                <p class=" inline-block bg-red-900/70 mx-1 px-1 rounded-md font-bold"> Password Protected! </p>
            </div>


        </div>

    </div>

</template>


<style scoped>



</style>