<script>
	export let left = 0,
		top = 0,
        show = false,
		close = () => {};
</script>

{#if show}
	<div
		class="context-menu absolute z-50 flex w-32 flex-col justify-start gap-1 rounded-md px-6 py-2 text-black"
		style="left: {left}px; top: {top}px"
	>
		<span>Help</span>
		<span>Settings</span>
		<span>About</span>
		<span>Logout</span>
		<span on:click={() => close()} class="text-red-500">Close</span>
	</div>
{/if}


<style>
    .context-menu {
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        background-color: #ffffffcc;
    }
    .context-menu span {
        cursor: pointer;
    }
</style>
