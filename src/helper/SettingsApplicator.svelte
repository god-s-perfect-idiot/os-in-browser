<script>
	import { settings } from '$lib/settings';
	import { onMount } from 'svelte';

	$: s = $settings;

	onMount(() => {
		apply(s);
	});

	$: apply(s);

	function apply(s) {
		if (typeof document === 'undefined') return;
		const el = document.documentElement;
		el.dataset.theme = s.theme || 'light';
		el.dataset.fontSize = s.fontSize || 'medium';
		el.dataset.cursor = s.cursorStyle || 'pixel';
		el.dataset.highContrast = s.highContrast ? 'true' : 'false';
		el.dataset.largeClickTargets = s.largeClickTargets ? 'true' : 'false';
	}
</script>
