<script>
	import Icon from '@iconify/svelte';
	import Time from './Time.svelte';
	import { pm } from '$lib/pm';

	$: runningApps = $pm.map((p) => ({
		pid: p.pid,
		title: p.title,
		icon: p.metadata.icon,
		color: p.metadata.color,
        appId: p.metadata.appId
	}));

</script>

<div
	class="absolute bottom-0 flex w-full items-center justify-between p-2"
	style="background-color: #ffffffcc;"
>
	<div class="flex cursor-pointer flex-row gap-1">
		<button class="cursor-pointer"><Icon icon="iconamoon:search" font-size="1.5rem" /></button>
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
	<div class="flex pr-1">
		<span><Time time={Date.now()} /></span>
	</div>
</div>
