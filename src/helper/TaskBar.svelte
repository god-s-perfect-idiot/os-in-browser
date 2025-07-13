<script>
	import Icon from '@iconify/svelte';
	import Time from './Time.svelte';
	import { pm } from '$lib/pm';
	import { apps } from '$lib/applib';
	import Date from './Date.svelte';

	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		title: p.title,
		icon: p.metadata.icon,
		color: p.metadata.color,
		appId: p.metadata.appId,
		iconColor: p.metadata.iconColor
	}));
</script>

<div class="absolute bottom-0 left-0 flex w-full justify-center">
	<div
		class="flex h-16 w-fit items-center justify-between rounded-t-2xl py-2 px-4 taskbar"
	>
		<div class="flex min-h-10 max-w-[70%] cursor-pointer flex-row gap-4 overflow-x-hidden p-1">
			{#if runningApps.length > 0}
				{#each runningApps as app}
					<div class="flex h-fit cursor-pointer flex-row gap-1">
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
				<div class="h-10 w-[2px] bg-gray-500 rounded-full mx-2"></div>
			{:else}
				<!-- Empty placeholder to maintain height when no apps are running -->
				<div class="h-10">
        </div>
			{/if}
		</div>
		<div class="flex gap-1 pr-1 text-lg font-[500]">
			<span class="cursor-pointer rounded-l-full px-1 py-2"><Date /></span>
			<span class="cursor-pointer rounded-r-full px-1 py-2"><Time /></span>
		</div>
	</div>
</div>

<style>

  .taskbar {
    background-color: var(--surface-color);
  }
</style>
