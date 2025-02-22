<script>
	import Icon from '@iconify/svelte';

	export let left = 0,
		top = 0,
		show = false,
		close = () => {};
</script>

{#if show}
	<div
		class="context-menu absolute z-50 flex w-fit flex-col justify-start px-2 py-2 text-black"
		style="left: {left}px; top: {top}px"
	>
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:pen" class="mr-2" />
				Quick Note
			</div>
			<span>Ctrl+N</span>
		</button>
		<div class="w-full border-b border-gray-400" />
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:monitor" class="mr-2" />
				Process Manager
			</div>
			<span>Ctrl+M</span>
		</button>
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:color-lens" class="mr-2" />
				Customization
			</div>
			<span>Ctrl+T</span>
		</button>
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:cog" class="mr-2" />
				Settings
			</div>
			<span>Ctrl+,</span>
		</button>
		<div class="w-full border-b border-gray-400" />
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:restart" class="mr-2" />
				Restart
			</div>
			<span>Alt+Enter</span>
		</button>
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:help" class="mr-2" />
				Help
			</div>
			<span>Ctrl+H</span>
		</button>
		<button>
			<div class="flex items-center justify-start">
				<Icon icon="mdi:information" class="mr-2" />
				About
			</div>
			<span>Ctrl+I</span>
		</button>
		<div class="w-full border-b border-gray-400" />
		<button on:click={() => close()} class="">
			<div class="flex items-center justify-start">
				<Icon icon="mdi:close" class="mr-2" />Close
			</div>
			<span>Esc</span>
		</button>
	</div>
{/if}

<style>
	.context-menu {
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		/* background-color: #ffffffec; */
		background-color: white;
		border-radius: 0.5rem;
	}
	.context-menu button {
		cursor: pointer;
		border: none;
		text-align: left;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-weight: 400;
		font-size: 0.9rem;
		color: #333333;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		gap: 2rem;
	}
	button span {
		font-size: 0.9rem;
		color: #666666;
		font-weight: 500;
	}

	button:hover {
		background-color: var(--accent-color);
		color: white !important;
	}

	button:hover span {
		color: #f1f1f1 !important;
	}
</style>
