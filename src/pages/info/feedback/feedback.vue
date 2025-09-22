<script setup lang="ts">
    import { Form, FormInstance, FormSubmitEvent } from '@primevue/forms';
    import { AngryIcon, ArrowLeftSquareIcon, CheckSquareIcon, ClockFadingIcon, FrownIcon, HomeIcon, LaughIcon, LayoutDashboard, LockIcon, MehIcon, SmileIcon, SmilePlusIcon } from 'lucide-vue-next';
    // @ts-ignore
    import { zodResolver } from '@primevue/forms/resolvers/zod';
    import { z } from 'zod';
    import { toaster } from '@/utils/defaultExports';
    import { POSITION } from 'vue-toastification';
    import router from '@/utils/router';

    // Feedback Form Ref
    const feedbackFormRef = ref<FormInstance>()

    // Feedback Form Resolver
    const feedbackFormResolver = ref(zodResolver(
        z.object({
            discovery: z.string({message: 'Please select a choice!'}).trim().min(1, {message: `Please select a choice!`}),
            ['discovery-other']: z.string().trim().max(45, 'Response is too long!').optional(),
            overallRating: z.number({message: 'Please provide a rating!'}),
            setupRating: z.number({message: 'Please provide a rating!'}),
            signupRating: z.number({message: 'Please provide a rating!'}),
            premiumPurchase: z.string({message: 'Please select a choice!'}).trim().min(1, {message: `Please select a choice!`}),
            ['premiumPurchase-other']: z.string().trim().max(250, 'Response is too long!').optional(),
            featureRequests: z.union([z.null(), z.literal(''), z.string().trim().min(5, 'Not long enough!')], {message: 'Invalid input type!'}),
            additionalComments: z.union([z.null(), z.literal(''), z.string().trim().min(5, 'Not long enough!')], {message: 'Invalid input type!'}),
        })
    ))


    // Feedback Form Submission
    const submissionLoading = ref(false);
    async function feedbackFormSubmission(f:FormSubmitEvent){
        if(f.valid){ // Valid Submission:
            submissionLoading.value = true;
            let responses = f?.values;

            // Prepare Responses:
            // custom discovery method
            if (responses.discovery !== 'Other') {
                delete responses['discovery-other'];
            }
            // custom premium purchase response
            if (responses.premiumPurchase !== 'Maybe') {
                delete responses['premiumPurchase-other'];
            }
            // blank feature requests
            if (!responses.featureRequests) {
                delete responses['featureRequests'];
            }
            // blank additional comments
            if (!responses.additionalComments) {
                delete responses['additionalComments'];
            }

            // Send to GoogleSheet:
            try {
                
                const result = fetch('https://script.google.com/macros/s/AKfycbypzYRefJiPEZvSHWQ_hNKof1RNuFzgWL-vRK0FqjoxnmJvlCDrCDAYGiUQxgzI3d8/exec', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(responses) // converts object → form data
                }).then((res) => {
                    submissionLoading.value = false;
                    return res;
                }).catch((err) => {
                    submissionLoading.value = false;
                    toaster.error(`Failed to save feedback, please try again!`, {position: POSITION.TOP_CENTER});
                });

                toaster.success(`Feedback Sent!`, {position: POSITION.TOP_CENTER});
                router.push('/');

            } catch (err) {
                submissionLoading.value = false;
                console.warn('Error sending/saving feedback to Google:', err);
                toaster.error(`Failed to save feedback, please try again!`, {position: POSITION.TOP_CENTER});
            }

            

        } else { // Invalid Submission:
            submissionLoading.value = false;
            return // console.warn('INVALID Submission', f)
        }
    }

</script>

<template>
<main class="flex flex-1 flex-col flex-wrap gap-2 items-start justify-start">
    <!-- Page Header -->
    <header class="flex w-full bg-black/30 justify-between items-center content-center gap-2 p-2.5">
        <h1 class="text-2xl py-1 font-bold tracking-wide"> 📝 Feedback | Sessions Bot </h1>
        
        <Button title="Go to Homepage" @click="$router.push('/')" unstyled class="p-1 bg-zinc-700 flex items-center flex-nowrap gap-0.75 rounded-md shadow-md cursor-pointer transition-all hover:scale-110 active:scale-95">
            <HomeIcon :size="22" />
        </Button>
    </header>

    <!-- Feedback Page: -->
    <section class="flex w-full max-w-screen p-13 py-5 justify-center items-center content-center">

        <!-- Feedback Form: -->
        <Form @submit="feedbackFormSubmission" :resolver="feedbackFormResolver" v-slot="$form" ref="feedbackFormRef" class="bg-white/5 self-center w-fit max-w-167 p-2 gap-3 flex justify-start items-start content-center flex-wrap flex-col rounded-md ring-1 ring-ring shadow-md">

            <!-- Feedback/Form Info -->
            <div class="flex flex-col gap-1 text-white/85"> 

                <p class="p-3 block"> 
                    Hello and <b>thank you</b> for using <b>Sessions Bot</b>! Please take a <i>short</i> amount of time to provide us with your feedback in relation to your usage of <b>Sessions Bot</b>'s <i>features and services</i>. <br><br> <i>When users complete this survey we use this data to better improve our products!</i>
                </p>
                
                <div class="flex-col italic pl-4 opacity-55 text-sm flex flex-wrap gap-1 p-1">
                    
                    <div class="flex-row flex items-center justify-start flex-nowrap gap-1.5 p-1">
                        <ClockFadingIcon :size="18" class="inline"/>
                        <p> Est. Time: 2 Minuets </p>
                    </div>

                    <div class="flex-row flex items-center justify-start flex-nowrap gap-1.5 p-1">
                        <LockIcon :size="18" class="inline"/>
                        <p> Your responses are 100% anonymous. </p>
                    </div>

                </div>

            </div>

            <!-- Question 1 - Discovery -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full" :pt="{root: $form.discovery?.invalid && '!border-red-300', legend: $form.discovery?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 1 </p>
                        <p class="inline"> How did you find out about Sessions Bot? </p>
                        <p class="text-rose-600 inline relative bottom-1 right-0.25"> * </p>
                    </div>
                    </template>
                    <!-- Options -->
                    <RadioButtonGroup 
                    @value-change=" (e) => {
                        if (e != 'Other'){ feedbackFormRef.setFieldValue('discovery-other', ''); feedbackFormRef.validate('discovery-other'); } 
                    }"
                        name="discovery" class="flex flex-col gap-1"
                    >

                        <div class="flex items-center gap-2">
                            <RadioButton inputId="anotherDiscord" value="From another Discord Server" />
                            <label for="anotherDiscord">From another Discord Server</label>
                        </div>

                        <div class="flex items-center gap-2">
                            <RadioButton inputId="discordMarketplace" value="Discord Application Marketplace" />
                            <label for="discordMarketplace">Discord Application Marketplace</label>
                        </div>

                        <div class="flex items-center gap-2">
                            <RadioButton inputId="searchProvider" value="Google, Bing, Yahoo, etc. (search provider)" />
                            <label for="searchProvider"> Google, Bing, Yahoo, etc. (search provider) </label>
                        </div>

                        <div class="flex items-center gap-2 flex-wrap">
                            <RadioButton inputId="otherInput" value="Other" />
                            <label for="otherInput"> Other </label>
                            <InputText
                                name="discovery-other"
                                size="small"
                                v-if="$form.discovery?.value == 'Other'"
                                :required="$form.discovery.value == 'Other'"
                                placeholder="Please specify..."
                                :maxlength="45"
                                
                            />
                        </div>

                    </RadioButtonGroup>
                    <!-- Input Error - Messages -->
                    <Message v-if="$form.discovery?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.discovery.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Question 2 - Overall Rating -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full"  :pt="{root: $form.overallRating?.invalid && '!border-red-300', legend: $form.overallRating?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 
                            2
                        </p>
                        <p class="inline"> 
                            Overall, How would you rate Sessions Bot in general? 
                        </p>
                        <p class="text-rose-600 inline relative bottom-1 right-0.25"> 
                            * 
                        </p>
                    </div>
                    </template>
                    <!-- Options -->
                    <section class="mx-2.5 mt-1.25 gap-1.5 flex items-center justify-center flex-col w-fit">
                        
                        <!--  Rating Selection -->
                        <Rating name="overallRating" class="bg-zinc-800 p-1 px-1.5 rounded-md ring-1 ring-ring">
                            <template #onicon="$onIcon">
                                <p v-if="feedbackFormRef.states.overallRating.value == 1"  class="size-md text-red-400"> <AngryIcon title="Angry" :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.overallRating.value == 2"  class="size-md text-orange-500"> <FrownIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.overallRating.value == 3"  class="size-md text-yellow-500"> <MehIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.overallRating.value == 4"  class="size-md text-lime-400"> <SmileIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.overallRating.value == 5"  class="size-md text-emerald-500"> <LaughIcon :size="22"/> </p>
                            </template>
                            <template #officon>
                                <p class="size-md opacity-30"> <SmilePlusIcon title="Select Rating" :size="22"/> </p>
                            </template>
                        </Rating>
                        <!-- Footers -->
                        <div class="relative w-[110%] flex justify-between items-center gap-1">
                            <p class="text-xs opacity-50  w-fit"> Worst </p>
                            <p class="text-xs opacity-50  w-fit"> Best </p>
                        </div>

                    </section>
                    <!-- Input Error - Messages -->
                    <Message v-if="$form.overallRating?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.overallRating.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Question 3 - Setup Rating -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full" :pt="{root: $form.setupRating?.invalid && '!border-red-300', legend: $form.setupRating?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 
                            3
                        </p>
                        <p class="inline"> 
                            Overall, How easy was it to setup Sessions Bot for your server? 
                        </p>
                        <p class="text-rose-600 inline relative bottom-1 right-0.25"> 
                            * 
                        </p>
                    </div>
                    </template>
                    <!-- Options -->
                    <section class="mx-2.5 mt-1.25 gap-1.5 flex items-center justify-center flex-col w-fit">
                        
                        <!--  Rating Selection -->
                        <Rating name="setupRating" class="bg-zinc-800 p-1 px-1.5 rounded-md ring-1 ring-ring">
                            <template #onicon="$onIcon">
                                <p v-if="feedbackFormRef.states.setupRating.value == 1"  class="size-md text-red-400"> <AngryIcon title="Angry" :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.setupRating.value == 2"  class="size-md text-orange-500"> <FrownIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.setupRating.value == 3"  class="size-md text-yellow-500"> <MehIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.setupRating.value == 4"  class="size-md text-lime-400"> <SmileIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.setupRating.value == 5"  class="size-md text-emerald-500"> <LaughIcon :size="22"/> </p>
                            </template>
                            <template #officon>
                                <p class="size-md opacity-30"> <SmilePlusIcon title="Select Rating" :size="22"/> </p>
                            </template>
                        </Rating>
                        <!-- Footers -->
                        <div class="relative w-[110%] flex justify-between items-center gap-1">
                            <p class="text-xs opacity-50  w-fit"> Hard </p>
                            <p class="text-xs opacity-50  w-fit"> Easy </p>
                        </div>

                    </section>
                    <!-- Input Error - Messages -->
                    <Message v-if="$form.setupRating?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.setupRating.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Question 4 - Signup Rating -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full" :pt="{root: $form.signupRating?.invalid && '!border-red-300', legend: $form.signupRating?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 
                            4
                        </p>
                        <p class="inline"> 
                            Overall, How understandable is it to see/signup for available sessions. 
                        </p>
                        <p class="text-rose-600 inline relative bottom-1 right-0.25"> 
                            * 
                        </p>
                    </div>
                    </template>
                    <!-- Options -->
                    <section class="mx-2.5 mt-1.25 gap-1.5 flex items-center justify-center flex-col w-fit">
                        
                        <!--  Rating Selection -->
                        <Rating name="signupRating" class="bg-zinc-800 p-1 px-1.5 rounded-md ring-1 ring-ring">
                            <template #onicon="$onIcon">
                                <p v-if="feedbackFormRef.states.signupRating.value == 1"  class="size-md text-red-400"> <AngryIcon title="Angry" :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.signupRating.value == 2"  class="size-md text-orange-500"> <FrownIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.signupRating.value == 3"  class="size-md text-yellow-500"> <MehIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.signupRating.value == 4"  class="size-md text-lime-400"> <SmileIcon :size="22"/> </p>
                                <p v-else-if="feedbackFormRef.states.signupRating.value == 5"  class="size-md text-emerald-500"> <LaughIcon :size="22"/> </p>
                            </template>
                            <template #officon>
                                <p class="size-md opacity-30"> <SmilePlusIcon title="Select Rating" :size="22"/> </p>
                            </template>
                        </Rating>
                        <!-- Footers -->
                        <div class="relative w-[110%] flex justify-between items-center gap-1">
                            <p class="text-xs opacity-50  w-fit"> Hard </p>
                            <p class="text-xs opacity-50  w-fit"> Easy </p>
                        </div>

                    </section>
                    <!-- Input Error - Messages -->
                    <Message v-if="$form.signupRating?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.signupRating.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Question 5 - Premium -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full" :pt="{root: $form.premiumPurchase?.invalid && '!border-red-300', legend: $form.premiumPurchase?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 
                            5
                        </p>
                        <p class="inline"> 
                            Would you ever consider buying the premium version of <b>Sessions Bot</b>?
                        </p>
                        <p class="text-rose-600 inline relative bottom-1 right-0.25"> 
                            * 
                        </p>
                    </div>
                    </template>
                    <!-- Options -->
                    <RadioButtonGroup 
                        @value-change=" (e) => {
                            if (e != 'Maybe'){ feedbackFormRef.setFieldValue('premiumPurchase-other', ''); feedbackFormRef.validate('premiumPurchase-other'); } 
                        }" 
                        name="premiumPurchase" 
                        class="flex flex-col gap-1"
                    >

                        <div class="flex items-center gap-2">
                            <RadioButton inputId="yesPremium" value="Yes" />
                            <label for="yesPremium">Yes</label>
                        </div>

                        <div class="flex items-center gap-2">
                            <RadioButton inputId="noPremium" value="No" />
                            <label for="noPremium">No</label>
                        </div>

                        <div class="flex items-center gap-2 flex-wrap">
                            <RadioButton inputId="otherInput" value="Maybe" />
                            <label for="otherInput"> Maybe </label>
                            <InputText
                                name="premiumPurchase-other"
                                size="small"
                                v-if="$form.premiumPurchase?.value == 'Maybe'"
                                :required="$form.premiumPurchase.value == 'Maybe'"
                                placeholder="Please specify..."
                                :maxlength="250"
                                
                            />
                        </div>

                    </RadioButtonGroup>
                    <!-- Input Error - Messages -->
                    <Message v-if="$form.premiumPurchase?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.premiumPurchase.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Question 6 - Feature Requests -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full" :pt="{root: $form.featureRequests?.invalid && '!border-red-300', legend: $form.featureRequests?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 
                            6
                        </p>
                        <p class="inline"> 
                            Are there any features or services you wish to see added in the future?
                        </p>
                        <p hidden class="text-rose-600 inline relative bottom-1 right-0.25"> 
                            * 
                        </p>
                    </div>
                    </template>

                    <!-- Text Input -->
                    <Textarea class="m-2 max-w-90 !w-[70%] min-h-20 max-h-100" name="featureRequests" size="small" placeholder="Please specify any feature requests here. (optional)" />

                    <!-- Input Error - Messages -->
                    <Message v-if="$form.featureRequests?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.featureRequests.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Question 7 - Additional Comments -->
            <div class="flex w-full gap-1 p-1">
                <Fieldset class="w-full" :pt="{root: $form.additionalComments?.invalid && '!border-red-300', legend: $form.additionalComments?.invalid && '!border-red-300'}">
                    <!-- Title -->
                    <template #legend="$legend">
                    <div class="block gap-1.5 py-0.75">
                        <p class="size-6 inline-flex text-center items-center justify-center mr-0.5 bg-zinc-700 rounded-md font-bold text-white/80 shadow-lg"> 
                            7
                        </p>
                        <p class="inline"> 
                            Do you have any additional comments?
                        </p>
                        <p hidden class="text-rose-600 inline relative bottom-1 right-0.25"> 
                            * 
                        </p>
                    </div>
                    </template>

                    <!-- Text Input -->
                    <Textarea class="m-2 max-w-90 !w-[70%] min-h-20 max-h-100" name="additionalComments" size="small"  placeholder="Any additional comment(s) here. (optional)" />

                    <!-- Input Error - Messages -->
                    <Message v-if="$form.additionalComments?.invalid" severity="error" class="opacity-75 mt-1" size="small" variant="simple">
                        <ul class="flex flex-col gap-1">
                            <li v-for="(error, index) of $form.additionalComments.errors" class="text-red-300" :key="index"> 
                                {{ error.message }}
                            </li>
                        </ul>
                    </Message>
                </Fieldset>
            </div>


            <!-- Submit Buttons -->
            <div class="flex w-full gap-1.5 flex-row p-1 mb-2 justify-center items-center">
                <Button type="submit" :disabled="submissionLoading" unstyled class="bg-emerald-600/80 disabled:opacity-50 hover:bg-emerald-500/75 transition-all rounded-md shadow-lg px-2 py-1 font-semibold cursor-pointer flex flex-row gap-0.5 items-center">
                    <CheckSquareIcon :size="22" />
                    <p> Submit </p>
                </Button>
            </div>

        </Form>

    </section>

</main>
</template>

<style scoped>


:deep()legend {
    border: solid 1px var(--color-ring);
    margin-bottom: 11px;
}

:deep()form{
    --p-fieldset-background: rgb(23,23,26);
    --p-fieldset-legend-background: rgb(23,23,26);

    --p-radiobutton-checked-background: var(--color-emerald-500);
    --p-radiobutton-checked-border-color: var(--color-emerald-600);
    --p-radiobutton-checked-hover-border-color: var(--color-emerald-400);
    --p-radiobutton-checked-hover-background: var(--color-emerald-400);

    --p-inputtext-hover-border-color: var(--color-emerald-300);
    --p-inputtext-focus-border-color: var(--color-emerald-400);
    --p-textarea-hover-border-color: var(--color-emerald-300);
    --p-textarea-focus-border-color: var(--color-emerald-400);

}

</style>