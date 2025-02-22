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

<div
	class="absolute bottom-0 left-0 flex w-full h-16 items-center justify-between rounded-t-4xl py-2 pr-2 pl-2"
	style="background-color: #ffffffe9;"
>
	<div class="flex cursor-pointer flex-row gap-4">
		<button class="cursor-pointer pl-1">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#cacaca]">
				<div class="flex h-4 w-4 items-center justify-center rounded-full bg-[#9c9c9c]">
					<div class="h-2 w-2 rounded-full bg-[#1f1f1f]"></div>
				</div>
			</div>
		</button>
	</div>
	<div class="flex max-w-[70%] min-h-10 p-1 cursor-pointer flex-row gap-4 overflow-x-hidden">
		{#if runningApps.length > 0}
			{#each runningApps as app}
				<div class="flex cursor-pointer h-fit flex-row gap-1">
					<button
						class="icon h-10 w-10 flex items-center justify-center cursor-pointer rounded-full p-1 text-white"
						style="background-color: {app.color}"
						on:click={() => {
							const isMinimized = $pm.find((p) => p.pid === app.pid).metadata.isMinimized;
							if (isMinimized) {
								pm.updateMetadata(app.pid, { isMinimized: false });
							}
						}}
						><Icon icon={app.icon} font-size="1.5rem" style="color: {app.iconColor};" class="icon" /></button
					>
				</div>
			{/each}
		{:else}
			<!-- Empty placeholder to maintain height when no apps are running -->
			<div class="h-10"></div>
		{/if}
	</div>
	<div class="flex gap-1 text-[0.8rem] font-[500] pr-1">
		<span class="cursor-pointer rounded-l-full bg-[#f1f1f1] px-4 py-2"><Date /></span>
		<span class="cursor-pointer rounded-r-full bg-[#f1f1f1] px-4 py-2"><Time /></span>
	</div>
</div>

<style>
	.icon {
		box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.5);
	}
</style>