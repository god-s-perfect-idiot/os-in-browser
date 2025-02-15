<script>
	import Icon from '@iconify/svelte';
	import Time from './Time.svelte';
	import { pm } from '$lib/pm';
	import { apps } from '$lib/applib';

    let showAppList = false;

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
    {#if showAppList}
        <div class="absolute flex flex-col gap-1 h-[30rem] w-[20rem] bottom-10 z-10 left-0 rounded-tr-md" style="background-color: #ffffffcc;">
            {#each apps as app}
                <div class=" flex cursor-pointer flex-row gap-1">
                    <button class="cursor-pointer text-white h-full p-1 rounded-sm" style="background-color: {app.color}"
                        ><Icon icon={app.icon} font-size="1rem" /></button
                    >
                    <span>{app.name}</span>
                </div>
            {/each}
        </div>
    {/if}
	<div class="flex cursor-pointer flex-row gap-4">
        <button class="cursor-pointer" on:click={() => showAppList = !showAppList}><Icon icon="iconamoon:apps" font-size="1.5rem" /></button>
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
