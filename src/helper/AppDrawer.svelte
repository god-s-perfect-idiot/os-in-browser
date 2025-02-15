<script>
	import { apps } from '$lib/applib';
	import App from './App.svelte';

	let icons = [
		'files',
		'folder',
		'settings',
		'help',
		'feedback',
		'console',
		'calculator',
		'sketch',
		'clock'
		// {
		// 	src: 'material-symbols:files',
		// 	color: '#f1bf00',
		// 	iconColor: '#ffffff',
		// 	name: 'My Files',
		// 	appId: 'files'
		// },
		// {
		// 	src: 'f7:folder-fill',
		// 	color: '#3abf00',
		// 	iconColor: '#ffffff',
		// 	name: 'Folder',
		// 	appId: 'folder'
		// },
		// {
		// 	src: 'mingcute:file-fill',
		// 	color: '#cf3f00',
		// 	iconColor: '#ffffff',
		// 	name: 'File',
		// 	appId: 'file'
		// },
		// {
		// 	src: 'iconoir:ios-settings',
		// 	color: '#1f3abf',
		// 	iconColor: '#ffffff',
		// 	name: 'Settings',
		// 	appId: 'settings'
		// },
		// {
		// 	src: 'material-symbols:help',
		// 	color: '#f1bf00',
		// 	iconColor: '#ffffff',
		// 	name: 'Help',
		// 	appId: 'help'
		// },
		// {
		// 	src: 'material-symbols:feedback',
		// 	color: '#cf3f00',
		// 	iconColor: '#ffffff',
		// 	name: 'Feedback',
		// 	appId: 'feedback'
		// },
		// {
		// 	src: 'material-symbols:terminal',
		// 	name: 'Console',
		// 	appId: 'console',
		// 	iconColor: '#00ff00',
		// 	color: '#000000'
		// }
	];
</script>

<div class="h-full w-fit p-12">
	<div class="flex h-full flex-col flex-wrap gap-8">
		{#each Object.values(apps).filter((app) => !app.needsParent) as app}
			<App appId={app.appId} />
		{/each}
	</div>
</div>
