<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import AlertModal from '../blocks/alertModal.vue'

    // Router:
    const router = useRouter()
    const goHome = () => router.push('/')

    // Alert Popup Modal:
    const showAlert = ref(false)

    const closeModal = () => {
        showAlert.value = false
    }

    const handlePrimaryAction = () => {
        console.log('Understood!')
        closeModal()
    }

    const modelHidden = () => {
        console.log('[i] Moddel has been flagged as closed!')
    }

</script>

<template>
    <div class="flex flex-col w-full h-full flex-1 items-center justify-start">
        <!-- Header -->
        <header
            class="p-3 relative bg-modern-purple-discord w-full flex justify-center items-center content-center gap-1">
            <button @click="goHome"
                class="absolute left-2 p-0.5 rounded-md cursor-pointer hover:bg-black/50 active:scale-95 hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 0 24 24" width="25px" fill="#FFFFFF">
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                        d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
                </svg>
            </button>
            <h1 class="font-bold text-2xl text-white text-shadow-md">🚧 | Internal Testing</h1>
        </header>

        <!-- Main Content -->
        <main class="flex flex-col w-full h-full flex-1 items-center justify-center overflow-clip">

            <button @click="showAlert = true" class="bg-gray-300/50 p-2 ring-4 text-white">
                Click to Show
            </button>

            <AlertModal 
                :visible="showAlert" 
                title="🚨 Attention"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit..."
                :actions="[{ label: 'I Understand', fn: handlePrimaryAction }]"
                 @close="closeModal" 
                 @closed="modelHidden"
            />

        </main>
    </div>
</template>
