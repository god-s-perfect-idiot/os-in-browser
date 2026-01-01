<script>
	import Icon from "@iconify/svelte";
	import { onMount } from 'svelte';
	
	let progress = 0;
	let statusMessage = "Initializing system...";
	let asciiFrame = 0;
	
	const statusMessages = [
		"Initializing system...",
		"Loading modules...",
		"Starting services...",
		"Preparing desktop...",
		"Almost ready..."
	];
	
	const asciiFrames = [
		`    /\\_/\\\n   ( o.o )   \n    > ^ <`,
		`    /\\_/\\\n   ( -.- )   \n    > ^ <`,
		`    /\\_/\\\n   ( o.o )   \n    > ^ <`,
		`    /\\_/\\\n   ( O.O )   \n    > ^ <`
	];
	
	onMount(() => {
		const duration = 3000; // 3 seconds
		const steps = 100;
		const intervalTime = duration / steps; // 30ms per step
		
		// ASCII animation
		const asciiInterval = setInterval(() => {
			asciiFrame = (asciiFrame + 1) % asciiFrames.length;
		}, 200);
		
		const progressInterval = setInterval(() => {
			progress += 1;
			if (progress >= 100) {
				progress = 100;
				clearInterval(progressInterval);
				clearInterval(asciiInterval);
			}
			
			// Update status message based on progress
			const messageIndex = Math.floor((progress / 100) * statusMessages.length);
			if (messageIndex < statusMessages.length) {
				statusMessage = statusMessages[messageIndex];
			}
		}, intervalTime);
		
		return () => {
			clearInterval(progressInterval);
			clearInterval(asciiInterval);
		};
	});
</script>

<div class="boot-screen">
	<div class="boot-content">
		<div class="boot-ascii">
			<pre>{asciiFrames[asciiFrame]}</pre>
		</div>
		<div class="boot-title">OS In Browser</div>
		<div class="boot-progress-container">
			<div class="boot-progress-bar">
				<div class="boot-progress-fill" style="width: {progress}%"></div>
			</div>
			<div class="boot-status">{statusMessage}</div>
		</div>
	</div>
</div>

<style>
	.boot-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-image: 
			radial-gradient(circle, #000 1px, transparent 1px),
			radial-gradient(circle, #000 1px, transparent 1px);
		background-size: 4px 4px;
		background-position: 0 0, 2px 2px;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10000;
	}
	.boot-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
		width: 100%;
		max-width: 500px;
		padding: 0 32px;
	}
	.boot-ascii {
		font-family: 'Courier New', Courier, monospace;
		font-size: 16px;
		line-height: 1.2;
		color: #000;
		text-align: center;
		margin-bottom: 16px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.boot-ascii pre {
		margin: 0 auto;
		padding: 8px 12px;
		background: #fff;
		border: 2px solid #000;
		display: block;
		font-family: 'Courier New', Courier, monospace;
		font-size: 14px;
		white-space: pre;
		text-align: left;
		width: fit-content;
	}
	.boot-title {
		font-family: 'Courier New', Courier, monospace;
		font-size: 32px;
		font-weight: bold;
		color: #000;
		text-align: center;
		padding: 8px 16px;
		background: #fff;
		border: 2px solid #000;
		display: inline-block;
	}
	.boot-progress-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.boot-progress-bar {
		width: 100%;
		height: 24px;
		background: #fff;
		border: 2px solid #000;
		position: relative;
		overflow: hidden;
	}
	.boot-progress-fill {
		height: 100%;
		background: #000;
		transition: width 0.1s linear;
	}
	.boot-status {
		font-family: 'Courier New', Courier, monospace;
		font-size: 14px;
		font-weight: bold;
		color: #000;
		text-align: center;
		padding: 4px 8px;
		background: #fff;
		border: 2px solid #000;
		display: inline-block;
		margin: 0 auto;
	}
</style>