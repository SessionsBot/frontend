<script setup lang="ts">
    //@ts-expect-error
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod'
    import { Form, FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { CheckIcon, CornerDownRightIcon, LoaderCircle, MailIcon, SparklesIcon, XIcon } from 'lucide-vue-next';
    import DiscordIcon from '@/assets/svgs/discord-icon.vue';
    import { EXTERNAL_URLS } from '@/utils/stores/nav';

    // MODAL - Popup Visible
    const visible = defineModel<boolean>('visible')


    // Newsletter Form
    function useNewsletterForm() {
        const newsletterFormRef = ref<FormInstance>()
        const resolver = zodResolver(z.object({
            email: z.string().email('Please enter a valid email address')
        }))
        const values = {
            email: ref('')
        }

        const submitState = ref<'idle' | 'busy' | 'success' | 'failed'>('idle')

        async function submitNewsletterForm(e: FormSubmitEvent) {
            try {
                const { values } = e;
                // console.info('Form Submitted', e.valid, values)
                submitState.value = 'busy'

                if (!e.valid) throw { reason: 'invalid', e }

                const url = new URL("https://script.google.com/macros/s/AKfycbxUgX3BJYZ1xDfjd_aTv2YBXtPL0trqGTen5b5qZe4ykSwP_WDcFya_HauUyXkKowzA/exec");
                url.searchParams.set("email", values.email);

                const res = await fetch(url.toString())

                if (res.ok) {
                    submitState.value = 'success'
                } else throw { reason: 'request failed', res }

            } catch (err) {
                submitState.value = 'failed';
                console.warn('Failed to submit Newsletter Form!', err)
            } finally {
                if (submitState.value == 'success') return  // leave disabled!
                setTimeout(() => submitState.value = 'idle', 3_000)
            }

        }

        return {
            newsletterFormRef,
            resolver,
            values,
            submitState,
            submitNewsletterForm
        }
    }
    const { resolver, values: formValues, submitState, submitNewsletterForm } = useNewsletterForm()


    // Features Carousel:
    function useFeatureCarousel() {

        function advance() {
            let cursor = featIndex.value + 1;
            if (cursor > maxIndex) cursor = 0;
            featIndex.value = cursor
        }

        function previous() {
            let cursor = featIndex.value - 1;
            if (cursor <= 0) cursor = maxIndex;
            featIndex.value = cursor
        }

        const autoScrollInterval = ref<NodeJS.Timeout>()
        const autoScrollSeconds = 7;
        function autoScroll(enabled: boolean) {
            if (enabled) {
                autoScrollInterval.value = setInterval(() => {
                    advance()
                }, autoScrollSeconds * 1000);
            } else {
                clearInterval(autoScrollInterval.value)
            }
        }

        let holdTimeout: number | null = null
        const holdForSecs = 0.5
        function touched(down: boolean){
            if(down){
                // Mouse Down
                autoScroll(false)
                holdTimeout = window.setTimeout(() => {
                    advance()
                    holdTimeout = null
                }, holdForSecs * 1000)
            } else {
                // Mouse Up:
                autoScroll(true)
                if (holdTimeout !== null) {
                    clearTimeout(holdTimeout)
                    holdTimeout = null
                }
            }
        }

        const featIndex = ref(0)
        const maxIndex = 3;

        const features = [
            {
                index: 0,
                item: 'Way MORE Session/Event Customization',
                subItems: [
                    'Add optional descriptions to your sessions.',
                    'Individualize Time Zones & Post Channels per session!',
                    'Post Sessions to Discord either the day of or before the event start at a specified time.',
                ]
            },
            {
                index: 1,
                item: 'Way MORE Scheduling/Recurrence Customization',
                subItems: [
                    'Configure daily, weekly, monthly, and yearly repeating sessions.',
                    'Repeat sessions at custom intervals.',
                    'Apply a maximum repeat count or end repeat date.',
                ]
            },
            {
                index: 2,
                item: `Expanded Session RSVPing/Signup capabilities`,
                subItems: [
                    'Use pre-defined RSVP slots or customize your own!',
                    'Require specific roles to RSVP to sessions.',
                    'Track RSVP activity through the all new Dashboard!'
                ]
            },
            {
                index: 3,
                item: 'Session and Audit Logs',
                subItems: [
                    'View a detailed audit log of any Sessions Bot related actions taken by your server members.',
                    'In depth session history, viewable through the all new dashboard!',
                ]
            }
        ]

        return {
            features,
            featIndex,
            touched,
            advance,
            previous,
            autoScroll
        }
    }
    const activeFeature = computed(() =>
        featCarousel.features.find(f => f.index === featCarousel.featIndex.value)
    )
    const featCarousel = useFeatureCarousel()
    



    // Saved Choice - Don't Show Again:
    const key = "UPDATE-ALERT-SILENCE";
    const updateAlertSilenceChoice = computed({
        set: (v: 'true' | 'false') => localStorage.setItem(key, v),
        get: () => localStorage.getItem(key)
    })

    // On Mounted:
    onMounted(() => {
        // Feature Carousel:
        featCarousel.autoScroll(true);
    })

    // On UNmounted:
    onUnmounted(() => {
        // Feature Carousel:
        featCarousel.autoScroll(false);
    })

</script>

<template>
    <Dialog :visible="visible" modal block-scroll :draggable=false
        class="m-14 w-[80%] max-w-130 overflow-y-auto! overflow-x-clip!">
        <template #container>
            <main class="flex p-4 flex-col justify-center items-center gap-2 w-full h-full flex-wrap transition-all">

                <!-- Close Button -->
                <Button title="Close Alert" @click="visible = false, visible = false" unstyled
                    class="absolute! right-3 top-3 rounded cursor-pointer active:scale-95 hover:bg-ring/80 transition-all">
                    <XIcon class="opacity-75" :size="24" />
                </Button>

                <!-- Header Section -->
                <div class="w-full flex flex-col items-center justify-center gap-2">
                    <div class="p-4 rounded-full aspect-square w-fit bg-white/10 ">
                        <!-- <Tools :size="48" class="animate-pulse sparkles-icon" /> -->

                        <svg class="sparkles-icon relative top-px left-px" xmlns="http://www.w3.org/2000/svg" width="54" height="48" viewBox="0 0 576 512"><path fill="currentColor" d="m571.31 193.94l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31l-28.9-28.9c5.63-21.31.36-44.9-16.35-61.61l-45.25-45.25c-62.48-62.48-163.79-62.48-226.28 0l90.51 45.25v18.75c0 16.97 6.74 33.25 18.75 45.25l49.14 49.14c16.71 16.71 40.3 21.98 61.61 16.35l28.9 28.9l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l90.51-90.51c6.23-6.24 6.23-16.37-.02-22.62m-286.72-15.2c-3.7-3.7-6.84-7.79-9.85-11.95L19.64 404.96c-25.57 23.88-26.26 64.19-1.53 88.93s65.05 24.05 88.93-1.53l238.13-255.07c-3.96-2.91-7.9-5.87-11.44-9.41z"/></svg>
                    </div>

                    <p class="font-bold text-3xl px-5 text-center relative top-1"> 
                        Sessions Bot is Getting a Major Upgrade! 🎉 
                    </p>
                    <p class="opacity-45 px-5 text-center"> 
                        We're working hard on some exciting improvements to make
                        Sessions Bot better than ever. 
                    </p>
                </div>

                <!-- Excitement List -->
                <div class="w-full flex flex-col gap-2 pt-1">
                    <!-- Subheading -->
                    <p class="font-bold text-sm uppercase opacity-50 px-2.5"> What's Coming:</p>
                    <!-- Transition - Carousel Wrap -->
                    <Transition name="slide" mode="out-in">
                        <div v-if="activeFeature" :key="activeFeature.index" @pointerdown="featCarousel.touched(true)" @pointerup="featCarousel.touched(false)" class="upcoming-feature-group">
                            <!-- Main Feature -->
                            <div class="flex items-center gap-0.75 px-3">
                                <CheckIcon :size="18" class="min-w-fit! aspect-square! relative top-px text-emerald-500" />
                                <p class="font-semibold">
                                    {{ activeFeature.item }}
                                </p>
                            </div>
                            <!-- SubItems -->
                            <div v-for="sub in activeFeature.subItems" :key="sub" class="flex gap-1 px-7">
                                <CornerDownRightIcon :size="16" class="opacity-65 min-w-fit! aspect-square!" />
                                <p class="text-sm font-semibold opacity-80">{{ sub }}</p>
                            </div>
                        </div>
                    </Transition>

                </div>

                <!-- Newsletter Signup -->
                <p class="font-bold text-sm uppercase opacity-50 px-2.5 w-full text-center"> Be the First to Know</p>
                <p class="font-medium opacity-80 italic w-full text-sm">
                    Signup for our newsletter to stay updated:
                </p>

                <!-- Email Form -->
                <Form v-slot="$form" :resolver="resolver" @submit="submitNewsletterForm" class="w-full">
                    <InputGroup>
                        <InputGroupAddon>
                            <MailIcon />
                        </InputGroupAddon>
                        <!-- Email Input -->
                        <InputText name="email" type="email" inputmode="email" autocomplete="email"
                            autocapitalize="none" autocorrect="off" spellcheck="false" v-model="formValues.email.value"
                            :disabled="submitState !== 'idle'" placeholder="Email" class="font-medium border-zinc-600!" />

                        <InputGroupAddon class="p-0! overflow-clip!">
                            <!-- Submit Button - Email -->
                            <Button title="Sign Up" unstyled type="submit" :disabled="submitState != 'idle'"
                                class="w-full! h-full! text-white flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 transition-all p-0! cursor-pointer"
                                :class="{
                                    'opacity-50! cursor-progress!': submitState == 'busy',
                                    'opacity-80! bg-emerald-500! cursor-default!': submitState == 'success',
                                    'opacity-80! bg-red-400! cursor-default!': submitState == 'failed'
                                }">
                                <Transition name="fade" mode="out-in" :duration="0.75">
                                    <LoaderCircle v-if="submitState == 'busy'" class="animate-spin m-auto p-auto" />
                                    <XIcon v-else-if="submitState == 'failed'" />
                                    <CheckIcon v-else />
                                </Transition>
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    <p v-for="err in $form?.email?.errors" class="w-full px-3 pt-1.5 text-red-300 text-xs">
                        {{ err?.message }}
                    </p>
                    <p class="w-full pt-1.5 text-xs font-semibold text-emerald-500" v-if="submitState == 'success'">
                        Congrats! You've signed up to our newsletter!
                    </p>
                </Form>

                <p class="font-medium opacity-80 italic w-full text-sm relative top-px">
                    Join our community server for instant updates:
                </p>

                <a :href="EXTERNAL_URLS.communityServer.supportInvite.toString()" target="_blank" class="w-full!">
                <Button unstyled class="w-full! gap-1.5 p-1 py-1.5 bg-zinc-700/80 hover:bg-zinc-700 rounded-md cursor-pointer transition-all active:scale-97 flex items-center justify-center flex-row flex-wrap">
                    <DiscordIcon class="size-6! p-0.25 min-w-fit aspect-square!" />
                    <p class="font-semibold"> Join our Community Server </p>
                </Button>
                </a>


                <!-- Explore - Pre Release -->
                <div class="flex flex-col items-center justify-center gap-0 w-full pt-1 px-3">
                    <p class="text-xs opacity-60">
                        *For now, you can explore the pre-released version of Sessions Bot!
                        Please be advised that features are limited on the current version as our dev team is small.
                        <br>** These upcoming release of Sessions Bot should be released within the nex few months.
                    </p>
                    <Button title="Use Pre Release" @click="visible = false" unstyled
                        class="bg-zinc-700/80 hover:bg-zinc-700 mt-3.5 p-1 px-2.5 active:scale-95 font-medium rounded-md cursor-pointer transition-all w-fit">
                        <p class="truncate font-semibold relative bottom-px">
                            Use Pre-Release 🗃️
                        </p>
                    </Button>

                    <div class="flex w-full px-3 gap-1 mt-4 items-center justify-center">
                        <Checkbox @value-change="(v) => updateAlertSilenceChoice = v" size="small"
                            inputId="updateAlertSilenceChoice" binary />
                        <label for="updateAlertSilenceChoice" class="text-sm opacity-65 relative bottom-px"> Don't show
                            again </label>
                    </div>

                    <a class="opacity-50 mt-3 hover:underline text-xs w-fit text-center" target="_blank"
                        rel="noopener noreferrer"
                        href="mailto:sessionsbot@sessionsbot.fyi?subject=%F0%9F%99%8F%20%7C%20Feature%20Request&body=Thank%20you%20for%20using%20Sessions%20Bot!%0APlease%20list%20any%20requested%20features%20below%3A%0A-%20">
                        Request Features
                    </a>

                </div>
            </main>
        </template>
    </Dialog>
</template>

<style>
    @reference "@/styles/style.css";

    .upcoming-feature-group {
        @apply w-full flex flex-col gap-1.25;
    }

    @keyframes hammer-swing {
    0% {
        transform: rotate(-3deg);
        color: rgba(255, 255, 255, 0.75);
    }

    30% {
        transform: rotate(-3deg); /* hold before swing */
    }

    55% {
        transform: rotate(10deg);
        color: rgba(252, 211, 77, 0.9); /* impact */
    }

    65% {
        transform: rotate(8deg); /* tiny rebound */
    }

    100% {
        transform: rotate(-3deg);
        color: rgba(255, 255, 255, 0.75);
    }
    }

    .sparkles-icon {
    animation: hammer-swing 1.8s cubic-bezier(.4, 0, .2, 1) infinite;
    transform-origin: center bottom;
    }


    

</style>