<script>
	import { apps } from '$lib/applib';
	import { settings } from '$lib/settings';
	import App from './App.svelte';

	const allDrawerApps = Object.values(apps).filter((app) => !app.needsParent);
	$: visibleIds = $settings.visibleAppIds;
	$: appsToShow =
		visibleIds == null || visibleIds.length === 0
			? allDrawerApps
			: allDrawerApps.filter((app) => visibleIds.includes(app.appId));
</script>

<div class="h-full w-fit pt-8 pl-8">
	<div class="flex h-full flex-col flex-wrap gap-8">
		{#each appsToShow as app}
			<App appId={app.appId} />
		{/each}
	</div>
</div>
