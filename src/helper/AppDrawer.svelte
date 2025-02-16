<script>
	import { apps } from '$lib/applib';
	import App from './App.svelte';
</script>

<div class="h-full w-fit p-12">
	<div class="flex h-full flex-col flex-wrap gap-8">
		{#each Object.values(apps).filter((app) => !app.needsParent) as app}
			<App appId={app.appId} />
		{/each}
	</div>
</div>
