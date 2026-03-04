<script>
	import '../app.css';
	import TaskBar from '../helper/TaskBar.svelte';
	import SettingsApplicator from '../helper/SettingsApplicator.svelte';
	let { children } = $props();
</script>

<SettingsApplicator />
{@render children()}

<TaskBar />
