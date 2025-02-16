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
	class="absolute bottom-2 left-2 flex w-[calc(100%-1rem)] items-center justify-between p-2 rounded-xl border-2 border-white"
	style="background-color: rgba(217, 217, 217, 0.56);"
>
	<div class="flex cursor-pointer flex-row gap-4">
		<button class="cursor-pointer">
            <!-- <Icon icon="iconamoon:search" font-size="1.5rem" /> -->
            <div class="bg-white h-8 w-8 rounded-full" />
        </button>
	</div>
	<div class="flex max-w-[70%] cursor-pointer flex-row gap-1 overflow-x-hidden">
		{#each runningApps as app}
			<div class="flex cursor-pointer flex-row gap-1">
				<button class="cursor-pointer text-white h-full p-1 rounded-sm" style="background-color: {app.color}"
					><Icon icon={app.icon} font-size="1rem" /></button
				>
			</div>
		{/each}
	</div>
	<div class="flex gap-1">
		<span class="bg-[#f1f1f1] p-2 rounded-lg text-sm font-[700] cursor-pointer"><Date /></span>
		<span class="bg-[#f1f1f1] p-2 rounded-lg text-sm font-[700] cursor-pointer"><Time time={Date.now()} /></span>
	</div>
</div>
