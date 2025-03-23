<script>
	import { fileSystem } from '$lib/fs';
	import Icon from '@iconify/svelte';

	$: console.log(fileSystem.ls());
	let subMenuClicked = true;
    let popup = true;
</script>

<div class={`flex h-full w-full p-3 ${popup ? 'out-of-focus' : ''}`}>

    {#if popup}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-gray-300 bg-white p-4">
            <div class="flex flex-col gap-1">
                <span class="text-lg font-bold">Are you sure you want to delete this file?</span>
                <span class="text-sm text-gray-700">This action cannot be undone.</span>
            </div>
            <div class="flex justify-end gap-2">
                <button class="text-gray-700">Cancel</button>
                <button class="bg-red-500 text-white">Delete</button>
            </div>
        </div>
    {/if}

	<div class="flex h-full w-[25%]"></div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="flex h-full w-[75%] justify-center rounded-2xl bg-white">
		<div
			class="mx-2 flex h-fit w-full items-center justify-between border-b-2 border-b-gray-300 py-2 pl-2"
		>
			My Files
			<button
				class="flex h-full cursor-pointer items-center"
				on:click={() => (subMenuClicked = !subMenuClicked)}
			>
				<Icon icon="material-symbols:more-vert" class="text-xl" />
				{#if subMenuClicked}
					<div class="absolute top-20 right-6 rounded-md border-2 border-gray-300 bg-white">
						<div class="options flex flex-col gap-1 text-gray-700">
							<button class="flex items-center gap-2">
								<Icon icon="mdi:file" />
								<span>New File</span>
							</button>
							<button class="flex items-center gap-2">
								<Icon icon="material-symbols:folder" />
								<span>New Folder</span>
							</button>
							<button class="flex items-center gap-2">
								<Icon icon="material-symbols:delete" />
								<span>Delete</span>
							</button>
						</div>
					</div>
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.options button:hover {
		background-color: #f1f1f1;
	}
	.options button {
		padding: 0rem 1rem;
	}
	.options {
		padding: 0.5rem 0rem;
		font-size: 0.9rem;
	}
    .out-of-focus {
    }
</style>
