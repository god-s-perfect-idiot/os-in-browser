<script>
	export let text;
	export let classOverride = '';
	export let disabled = false;
	export let onClick = () => {};
</script>

<button
	class={`btn rounded-full cursor-pointer px-4 py-2 text-white ${classOverride}`}
	on:click={onClick}
	{disabled}
>
	{text}
</button>

<style>
	.btn {
		background-color: var(--accent-color);
	}
	.btn:hover {
		background-color: var(--primary-color);
		color: black;
	}
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
