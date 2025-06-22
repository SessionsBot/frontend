<template>
    <div class="px-6 py-20 md:px-12 lg:px-20 flex justify-center items-center flex-col">
        
        <div class="flex flex-col gap-4 items-center justify-center my-12">
            <div class="text-primary dark:text-zinc-0 font-bold text-4xl lg:text-5xl text-center leading-tight">
                Pricing Plans</div>
            <div class="text-zinc-500 dark:text-zinc-400 text-lg text-center leading-normal">Lorem ipsum dolor
                sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
        </div>

        <div class="flex lg:flex-row flex-col gap-8 max-w-7xl mx-auto">
            <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-zinc-400 dark:bg-zinc-800 shadow-sm gap-6">
                <div class="flex flex-col gap-2">
                    <h4 class="text-primary dark:text-zinc-0 font-medium text-xl leading-tight">Basic</h4>
                    <p class="text-zinc-500 dark:text-zinc-400 leading-normal">Lorem ipsum dolor sit, amet
                        consectetur adipisicing elit. Velit numquam eligendi quos.</p>
                </div>

                <div class="w-full h-px bg-zinc-200 dark:bg-zinc-700" />
                <div class="flex items-center gap-2">
                    <span class="font-bold text-3xl text-primary dark:text-zinc-0 leading-tight">$0</span>
                    <span class="font-medium text-zinc-500 dark:text-zinc-400 leading-tight">FREE</span>
                </div>
                <div class="w-full h-px bg-zinc-200 dark:bg-zinc-600" />
                <ul class="list-none flex flex-col gap-4 flex-1">
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Arcu vitae elementum </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Dui faucibus in ornare
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Morbi tincidunt augue
                        </span>
                    </li>
                </ul>
                <Button label="Get Started" rounded class="w-full" />
            </div>
            <div class="w-full flex-1 p-8 flex rounded-2xl flex-col bg-zinc-0 dark:bg-zinc-800 shadow-sm gap-6">
                <div class="flex flex-col gap-2">
                    <h4 class="text-primary dark:text-zinc-0 font-medium text-xl leading-tight">Premium</h4>
                    <p class="text-zinc-500 dark:text-zinc-400 leading-normal">Lorem ipsum dolor sit, amet
                        consectetur adipisicing elit. Velit numquam eligendi quos.</p>
                </div>

                <div class="w-full h-px bg-zinc-200 dark:bg-zinc-700" />
                <div class="flex items-center gap-2">
                    <span class="font-bold text-3xl text-primary dark:text-zinc-0 leading-tight">$15</span>
                    <span class="font-medium text-zinc-500 dark:text-zinc-400 leading-tight">per month</span>
                </div>
                <div class="w-full h-px bg-zinc-200 dark:bg-zinc-600" />
                <ul class="list-none flex flex-col gap-4 flex-1">
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Arcu vitae elementum </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Dui faucibus in ornare
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Morbi tincidunt augue
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Duis ultricies lacus sed
                        </span>
                    </li>
                </ul>
                <Button label="Buy Now" rounded class="w-full" />
            </div>

            <div class="w-full flex-1 p-8 flex rounded-2xl flex-col dark:bg-zinc-800 shadow-sm gap-6">
                <div class="flex flex-col gap-2">
                    <h4 class="text-primary dark:text-zinc-0 font-medium text-xl leading-tight">Enterprise</h4>
                    <p class="text-zinc-500 dark:text-zinc-400 leading-normal">Lorem ipsum dolor sit, amet
                        consectetur adipisicing elit. Velit numquam eligendi quos.</p>
                </div>

                <div class="w-full h-px bg-zinc-200 dark:bg-zinc-700" />
                <div class="flex items-center gap-2">
                    <span class="font-bold text-3xl text-primary dark:text-zinc-0 leading-tight">$49</span>
                    <span class="font-medium text-zinc-500 dark:text-zinc-400 leading-tight">per month</span>
                </div>
                <div class="w-full h-px bg-zinc-200 dark:bg-zinc-600" />
                <ul class="list-none flex flex-col gap-4 flex-1">
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Arcu vitae elementum </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Dui faucibus in ornare
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Morbi tincidunt augue
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Duis ultricies lacus sed
                        </span>
                    </li>
                    <li class="flex items-center gap-2">
                        <i class="pi pi-check-circle !text-lg text-green-500" />
                        <span class="text-zinc-800 dark:text-zinc-100 leading-tight"> Imperdiet proin </span>
                    </li>
                </ul>
                <Button disabled rounded class="w-full !cursor-not-allowed">
                    <i class="font-bold"> Coming Soon </i>
                </Button>
            </div>

        </div>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
</script>
