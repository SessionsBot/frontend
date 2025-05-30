<script setup>
// Props from Parent Page:
defineProps({
    visible: Boolean,
    title: String,
    description: String,
    actions: {
        type: Array,
        default: () => []
        // [Label: 'Button Name', fn: () => { button logic here } ]
    }
})

// Emits --> to Parent:
defineEmits(['close', 'closed'])
</script>

<template>
  <transition name="alertCard" @after-leave="$emit('closed')">
    <!-- Full viewport overlay wrapper -->
    <div v-if="visible" class="modal-overlay">
      <!-- Your modal card -->
      <section
        class="modal-card w-[80%] sm:max-w-150 bg-modern-purple-discord text-white font-semibold ring-1 rounded-lg flex flex-wrap justify-center items-center content-center"
      >
        <header
          class="bg-black/30 rounded-t-md w-full p-2 pr-3 gap-1 flex justify-between items-center"
        >
          <h2 class="font-black text-xl p-1">
            {{ title || '⚠️ Attention:' }}
          </h2>
          <button
            @click="$emit('close')"
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

        <p class="p-2">{{ description }}</p>

        <div class="divider-line"></div>

        <footer class="py-5 px-2 mb-1 flex gap-3">
          <template v-if="actions?.length">
            <button
              v-for="(action, index) in actions"
              :key="index"
              class="default_button"
              @click="action.fn"
            >
              {{ action.label }}
            </button>
          </template>
        </footer>
      </section>
    </div>
  </transition>
</template>

<style scoped>
/* Full viewport overlay - covers whole screen */
.modal-overlay {
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
  background: linear-gradient(
    to right,
    #d0d0d022,
    #919191db,
    #c8c8c8bf,
    #919191db,
    #d0d0d022
  );
  width: 100%;
  height: 2px;
}

@keyframes alertCardIn {
  0% {
    transform: translateY(-100vh);
    scale: 2;
    opacity: 0;
  }

  90% {
    scale: 1;
  }

  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes alertCardOut {
  0% {
    opacity: 1;
    scale: 1;
  }

  90% {
    opacity: 0;
  }

  100% {
    scale: 0;
  }
}

.alertCard-enter-from,
.alertCard-leave-to {
  opacity: 0;
  transform: translateY(-2rem) scale(0.9);
}

.alertCard-enter-to,
.alertCard-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.alertCard-enter-active,
.alertCard-leave-active {
  transition: all 0.4s ease;
}
</style>
