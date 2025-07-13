<script>
	import { apps } from '$lib/applib';
	import App from './App.svelte';
	import Icon from '@iconify/svelte';
	import { pm } from '$lib/pm';
	import { onMount } from 'svelte';
	import { closeAppDrawer } from '$lib/appDrawerStore';

	export let isOpen = false;

	let selectedIndex = 0;
	let appButtons = [];

	function closeDrawer() {
		closeAppDrawer();
		selectedIndex = 0;
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeDrawer();
		}
	}

	function handleDrawerKeydown(event) {
		const totalApps = availableApps.length;
		
		switch (event.key) {
			case 'ArrowRight':
				event.preventDefault();
				selectedIndex = (selectedIndex + 1) % totalApps;
				break;
			case 'ArrowLeft':
				event.preventDefault();
				selectedIndex = selectedIndex === 0 ? totalApps - 1 : selectedIndex - 1;
				break;
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = (selectedIndex + 6) % totalApps;
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = selectedIndex < 6 ? totalApps - (6 - selectedIndex) : selectedIndex - 6;
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (availableApps[selectedIndex]) {
					launchApp(availableApps[selectedIndex].appId);
				}
				break;
		}
	}

	function launchApp(appId) {
		const app = apps[appId];
		if (app && !app.needsParent) {
			pm.add(app.name, {
				type: 'window',
				appId,
				isMinimized: false,
				position: {
					x: 100,
					y: 100
				},
				...app
			});
			closeDrawer();
		}
	}

	// Filter out apps that need a parent
	$: availableApps = Object.values(apps).filter(app => !app.needsParent);

	// Reset selected index when drawer opens
	$: if (isOpen) {
		selectedIndex = 0;
	}
</script>

<!-- Backdrop -->
<button
	class="fixed inset-0 z-[9999] cursor-default transition-opacity duration-300"
	class:opacity-0={!isOpen}
	class:opacity-100={isOpen}
	class:pointer-events-none={!isOpen}
	on:click={closeDrawer}
	on:keydown={handleKeydown}
	aria-label="Close app drawer"
	type="button"
></button>

<!-- App Drawer -->
<div 
	class="fixed bottom-16 left-1/2 transform bg-surface rounded-t-2xl shadow-2xl z-[10000] max-h-[70vh] overflow-hidden transition-all duration-300 ease-out border border-gray-200"
	class:genie-open={isOpen}
	class:genie-closed={!isOpen}
	style="width: min(90vw, 800px);"
	role="dialog"
	aria-label="Application drawer"
	on:keydown={handleDrawerKeydown}
	tabindex="0"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 bg-surface-high">
		<h2 class="text-xl font-semibold text-gray-800">Applications</h2>
		<button 
			on:click={closeDrawer}
			class="p-2 rounded-full hover:bg-gray-100 transition-colors"
			aria-label="Close drawer"
		>
			<Icon icon="mdi:close" class="text-gray-600" />
		</button>
	</div>
	
	<!-- Apps Grid -->
	<div class="p-6 overflow-y-auto max-h-[calc(70vh-80px)] bg-surface">
		<div class="grid grid-cols-6 gap-2">
			{#each availableApps as app, index}
				<button
					class="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-100 group"
					class:hover:bg-primary={index !== selectedIndex}
					class:bg-accent={index === selectedIndex}
					class:text-white={index === selectedIndex}
					on:click={() => launchApp(app.appId)}
					aria-label="Launch {app.name}"
					bind:this={appButtons[index]}
				>
					<div 
						class="w-12 h-12 rounded-4xl flex items-center justify-center transition-transform duration-100 group-hover:scale-110"
						style="background-color: {app.color};"
					>
						<Icon 
							icon={app.icon} 
							class="text-xl"
							style="color: {app.iconColor};"
						/>
					</div>
					<span class="text-base text-center font-medium truncate w-full">
						{app.name}
					</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Ensure smooth animations */
	.translate-y-full {
		transform: translate(-50%, 100%);
	}
	
	.translate-y-0 {
		transform: translate(-50%, 0);
	}

	/* Genie animation */
	.genie-closed {
		transform: translate(-50%, 100%) scale(0.1);
		opacity: 0;
	}
	
	.genie-open {
		transform: translate(-50%, 0) scale(1);
		opacity: 1;
	}
</style>
