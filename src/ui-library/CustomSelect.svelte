<script>
	/** @type {{ value: string; label: string }[]} */
	export let options = [];
	export let value = '';
	/** @type {(v: string) => void} */
	export let onchange = (_v) => {};

	let open = false;
	let triggerEl;

	$: selectedLabel = options.find((o) => o.value === value)?.label ?? value;

	function select(optValue) {
		onchange(optValue);
		open = false;
	}

	function handleClickOutside(e) {
		if (open && triggerEl && !triggerEl.contains(e.target)) {
			open = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="custom-select" bind:this={triggerEl}>
	<button
		type="button"
		class="trigger"
		class:open
		on:click={() => (open = !open)}
		aria-haspopup="listbox"
		aria-expanded={open}
	>
		<span class="trigger-label">{selectedLabel}</span>
		<span class="trigger-arrow">{open ? '^' : 'v'}</span>
	</button>
	{#if open}
		<ul class="dropdown" role="listbox">
			{#each options as opt}
				<li>
					<button
						type="button"
						class="option"
						class:selected={value === opt.value}
						role="option"
						aria-selected={value === opt.value}
						on:click={() => select(opt.value)}
					>
						{opt.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.custom-select {
		position: relative;
		display: inline-block;
		min-width: 180px;
	}

	.trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 4px 8px;
		border: 2px solid #000;
		background: #fff;
		cursor: pointer;
		text-align: left;
	}

	.trigger:hover {
		background: #f0f0f0;
	}

	.trigger.open {
		background: #fff;
		border-bottom-color: transparent;
	}

	.trigger-label {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.trigger-arrow {
		margin-left: 8px;
		font-size: 10px;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin: 0;
		padding: 0;
		list-style: none;
		border: 2px solid #000;
		border-top: none;
		background: #fff;
		z-index: 100;
		max-height: 200px;
		overflow-y: auto;
		box-shadow: 0 4px 0 0 #000;
	}

	.option {
		display: block;
		width: 100%;
		font-family: 'Courier New', Courier, monospace;
		font-weight: bold;
		font-size: 13px;
		padding: 6px 8px;
		border: none;
		border-bottom: 1px solid #ccc;
		background: #fff;
		cursor: pointer;
		text-align: left;
	}

	.option:last-child {
		border-bottom: none;
	}

	.option:hover {
		background: #e0e0e0;
	}

	.option.selected {
		background: #000;
		color: #fff;
	}
</style>
