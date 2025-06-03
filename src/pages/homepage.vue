<script setup>


</script>


<template> 
<div class="text-white flex justify-start items-center flex-col w-full h-full flex-1 ">
    <!-- Homepage: -->
    <main class="p-5 gap-5 min-w-screen flex justify-center items-center text-center flex-col w-full h-full">
        
        <!-- Section 1: -->
        <div class="flex flex-nowrap lg:flex-row flex-col xl:justify-between justify-center items-center gap-5">
            
            <!-- Section 1 - Text: -->
            <div class="bg-modern-purple-discord/40 gap-2 p-3 w-screen lg:w-[65%] lg:max-w-180 lg:rounded-md h-fit flex justify-center items-center flex-wrap ring-2 ring-white/10">
                <!-- Section 1 - Heading -->
                <h1 class="font-bold text-3xl p-1 pb-0"> 
                    Roblox Group Sessions managment has never been easier!
                </h1>
                <!-- Section 1 - Details -->
                <p class="text-left p-3 pt-2"> 
                    Utilizing our new Web Dashboard makes managing your roblox group sessions a total breeze! Edit session schedules, modify exisiting event details, configure admin abilities/usage, and much more! 
                </p>
                
                <!-- Section 1 - Action Buttons -->
                <div class="gap-5 flex flex-wrap flex-row  justify-center items-center w-full">

                    <button class="default_button">
                        Invite Bot to Your Server
                    </button>
                    <button class="default_button">
                        Join Community Server
                    </button>
                    
                </div>
                <!-- Section 1 - Caption -->
                <p class="pt-1 italic opacity-50 text-xs before:content-['*'] beforeAstricMark"> 
                    Certain features are currently only availble via slash commands 
                </p>
                
            </div>

            <!-- Section 1 - Image: -->
            <div class=" flex px-0 py-2 sm:w-auto w-[90%] h-full justify-center items-center flex-wrap">
                <img draggable="false" class="max-h-70 ring-2 ring-white/10 rounded-md" src="../assets/signupEmbedExample.png">
            </div>

        </div>

        <!-- Section 2: -->
        <div class="flex flex-nowrap flex-col justify-center items-center gap-5">
            
            <!-- Section 2 - Text: -->
            <div class="bg-modern-green-default/40 gap-2 p-3 w-screen h-fit flex justify-center items-center flex-wrap flex-col ring-2 ring-white/10">
                <!-- Section 2 - Heading -->
                <h1 class="font-bold text-3xl p-1"> 
                    Roblox Group Sessions managment has never been easier!
                </h1>
                <!-- Section 2 - Details -->
                <p class="text-left p-3 pt-1 xl:w-[55%]"> 
                    Utilizing our new Web Dashboard makes managing your roblox group sessions a total breeze! Edit session schedules, modify exisiting event details, configure admin abilities/usage, and much more! 
                </p>
                
                <!-- Section 2 - Caption -->
                <p class="italic opacity-50 pb-1 text-xs before:content-['*'] beforeAstricMark"> 
                    Certain features are currently only availble via slash commands 
                </p>
                
            </div>

        </div>


        <!-- Section 3: -->
        <div class="flex flex-nowrap flex-col-reverse lg:flex-row-reverse xl:justify-between justify-center items-center gap-5">
            
            <!-- Section 3 - Text: -->
            <div class="bg-modern-red-default/40 gap-2 p-3 w-screen lg:w-[65%] lg:max-w-130 lg:rounded-md h-fit flex justify-center items-center flex-wrap ring-2 ring-white/10">
                <!-- Section 3 - Heading -->
                <h1 class="font-bold text-3xl p-1 pb-0"> 
                    Roblox Group Sessions managment has never been easier!
                </h1>
                <!-- Section 3 - Details -->
                <p class="text-left pb-0 pt-2"> 
                    Utilizing our new Web Dashboard makes managing your roblox group sessions a total breeze! Edit session schedules, modify exisiting event details, configure admin abilities/usage, and much more! 
                </p>
                
                <!-- Section 3 - Caption -->
                <p class="italic opacity-50 text-xs before:content-['*'] beforeAstricMark"> 
                    Certain features are currently only availble via slash commands 
                </p>
                
            </div>

            <!-- Section 3 - Image: -->
            <div class=" flex px-0 py-2 sm:w-auto lg:w-[45%] w-[90%] h-full justify-center items-center flex-wrap">
                <img draggable="false" class="max-h-70 ring-2 ring-white/10 rounded-md" src="../assets/availableCommands.png">
            </div>

        </div>


       
    </main>


</div> 
</template>



<style lang="css" scoped>

.divider-graident-white{
    width: 95%;
    height: 1.5px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.01));
}

.beforeAstricMark::before {
    font-size: 9px;
    position: relative;
    bottom: 2px;
    left: 1px;
}


</style>