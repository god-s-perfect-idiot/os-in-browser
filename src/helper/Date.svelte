<script>
	import { onMount } from 'svelte';

	export let format = 'short'; // 'short' | 'long'

	let date = new Date();

	$: formatted = date
		? format === 'long'
			? date.toLocaleDateString(undefined, {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			: date.toDateString()
		: '';

	onMount(() => {
		const id = setInterval(() => {
			date = new Date();
		}, 1000);
		return () => clearInterval(id);
	});
</script>

{#if date}
	<span>{formatted}</span>
{/if}