<script>
	import Icon from "@iconify/svelte";

	export let activeTab = 'Wallpaper and style';
	// let generalTabs = ['Customization', 'Developer Options', 'About', 'Help'];
	const generalTabs = [
		{
			title: 'Wallpaper and style',
			description: 'Dark Theme & Wallpaper',
			icon: 'mdi:palette'
		},
		{
			title: 'Apps',
			description: 'Customize your apps',
			icon: 'mdi:apps'
		},
		{
			title: 'Developer Options',
			description: 'Enable Developer Options',
			icon: 'mdi:spanner'
		},
		{
			title: 'About',
			description: 'About the OS',
			icon: 'mdi:information'
		},
		{
			title: 'Help',
			description: 'Get Help & FAQ',
			icon: 'mdi:help'
		},
	];
	let appsTabs = [
		'Files',
		'Console',
		'Calculator',
		'Clock',
		'Notes',
		'Pomodoro',
		'Todo',
		'Snake',
		'Sketch',
		'Stopwatch',
		'Processes'
	];
</script>

<div class="bg-primary flex h-fit w-full flex-row p-4 gap-4">
	<div class="flex w-[30%] h-full flex-col gap-1">
		{#each generalTabs as tab}
			<button
				class={`flex h-20 min-h-20 gap-4 w-full flex-row items-center justify-start rounded-xl pl-4 ${
					activeTab === tab.title ? 'active' : ''
				}`}
				on:click={() => (activeTab = tab.title)}
			>
				<Icon icon={tab.icon} font-size="1.5rem" />
				<div class="flex flex-col items-start">
					<span class="text-base font-[500]">{tab.title}</span>
					<span class={`text-sm ${activeTab === tab.title ? 'text-gray-300' : 'text-gray-700'}`}>{tab.description}</span>
				
				</div>
				</button>
		{/each}
	</div>
	<div class="w-[70%] bg-surface rounded-2xl"></div>
</div>

<style>
	.active {
		background-color: var(--accent-color);
		color: white;
	}
</style>
