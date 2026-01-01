<script>
	export let text;
	export let placeholder = 'Enter text';
	export let title = 'Title';

	let focussed = false;
</script>

<div class={`textbox flex flex-col h-full w-full ${focussed ? 'focused' : ''}`}>
	<span class="title relative top-[-0.75rem] left-4 bg-white px-2 w-fit">{title}</span>
	<textarea
		bind:value={text}
		class="h-full w-full p-2"
		placeholder="{placeholder}"
		on:focus={() => (focussed = true)}
        on:blur={() => (focussed = false)}
	></textarea>
</div>

<style>
	.title {
		color: #808080;
	}
	.textbox {
		/* border-color: var(--accent-color); */
        border-radius: 0;
		border: 2px solid #808080;
	}
    .textbox textarea {
        border: none;
		resize: none;
        outline: none;
    }
    .focused {
        border-color: var(--accent-color) !important;
    }
    .focused span {
        color: var(--accent-color) !important;
    }
</style>
