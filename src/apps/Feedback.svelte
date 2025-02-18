<script>
	import Button from '../ui-library/Button.svelte';
	import TextField from '../ui-library/TextField.svelte';

	let text = '';
</script>

<div class="flex h-full w-full flex-col gap-4 p-2">
	<div class="flex flex-grow flex-col gap-1">
		<!-- <textarea
			class="h-full w-full rounded-md border border-gray-300 p-2"
			placeholder="Enter your feedback here"
		></textarea> -->
		<TextField text placeholder="Enter your feedback here" title="Feedback"/>
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
