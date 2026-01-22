<script setup lang="ts">
import { Form, FormInstance, FormSubmitEvent } from '@primevue/forms';
import { CheckIcon, CornerDownRightIcon, LoaderCircle, MailCheckIcon, MailIcon, RefreshCcw, SparklesIcon, XIcon } from 'lucide-vue-next';
//@ts-expect-error
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod'
import axios from 'axios';

    // MODAL - Popup Visible
    const visible = defineModel<boolean>('visible')


    // Newsletter Form
    function useNewsletterForm(){
        const newsletterFormRef = ref<FormInstance>()
        const resolver = zodResolver(z.object({
            email: z.string().email('Please enter a valid email address')
        }))
        const values = {
            email: ref('')
        }

        const submitState = ref<'idle'|'busy'|'success'|'failed'>('idle')

        async function submitNewsletterForm(e:FormSubmitEvent) {
            try {
                const {values} = e;
                console.info('Form Submitted', e.valid, values)
                submitState.value = 'busy'

                if(!e.valid) throw {reason: 'invalid', e}
                
                const url = new URL("https://script.google.com/macros/s/AKfycbxUgX3BJYZ1xDfjd_aTv2YBXtPL0trqGTen5b5qZe4ykSwP_WDcFya_HauUyXkKowzA/exec");
                url.searchParams.set("email", values.email);

                const res = await fetch(url.toString())
                
                if(res.ok) {
                    submitState.value = 'success'
                } else throw {reason: 'request failed', res}
                
            } catch (err) {
                submitState.value = 'failed';
                console.warn('Failed to submit Newsletter Form!', err)
            } finally {
                if(submitState.value == 'success') return  // leave disabled!
                setTimeout(() => submitState.value = 'idle',3_000)
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
    const { newsletterFormRef, resolver, values:formValues, submitState, submitNewsletterForm } = useNewsletterForm()


</script>

<template>
<Dialog :visible="visible" modal block-scroll :draggable=false class="m-14 w-[80%] max-w-130 overflow-y-auto!">
    <template #container>
        <main class="flex p-4 flex-col justify-center items-center gap-2 w-full h-full">
            
            <!-- Close -->
             <Button title="Close Alert" @click="visible = false, visible = false" unstyled class="absolute! right-2.5 top-2.5 rounded cursor-pointer active:scale-95 hover:bg-ring/80 transition-all">
                <XIcon class="opacity-75" :size="24" />
             </Button>
            
            <div class="p-4 rounded-full aspect-square w-fit bg-white/10 ">
                <SparklesIcon :size="44" />
            </div>
        
            <p class="font-bold text-3xl px-5 text-center relative top-1"> Sessions Bot is Getting a Major Upgrade! 🎉 </p>
            <p class="opacity-45 px-5 text-center"> We're working hard on some exciting improvements to make Sessions Bot better than ever. </p>
        
            <!-- Excitement List -->
            <div class="w-full flex flex-col gap-2 pt-1">
                <p class="font-bold text-sm uppercase opacity-50 px-2.5"> What's Coming:</p>
                <!-- Session Customization -->
                <div class="flex items-center justify-start gap-0.75 px-3">
                    <CheckIcon class="min-w-fit aspect-square relative top-0.5" :size="16"/>
                    <p class="truncate font-semibold"> Way MORE Session/Event Customization</p>
                </div>
                    <!-- Sub-Items -->
                    <div v-for="value in [
                        'Descriptions',
                        'Individualized Time Zones & Post Channels per session',
                        'Post Sessions to Discord either the same day or before  the event start at a specified time.',
                        'Required Roles for RSVP Slots'

                    ]" class="flex items-start justify-start gap-0.75 px-6">
                        <CornerDownRightIcon class="min-w-fit aspect-square relative top-1 opacity-65" :size="16"/>
                        <p class="text-wrap font-semibold text-sm opacity-80"> {{ value }} </p>
                    </div>
                <!-- SCHEDULE Customization -->
                <div class="flex items-center justify-start gap-0.75 px-3">
                    <CheckIcon class="min-w-fit aspect-square relative top-0.5" :size="16"/>
                    <p class="truncate font-semibold"> Way MORE Scheduling/Recurrence Customization</p>
                </div>
                    <!-- Sub-Items -->
                    <div v-for="value in [
                        'Configure daily, weekly, monthly, and yearly repeating sessions',
                        'Apply maximum repeat counts & end repeat dates',
                    ]" class="flex items-start justify-start gap-0.75 px-6">
                        <CornerDownRightIcon class="min-w-fit aspect-square relative top-1 opacity-65" :size="16"/>
                        <p class="text-wrap font-semibold text-sm opacity-80"> {{ value }} </p>
                    </div>
                <!-- Audit Log -->
                <div class="flex items-center justify-start gap-0.75 px-3">
                    <CheckIcon class="min-w-fit aspect-square relative top-0.5" :size="16"/>
                    <p class="truncate font-semibold"> Session and Audit Logs</p>
                </div>
                <!-- Audit Log -->
                <div class="flex items-center justify-start gap-0.75 px-3">
                    <CheckIcon class="min-w-fit aspect-square relative top-0.5" :size="16"/>
                    <p class="truncate font-semibold"> And much more! </p>
                </div>

                

            </div>

            <!-- Newsletter Signup -->
            <p class="font-bold text-sm uppercase opacity-50 px-2.5 w-full text-center"> Be the First to Know</p>
            <p class="font-medium opacity-80 relative bottom-1">
                Signup for our newsletter to stay updated:
            </p>

            <Form v-slot="$form" :resolver="resolver" @submit="submitNewsletterForm" class="w-full">
                <InputGroup>
                    <InputGroupAddon>
                        <MailIcon />
                    </InputGroupAddon>
                    <InputText
                        name="email"
                        type="email"
                        inputmode="email"
                        autocomplete="email"
                        autocapitalize="none"
                        autocorrect="off"
                        spellcheck="false"
                        v-model="formValues.email.value"
                        :disabled="submitState !== 'idle'"
                        placeholder="Email"
                        class="font-medium"
                    />

                    <InputGroupAddon class="p-0! overflow-clip!">
                        <Button title="Sign Up" unstyled type="submit" :disabled="submitState != 'idle'" class="w-full! h-full! text-white flex items-center justify-center bg-zinc-600 hover:bg-zinc-500 p-0! cursor-pointer"
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
            

            <!-- Explore - Pre Release -->
            <div class="flex flex-col items-center justify-center gap-0 w-full px-3">
                <p class="text-xs opacity-60"> 
                    *For now, you can explore the pre-released version of Sessions Bot! 
                    Please be advised that features are limited on the current version as our dev team is small.
                    <br>** These upcoming release of Sessions Bot should be released within the nex few months.
                </p>
                <Button title="Use Pre Release" @click="visible = false" unstyled class="bg-zinc-600 mt-3.5 active:scale-95 font-medium rounded-md cursor-pointer transition-all p-1 px-2 w-fit">
                    <p class="truncate font-semibold relative bottom-px"> 
                        Use Pre-Release 🗃️
                    </p>
                </Button>

                <a class="opacity-50 mt-4 hover:underline text-xs w-fit text-center" target="_blank" rel="noopener noreferrer" href="mailto:sessionsbot@sessionsbot.fyi?subject=%F0%9F%99%8F%20%7C%20Feature%20Request&body=Thank%20you%20for%20using%20Sessions%20Bot!%0APlease%20list%20any%20requested%20features%20below%3A%0A-%20" > 
                    Request Features 
                </a>
                
            </div>
        </main>
    </template>
</Dialog>
</template>

<style>
    @reference "@/styles/style.css";

</style>