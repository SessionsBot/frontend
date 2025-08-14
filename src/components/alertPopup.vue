<script setup>
  // Imports:
  import { useAuthStore } from '@/utils/stores/auth';
  import { usePopupSystem } from '@/utils/stores/popup';
  import { LockIcon } from 'lucide-vue-next';
  import { computed } from 'vue';
  

  // Variables:
  const popupSystem = usePopupSystem()
  const auth = useAuthStore()

  const popupVisible = computed(() => popupSystem.popupVisible)
  const showCloseButton = computed(() => popupSystem.showCloseButton)

  const title = computed(() => popupSystem.popupTitle)
  const description = computed(() => popupSystem.popupDescription)
  const actions = computed(() => popupSystem.buttonActions)

  const alertType = computed(() => popupSystem.alertType)
  const defaultAlert = computed(() => alertType.value === 'Default')
  const signInAlert = computed(() => alertType.value === 'SignIn')

</script>

<template>
  

    <!-- Default Popup -->
    <Transition name="overlay" @after-leave="$emit('closed')">
    <div v-show="defaultAlert && popupVisible" class="popup-overlay">
      
      <!-- Popup Card -->
      <Transition name="alertCard">
      <section v-show="defaultAlert && popupVisible"
        class="modal-card w-[80%] sm:max-w-150 bg-zinc-800 text-white font-semibold ring-2 ring-zinc-700 rounded-lg flex flex-wrap justify-center items-center content-center"
      >

        <!-- Header -->
        <header
          class="bg-black/30 rounded-t-md w-full p-2 pr-3 gap-1 flex justify-between items-center"
        >
          <h2 class="font-black text-xl p-1">
            {{ title || '⚠️ Attention:' }}
          </h2>
          <button
            v-if="showCloseButton"
            @click="popupSystem.closePopup"
            class="fill-white hover:fill-rose-800 hover:bg-white/70 transition-all hover:scale-110 rounded-md cursor-pointer"
          >
            <svg
              class="fill-inherit"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
              />
            </svg>
          </button>
        </header>

        <div class="divider-line"></div>

        <!-- Details: -->
        <p class="p-2">{{ description }}</p>

        <div v-if="actions?.length"  class="divider-line"></div>

        <!-- Actions: -->
        <footer v-if="actions?.length" 
         class="p-3 py-5 w-full flex gap-3 justify-center items-center"
        >

            <Button
              size="small"
              v-for="(action, index) in actions"
              :key="index"
              @click="action?.fn"
              class="!font-bold"
            >
             {{ action?.label }}
            </Button>

        </footer>
        
      </section>
      </Transition>
      
    </div>
    </Transition>


    <!-- Sign In Popup -->
    <Transition name="overlay" @after-leave="$emit('closed')">
    <div v-show="signInAlert && popupVisible" class="popup-overlay">
      
      <!-- Popup Card -->
      <Transition name="alertCard">
      <section v-show="signInAlert && popupVisible"
        class="modal-card w-[80%] sm:max-w-150 bg-zinc-800 text-white font-semibold ring-2 ring-zinc-700 rounded-lg flex flex-wrap justify-center items-center content-center"
      >

        <!-- Header -->
        <header
          class="bg-black/30 rounded-t-md w-full p-2 pr-3 gap-1 flex justify-between items-center"
        >
          <!-- Heading -->
          <h2 class="font-black text-xl p-1">
            {{ title || '⚠️ Sign In:'}}
          </h2>
          <!-- Top Close Button -->
          <button
            v-if="showCloseButton"
            @click="popupSystem.closePopup"
            class="fill-white hover:fill-rose-800 hover:bg-white/70 transition-all hover:scale-110 rounded-md cursor-pointer"
          >
            <svg
              class="fill-inherit"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
              />
            </svg>
          </button>
        </header>

        <div class="divider-line"></div>

        <!-- Details: -->
        <div
         class="flex flex-wrap gap-3 p-4 px-6"
        >
          <p class=""> 
            {{ description || 'To continue/access this page you must be signed into an account!' }}
          </p>

          <p class="text-sm"> Please sign in using your existing Discord account below. </p>
        </div>

        <div  class="divider-line"></div>

        <!-- Actions: -->
        <footer 
         class="p-3 py-5 pb-2.5 w-full flex flex-col gap-0 justify-center items-center"
        >

          <Button @click="auth.authWithDiscord($route.fullPath)" class=" !bg-modern-purple-discord hover:!bg-indigo-600 !text-white !border-0 font-semibold">
              <svg class="h-5 w-5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid"> <g><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"></path></g> </svg>
              Continue with Discord
          </Button>

          <div class="mt-2 flex gap-1 justify-center items-center content-center text-xs opacity-50">
              <LockIcon class="scale-60 rotate-14"/>
              Your information is always secure and private!
          </div>

        </footer>
        
      </section>
      </Transition>
      
    </div>
    </Transition>


</template>


<style scoped>
  /* Full viewport overlay - covers whole screen */
  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* make sure it's on top */
  }

  /* Divider line style stays the same */
  .divider-line {
    background: var(--color-zinc-700);
    width: 100%;
    height: 2px;
  }

  /* Popup Alert Card Transitions */
  .alertCard-enter-from,
  .alertCard-leave-to {
    transform: translateY(-2rem) scale(0.85);
    opacity: 0;
  }

  .alertCard-enter-to,
  .alertCard-leave-from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .alertCard-enter-active,
  .alertCard-leave-active {
    transition: all 0.33s ease;
  }

  /* Background Overlay Transitions */
  .overlay-enter-from,
  .overlay-leave-to {
    opacity: 0;
  }

  .overlay-enter-to,
  .overlay-leave-from {
    opacity: 1;
  }

  .overlay-enter-active,
  .overlay-leave-active {
    transition: all 0.4s ease;
  }
</style>
