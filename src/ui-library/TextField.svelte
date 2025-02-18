<script>
	export let text;
	export let placeholder = 'Enter text';
	export let title = 'Title';

	let focussed = false;
</script>

<div class={`textbox h-full w-full ${focussed ? 'focused' : ''}`}>
	<span class="title relative top-[-0.75rem] left-4 bg-white px-2">{title}</span>
	<textarea
		bind:value={text}
		class="h-full w-full rounded-md p-2"
		{placeholder}
		on:focus={() => (focussed = true)}
        on:blur={() => (focussed = false)}
	></textarea>
</div>

<style>
	.title {
		color: #9c9c9c;
	}
	.textbox {
		/* border-color: var(--accent-color); */
        border-radius: 0.3rem;
		border: 2px solid #9c9c9c;
		resize: none;
	}
    .textbox textarea {
        border: none;
        outline: none;
    }
    .focused {
        border-color: var(--accent-color) !important;
    }
    .focused span {
        color: var(--accent-color) !important;
    }
</style>
