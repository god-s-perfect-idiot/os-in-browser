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
		appId: p.metadata.appId
	}));
</script>

<div
	class="absolute bottom-0 left-0 flex w-full items-center justify-between rounded-t-4xl pl-2 pr-2 py-2"
	style="background-color: #ffffffe9;"
>
	<div class="flex cursor-pointer flex-row gap-4">
		<button class="cursor-pointer">
			<!-- <Icon icon="iconamoon:search" font-size="1.5rem" /> -->
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#cacaca]">
				<div class="h-4 w-4 rounded-full bg-[#9c9c9c] justify-center items-center flex">
					<div class="h-2 w-2 rounded-full bg-[#1f1f1f]"></div>
				</div>
			</div>
		</button>
	</div>
	<div class="flex max-w-[70%] cursor-pointer flex-row gap-1 overflow-x-hidden">
		{#each runningApps as app}
			<div class="flex cursor-pointer flex-row gap-1">
				<button
					class="h-full cursor-pointer rounded-sm p-1 text-white"
					style="background-color: {app.color}"><Icon icon={app.icon} font-size="1rem" /></button
				>
			</div>
		{/each}
	</div>
	<div class="flex gap-1 text-[0.8rem] font-[500]">
		<span class="cursor-pointer rounded-l-full bg-[#f1f1f1] px-4 py-2" ><Date /></span>
		<span class="cursor-pointer rounded-r-full bg-[#f1f1f1] px-4 py-2"><Time /></span>
	</div>
</div>
