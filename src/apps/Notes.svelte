<script>
	import { onMount } from 'svelte';
	let text = '';

	onMount(() => {
		text = localStorage.getItem('notes');
	});

</script>

<div class="h-full w-full p-2">
	<textarea
		bind:value={text}
        on:change={() => localStorage.setItem('notes', text)}
		placeholder="Type here..."
		class="h-full w-full resize-none rounded border border-none p-2 focus:outline-none"
	></textarea>
</div>
