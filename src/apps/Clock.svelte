<script>
	import { onMount, onDestroy } from 'svelte';
	let time = new Date();
	let hour = `${((time.getHours() + 11) % 12) + 1 < 10 ? '0' : ''}${((time.getHours() + 11) % 12) + 1}`;
	let minute = `${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}`;
	let second = `${time.getSeconds() < 10 ? '0' : ''}${time.getSeconds()}`;
	let ampm = hour >= 12 ? 'PM' : 'AM';
	let timer;
	let container;
	// let fontSize = 20; // default value

	onMount(() => {
		timer = setInterval(() => {
			time = new Date();
			hour = `${((time.getHours() + 11) % 12) + 1 < 10 ? '0' : ''}${((time.getHours() + 11) % 12) + 1}`;
			minute = `${time.getMinutes() < 10 ? '0' : ''}${time.getMinutes()}`;
			second = `${time.getSeconds() < 10 ? '0' : ''}${time.getSeconds()}`;
			ampm = hour >= 12 ? 'PM' : 'AM';
		}, 1000);

		// const ro = new ResizeObserver((entries) => {
		// 	for (let entry of entries) {
		// 		// Adjust font size to, say, 50% of the container's height
		// 		fontSize = entry.contentRect.height * 0.5;
		// 	}
		// });
		// ro.observe(container);
		// return () => {
		// 	clearInterval(timer);
		// 	ro.disconnect();
		// };
	});

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<!-- Container fills its parent; no bg color so that parent's background shows -->
<div bind:this={container} class="flex h-full w-full items-center justify-center p-2">
	<!-- Clock text: font size is dynamically set; text color uses #222 (formerly the bg color) -->
	<div
		style="font-size: 4rem; color: #222; font-weight: 300"
		class="flex w-full h-full flex-row gap-2"
	>
		<!-- {time.toLocaleTimeString()} -->
		<span class="bg-source flex w-1/4 items-center justify-center rounded-2xl p-4 text-black"
			>{hour}</span
		>
		<span class="bg-secondary flex w-1/4 items-center justify-center rounded-2xl p-4 text-black"
			>{minute}</span
		>
		<span class="bg-primary flex w-1/4 items-center justify-center rounded-2xl p-4 text-black"
			>{second}</span
		>
		<span class="bg-primary flex w-1/4 items-center justify-center rounded-2xl p-4 text-black"
			>{ampm}</span
		>
		<!-- {hour}:{minute}:{second} {ampm} -->
	</div>
</div>
