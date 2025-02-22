<script>

	import Icon from "@iconify/svelte";
	import Loader from "./Loader.svelte";

</script>
<div class="absolute h-screen w-screen bg-surface z-100">
    <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col text-center w-full">
        <span class="text-2xl mb-6">Project Pineapple</span>
        <Loader />
    </span>

</div>