<script>
	import Icon from '@iconify/svelte';
	import Time from './Time.svelte';
	import { pm } from '$lib/pm';
	import { apps } from '$lib/applib';
	import Date from './Date.svelte';
	import { toggleAppDrawer, appDrawerOpen } from '$lib/appDrawerStore';
	import AppDrawer from './AppDrawer.svelte';
	import { taskbarState, setHovering, cancelAutoHideTimer, startAutoHideTimer } from '$lib/taskbarStore';

	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		title: p.title,
		icon: p.metadata.icon,
		color: p.metadata.color,
		appId: p.metadata.appId,
		iconColor: p.metadata.iconColor
	}));

	// Subscribe to taskbar state
	$: ({ isAutoHideEnabled, isHidden, isHovering } = $taskbarState);
	$: console.log('Taskbar state:', { isAutoHideEnabled, isHidden, isHovering });

	function handleMouseEnter() {
		console.log('Mouse enter taskbar area');
		if (isAutoHideEnabled) {
			setHovering(true);
			cancelAutoHideTimer();
			if (isHidden) {
				// Show taskbar immediately on hover
				console.log('Showing taskbar on hover');
				$taskbarState.isHidden = false;
			}
		}
	}

	function handleMouseLeave() {
		console.log('Mouse leave taskbar area');
		if (isAutoHideEnabled) {
			setHovering(false);
			startAutoHideTimer();
		}
	}

	// Start auto-hide timer when auto-hide is enabled
	$: if (isAutoHideEnabled && !isHovering) {
		console.log('Starting auto-hide timer from reactive statement');
		startAutoHideTimer();
	}
</script>

<!-- Hover area for revealing taskbar -->
{#if isAutoHideEnabled}
	<div 
		class="fixed bottom-0 left-0 w-full h-4 z-10"
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
	></div>
{/if}

<!-- Taskbar container -->
<div 
	class="fixed bottom-0 left-0 flex w-full justify-center transition-transform duration-300 ease-out z-20"
	class:translate-y-full={isHidden && isAutoHideEnabled}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	style="transform: {isHidden && isAutoHideEnabled ? 'translateY(100%)' : 'translateY(0)'}"
>
	<div class="taskbar flex h-16 w-fit items-center justify-between rounded-t-2xl px-4 py-2" data-context-menu="taskbar">
		<div class="flex min-h-10 max-w-[70%] cursor-pointer flex-row gap-4 overflow-x-hidden p-1">
			<!-- App Drawer Button -->
			<button
				class="icon flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-white transition-transform duration-200 hover:scale-110"
				on:click={toggleAppDrawer}
				aria-label="Open app drawer"
			>
				<Icon icon="mdi:apps" font-size="2rem" style="color: black;" class="icon" />
			</button>
			<div class="mx-2 h-10 w-[2px] rounded-full bg-gray-600"></div>
			{#if runningApps.length > 0}
				{#each runningApps as app}
					<div class="taskbar-app-item flex h-fit cursor-pointer flex-row gap-1 items-center group">
						<button
							class="icon flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-1 text-white"
							style="background-color: {app.color}"
							on:click={() => {
								const isMinimized = $pm.find((p) => p.pid === app.pid).metadata.isMinimized;
								if (isMinimized) {
									pm.updateMetadata(app.pid, { isMinimized: false });
								}
							}}
							><Icon
								icon={app.icon}
								font-size="1.5rem"
								style="color: {app.iconColor};"
								class="icon"
							/></button
						>
					</div>
				{/each}
				<div class="mx-2 h-10 w-[2px] rounded-full bg-gray-600"></div>
			{:else}
				<!-- Empty placeholder to maintain height when no apps are running -->
				<div class="h-10"></div>
			{/if}
		</div>
		<div class="flex gap-1 pr-1 text-lg font-[500]">
			<span class="cursor-pointer rounded-l-full px-1 py-2"><Date /></span>
			<span class="cursor-pointer rounded-r-full px-1 py-2"><Time /></span>
		</div>
	</div>
</div>

<!-- App Drawer - rendered with high z-index -->
<AppDrawer isOpen={$appDrawerOpen} />

<style>
  .taskbar {
    background-color: var(--surface-color);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }
  
  /* Ensure the taskbar slides completely out of view */
  .translate-y-full {
    transform: translateY(100%);
  }
</style>
