<script setup lang="ts">
    // Imports
    import { useAuthStore } from '@/utils/stores/auth';
    import { useNavStore } from '@/utils/stores/nav';
    import { defaultWindow } from '@vueuse/core';

    // Auth:
    const auth = useAuthStore()
    const userLoggedIn = computed(() => auth.isAuthenticated)
    const logoutUser = () => auth.signOut()

    // NAVIGATION:
    const route = useRoute()
    const nav =  useNavStore()
    const navMenuVisible = computed(() => nav.navVisible)
    const closeNav = () => nav.closeNav()

    // Redirect Fns:
    const router = useRouter()
    const homepage = () => router.push('/')
    const dashboard = () => router.push('/dashboard');
    const pricingPlans = () => router.push('/pricing');
    const myAccount = () => router.push('/account');



</script>

<template>
	<nav v-show="navMenuVisible" class="text-white flex fixed z-20 w-screen inset-0 flex-1 flex-nowrap flex-row justify-end items-center text-center overflow-clip">
		<!-- Dismiss Area: -->
		<Transition name="fade">
		<span @click="closeNav" v-show="navMenuVisible" class="absolute bg-black/50 flex flex-1 h-full w-full items-center overflow-visible"> </span>
		</Transition>

		<!-- Navigation Menu: -->
		<Transition name="navMenu">
		<div v-show="navMenuVisible" class="relative self-end flex justify-start flex-col right-0 h-full w-65 max-w-[90%] bg-zinc-800 transition-all overflow-scroll">
			
			<!-- Nav Header: -->
			<header class="bg-zinc-900 h-14 sm:h-17 flex justify-center items-center text-center flex-nowrap">
				<!-- Close Button: -->
				<div class=" pl-2.75 flex flex-1 gap-1.5 justify-start items-center content-center flex-row">
					<img class="w-9 h-9 rounded-xl shadow-md shadow-modern-purple-discord/60 ring-1 ring-white/15" draggable="false" src="/sessionsBot.png">
					<h1 class="text-xl text-nowrap font-stretch-70% font-black text-shadow-md text-shadow-modern-purple-discord/70"> Sessions Bot </h1>
				</div>
				<button @click="closeNav" class="hover:bg-modern-red-default/50 w-12.5 h-14 sm:h-17 flex flex-wrap justify-center items-center content-center cursor-pointer transition-all">
					<svg class="m-2 p-0.5" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>
				</button>
				
			</header>

			<!-- Nav Buttons: -->
			<main class="flex flex-wrap flex-col justify-between items-center content-center flex-1">
					
				<!-- Top Links: -->
				<ol class="flex flex-wrap justify-center items-center p-2 gap-2">
					<li class="w-[95%] flex flex-nowrap flex-row justify-center items-center gap-1">
						<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
						<h1 class="text-nowrap text-sm text-gray-500/80"> 
							Main Links
						</h1>
						<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
					</li>
					
					<!-- Homepage -->
					<li v-if="route.name !== 'homepage'" @click="()=>{closeNav(), homepage()}" class="w-full h-fit p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z"/></svg>
						<p> Homepage </p>
					</li>

					<!-- Dashboard -->
					<li v-if="route.name !== 'dashboard'" @click="()=>{dashboard(), closeNav()}" class="w-full h-fit p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>
						<p> My Bot Dashboard </p>
					</li>

					<!-- Invite Bot -->
					<li @click="nav.externalPaths().inviteBotUsingDiscord()" class="w-full h-fit p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V8c0-.55-.45-1-1-1s-1 .45-1 1v2H2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1H6zm9 4c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/></svg>
						<p> Invite Bot to Server </p>
					</li>

					<!-- Invite Bot -->
					<li @click="()=>{pricingPlans(), closeNav()}" class="w-full h-fit p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg class="ml-0.5" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><rect fill="none" height="24" width="24"/><path d="M19.41,7.41l-4.83-4.83C14.21,2.21,13.7,2,13.17,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8.83 C20,8.3,19.79,7.79,19.41,7.41z M14,12c0.55,0,1,0.45,1,1v3c0,0.55-0.45,1-1,1h-1c0,0.55-0.45,1-1,1s-1-0.45-1-1h-1 c-0.55,0-1-0.45-1-1c0-0.55,0.45-1,1-1h3v-1h-3c-0.55,0-1-0.45-1-1v-3c0-0.55,0.45-1,1-1h1c0-0.55,0.45-1,1-1s1,0.45,1,1h1 c0.55,0,1,0.45,1,1c0,0.55-0.45,1-1,1h-3v1H14z"/></svg>
						<p> Pricing Plans </p>
					</li>

					<li class="w-full flex flex-nowrap justify-center content-center items-center">
						<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
					</li>
				</ol>

				<!-- Bottom Links: -->
				<ol class="flex flex-wrap justify-center items-center p-2 gap-2">

					<!-- Account -->
					<div class="w-full flex flex-nowrap flex-col justify-center items-center gap-2">
						<!-- Account Header: -->
						<li class="w-[95%] flex flex-nowrap flex-row justify-center items-center gap-1">
							<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
							<h1 class="text-nowrap text-sm text-gray-500/80"> 
								My Account
							</h1>
							<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
						</li>

						<!-- User Account: -->
						<li v-if="userLoggedIn" @click="()=>{myAccount(), closeNav()}" class="w-full p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
							<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/></g></svg>
							<p> My Account </p>
						</li>

						<!-- User Signout: -->
						<li v-if="userLoggedIn" @click="()=>{logoutUser(), closeNav(), homepage()}" class="w-full p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
							<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M5,5h6c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h6c0.55,0,1-0.45,1-1v0 c0-0.55-0.45-1-1-1H5V5z"/><path d="M20.65,11.65l-2.79-2.79C17.54,8.54,17,8.76,17,9.21V11h-7c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h7v1.79 c0,0.45,0.54,0.67,0.85,0.35l2.79-2.79C20.84,12.16,20.84,11.84,20.65,11.65z"/></g></g></svg>
							<p> Sign Out </p>
						</li>

						<!-- Discord Login -->
						<li v-if="!userLoggedIn" @click="auth.authWithDiscord()" class="w-full h-fit p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
							<svg class="h-5 w-5 mx-0.5 brightness-0 invert" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
								<g>
									<path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">

									</path>
								</g>
							</svg>
							<p class="text-nowrap"> Sign In with Discord </p>
						</li>

					</div>
					
					<!-- Information -->
					<li class="w-[95%] flex flex-nowrap flex-row justify-center items-center gap-1">
						<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
						<h1 class="text-nowrap text-sm text-gray-500/80"> 
							Information
						</h1>
						<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
					</li>

					<li @click="defaultWindow.open('https://docs.sessionsbot.fyi')" class="w-full p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 2.21c-.13 0-.26.05-.35.15l-.79.79c-.2.2-.51.2-.71 0l-.79-.79c-.2-.2-.51-.2-.71 0l-.79.79c-.2.2-.51.2-.71 0l-.79-.79c-.2-.2-.51-.2-.71 0l-.79.79c-.2.2-.51.2-.71 0l-.79-.79c-.2-.2-.51-.2-.71 0l-.79.79c-.2.2-.51.2-.71 0l-.8-.8c-.2-.2-.51-.2-.71 0l-.79.8c-.2.2-.51.2-.71 0l-.79-.8c-.2-.2-.51-.2-.71 0l-.79.8c-.2.2-.51.2-.71 0l-.79-.8c-.09-.09-.22-.14-.35-.14V21.8c.13 0 .26-.05.35-.15l.79-.79c.2-.2.51-.2.71 0l.79.79c.2.2.51.2.71 0l.79-.79c.2-.2.51-.2.71 0l.79.79c.2.2.51.2.71 0l.79-.79c.2-.2.51-.2.71 0l.79.79c.2.2.51.2.71 0l.79-.79c.2-.2.51-.2.71 0l.79.79c.2.2.51.2.71 0l.79-.79c.2-.2.51-.2.71 0l.79.79c.2.2.51.2.71 0l.79-.79c.2-.2.51-.2.71 0l.79.79c.1.1.23.15.35.15V2.21zM17 17H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
						<p> Documentation </p>
					</li>
					<li @click="$router.push('/support'), closeNav()" class="w-full p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M12.01,18 c-0.7,0-1.26-0.56-1.26-1.26c0-0.71,0.56-1.25,1.26-1.25c0.71,0,1.25,0.54,1.25,1.25C13.25,17.43,12.72,18,12.01,18z M15.02,10.6 c-0.76,1.11-1.48,1.46-1.87,2.17c-0.1,0.18-0.16,0.32-0.19,0.63c-0.05,0.45-0.45,0.78-0.9,0.78H12c-0.52,0-0.93-0.44-0.88-0.96 c0.03-0.34,0.11-0.69,0.3-1.03c0.49-0.87,1.42-1.39,1.96-2.16c0.57-0.81,0.25-2.33-1.37-2.33c-0.71,0-1.18,0.36-1.47,0.79 c-0.25,0.36-0.69,0.53-1.1,0.36l0,0C8.91,8.64,8.72,8,9.04,7.54C9.65,6.65,10.67,6,11.99,6c1.48,0,2.49,0.67,3.01,1.52 C15.44,8.24,15.7,9.59,15.02,10.6z"/></g></svg>
						<p> Get Support </p>
					</li>

					<li @click="$router.push('/privacy'), closeNav()" class="w-full p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M11.3,2.26l-6,2.25C4.52,4.81,4,5.55,4,6.39v4.7c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91v-4.7 c0-0.83-0.52-1.58-1.3-1.87l-6-2.25C12.25,2.09,11.75,2.09,11.3,2.26z M12,16L12,16c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h0 c0.55,0,1,0.45,1,1v0C13,15.55,12.55,16,12,16z M12,12L12,12c-0.55,0-1-0.45-1-1V8c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v3 C13,11.55,12.55,12,12,12z"/></g></svg>
						<p> Privacy Policy </p>
					</li>
					<li @click="$router.push('/terms'), closeNav()" class="w-full p-2 gap-1.5 cursor-pointer hover:bg-gray-500 rounded-sm active:scale-90 transition-all flex flex-nowrap items-center content-center justify-start">
						<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><g><rect fill="none" height="24" width="24"/><path d="M15.83,10.29l-2.12-2.12c-0.39-0.39-0.39-1.02,0-1.41l0,0c0.39-0.39,1.02-0.39,1.41,0l1.41,1.41l3.54-3.54 c0.39-0.39,1.02-0.39,1.41,0l0,0c0.39,0.39,0.39,1.02,0,1.41l-4.24,4.24C16.85,10.68,16.22,10.68,15.83,10.29z M10,7H3 C2.45,7,2,7.45,2,8v0c0,0.55,0.45,1,1,1h7c0.55,0,1-0.45,1-1v0C11,7.45,10.55,7,10,7z M20.29,12.71L20.29,12.71 c-0.39-0.39-1.02-0.39-1.41,0L17,14.59l-1.88-1.88c-0.39-0.39-1.02-0.39-1.41,0l0,0c-0.39,0.39-0.39,1.02,0,1.41L15.59,16 l-1.88,1.88c-0.39,0.39-0.39,1.02,0,1.41l0,0c0.39,0.39,1.02,0.39,1.41,0L17,17.41l1.88,1.88c0.39,0.39,1.02,0.39,1.41,0l0,0 c0.39-0.39,0.39-1.02,0-1.41L18.41,16l1.88-1.88C20.68,13.73,20.68,13.1,20.29,12.71z M10,15H3c-0.55,0-1,0.45-1,1v0 c0,0.55,0.45,1,1,1h7c0.55,0,1-0.45,1-1v0C11,15.45,10.55,15,10,15z"/></g></svg>
						<p> Terms & Conditions </p>
					</li>
					

					<li class="w-full flex flex-nowrap justify-center content-center items-center">
						<div class="h-[1.5px] w-[95%] bg-gray-500/50"> </div>
					</li>
				</ol>

			</main>
			
		</div>
		</Transition>

		</nav>
</template>
