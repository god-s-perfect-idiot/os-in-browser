<script>
	import { fileSystem } from '$lib/fs';
	import Icon from '@iconify/svelte';

	$: console.log(fileSystem.ls());
	let subMenuClicked = true;
    let deletePopup = false;
    let newFilePopup = true;
</script>

<div class={`flex h-full w-full p-3 ${deletePopup ? 'out-of-focus' : ''}`}>

    {#if deletePopup}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-gray-300 bg-white p-4">
          <div class="flex items-center gap-8 flex-col">
            <div class="flex flex-col gap-1">
              <span class="text-base font-[400]">Are you sure you want to delete this file?</span>
          </div>
          <div class="flex justify-end gap-2 text-[0.8rem] w-full">
              <button class="flex justify-center items-center text-gray-700 rounded-md border-[1px] border-[var(--accent-color)] px-4 py-1 cursor-pointer"
                  on:click={() => deletePopup = false}
              >Cancel</button>
              <button class="flex justify-center items-center bg-[var(--accent-color)] text-white rounded-md px-4 py-1 cursor-pointer"
                  on:click={() => deletePopup = false}
              >Delete</button>
          </div>
          </div>
        </div>
    {/if}

    {#if newFilePopup}
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-gray-300 bg-white p-4">
          <div class="flex items-center gap-8 flex-col">
            <div class="flex justify-start w-full gap-1">
              <span class="text-base font-[400]">Create new file</span>
            </div>
            <div class="flex flex-col gap-2 w-full items-start">
              <!-- <span class="text-sm font-[300]">File name</span>
              <input type="text" class="w-full rounded-md border-[1px] border-gray-300 px-2 py-1" /> -->
              
            </div>
            <div class="flex justify-end gap-2 text-[0.8rem] w-full">
                <button class="flex justify-center items-center text-gray-700 rounded-md border-[1px] border-[var(--accent-color)] px-4 py-1 cursor-pointer"
                    on:click={() => newFilePopup = false}
                >Cancel</button>
                <button class="flex justify-center items-center bg-[var(--accent-color)] text-white rounded-md px-4 py-1 cursor-pointer"
                    on:click={() => newFilePopup = false}
                >Delete</button>
            </div>
          </div>
        </div>
    {/if}

	<div class="flex h-full w-[25%]"></div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="flex h-full w-[75%] justify-center rounded-2xl bg-white">
		<div
			class="mx-2 flex h-fit w-full items-center justify-between border-b-[1px] border-b-gray-300 py-2 pl-2"
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
							<button class="flex items-center gap-2" on:click={() => newFilePopup = true}>
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
