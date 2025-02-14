<script>
	import '../app.css';
	import TaskBar from '../helper/TaskBar.svelte';
	let { children } = $props();
</script>

{@render children()}

<TaskBar />
