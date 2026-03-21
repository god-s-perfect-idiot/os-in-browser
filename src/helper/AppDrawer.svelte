<script>
	import { apps } from '$lib/applib';
	import { settings } from '$lib/settings';
	import App from './App.svelte';
</script>

<div class="h-full w-fit p-8">
	<div class="flex h-full flex-col flex-wrap gap-8">
		{#each Object.values(apps).filter((app) => !app.needsParent) as app}
			<App appId={app.appId} />
		{/each}
	</div>
</div>

<style>
	/* Ensure smooth animations */
	.translate-y-full {
		transform: translate(-50%, 100%);
	}
	
	.translate-y-0 {
		transform: translate(-50%, 0);
	}

	/* Genie animation */
	.genie-closed {
		transform: translate(-50%, 100%) scale(0.1);
		opacity: 0;
	}
	
	.genie-open {
		transform: translate(-50%, 0) scale(1);
		opacity: 1;
	}
</style>
