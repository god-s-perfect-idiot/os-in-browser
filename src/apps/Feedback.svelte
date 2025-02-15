<script>
	import Button from '../ui-library/Button.svelte';
</script>

<div class="flex h-full w-full flex-col gap-4">
	<div class="flex flex-grow flex-col gap-1">
		<textarea
			class="h-full w-full rounded-md border border-gray-300 p-2"
			placeholder="Enter your feedback here"
		></textarea>
	</div>
	<div class="flex flex-col gap-1">
		<Button
			text="Submit"
			onClick={() => {}}
		/>
	</div>
</div>


<style>
    textarea {
        resize: none;
    }
</style>
