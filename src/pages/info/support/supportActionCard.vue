<script lang="ts" setup>

// Incoming Props:
defineProps(['title', 'emoji', 'desc', 'action'])

const docsUrl = 'https://docs.sessionsbot.fyi';
// const FAQsUrl = ''
const reportIssueUrl = 'https://github.com/SessionsBot/backend/issues';
const requestFeatureUrl = 'https://github.com/orgs/SessionsBot/discussions/categories/ideas';

</script>

<template>
	<Button unstyled @click="action" class="bg-zinc-900 relative text-center hover:brightness-115 min-w-fit max-w-45 !h-fit rounded-md border-2 border-zinc-900 overflow-clip flex flex-col flex-wrap justify-center select-none cursor-pointer shadow-sm shadow-black/20">
        <p class="w-full text-center font-semibold bg-white/5 p-1.5 border-b-2 border-ring/60"> {{ $props.title }} </p>
        <p class="text-6xl p-4 pb-3.5 w-full text-center"> {{ $props.emoji }} </p>
    </Button>
</template>
