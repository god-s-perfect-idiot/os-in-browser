<script>
	import App from './App.svelte';

	let icons = [
        {
            src: 'material-symbols:files',
            color: '#f1bf00',
            name: 'My Files',
            appId: 'files'
        },
        {
            src: 'f7:folder-fill',
            color: '#3abf00',
            name: 'Folder',
            appId: 'folder'
        },
        {
            src: 'mingcute:file-fill',
            color: '#cf3f00',
            name: 'File',
            appId: 'file'
        },
        {
            src: 'iconoir:ios-settings',
            color: '#1f3abf',
            name: 'Settings',
            appId: 'settings'
        },
	];
</script>

<div class="h-full w-fit p-12">
	<div class="flex h-full flex-col flex-wrap gap-8">
		{#each icons as icon}
			<App src={icon.src} color={icon.color} name={icon.name} appId={icon.appId}/>
		{/each}
	</div>
</div>
