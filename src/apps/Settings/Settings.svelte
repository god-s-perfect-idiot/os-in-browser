<script>
	export let activeTab = 'Customization';
	let generalTabs = ['Customization', 'Developer Options', 'About', 'Help'];
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

<div class="flex h-full w-full flex-row">
	<div
		class="left-panel flex h-full w-[30%] flex-col gap-2 overflow-y-auto border-r-2 border-gray-300 pt-2"
	>
		<span>General</span>
		{#each generalTabs as tab}
			<button
				on:click={() => (activeTab = tab)}
				class={`${activeTab === tab ? 'bg-blue-500 text-white' : ''}`}>{tab}</button
			>
		{/each}
		<span class="mt-4">Apps</span>
		{#each appsTabs as tab}
			<button
				on:click={() => (activeTab = tab)}
				class={`${activeTab === tab ? 'bg-blue-500 text-white' : ''}`}>{tab}</button
			>
		{/each}
	</div>
	<div class="h-full w-[70%]"></div>
</div>

<style>
	.left-panel > span {
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
        padding-left: 0.5rem;
	}
	.left-panel > button {
		cursor: pointer;
		text-align: left;
        padding-left: 1rem;
	}
</style>
