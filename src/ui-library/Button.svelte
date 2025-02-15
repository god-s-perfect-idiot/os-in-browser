<script>
	export let text;
	export let classOverride = '';
	export let disabled = false;
	export let onClick = () => {};
</script>

<button
	class={`btn rounded-md cursor-pointer bg-blue-500 px-4 py-2 text-white ${classOverride}`}
	on:click={onClick}
	{disabled}
>
	{text}
</button>

<style>
	.btn:hover {
		background-color: #3b82f6;
	}
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
