<script>
	export let text;
    export let placeholder='Enter text';
    export let title='Title';
</script>

<div class="w-full h-full textbox">
    <span class="title">{title}</span>
	<textarea bind:value={text} class="w-full rounded-md p-2 h-full" placeholder="{placeholder}"></textarea>
</div>

<style>
    .title {
        color: var(--accent-color);
    }
    .textbox textarea {
        /* border-color: var(--accent-color); */
        border: 2px solid #cfcfcf;
        resize: none;
    }
    .textbox textarea:focus {
        border-color: var(--accent-color);
        outline: none;
    }
</style>
