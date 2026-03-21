<script>
	import Button from '../ui-library/Button.svelte';

	let text = '';
	let isSubmitting = false;
	let submitMessage = '';

	function handleSubmit() {
		if (!text.trim()) {
			submitMessage = 'Please enter some feedback before submitting.';
			return;
		}

		isSubmitting = true;
		submitMessage = '';

		// Capture the feedback text before clearing
		const feedbackText = text.trim();

		// Create GitHub issue URL with the feedback
		const issueTitle = encodeURIComponent('Feedback from OS in Browser');
		const issueBody = encodeURIComponent(`## Feedback\n\n${feedbackText}\n\n---\n*Submitted via OS in Browser Feedback app*`);
		const githubIssueUrl = `https://github.com/god-s-perfect-idiot/os-in-browser/issues/new?title=${issueTitle}&body=${issueBody}`;

		// Open GitHub issue in a new tab
		window.open(githubIssueUrl, '_blank');

		// Clear the form and show success message
		text = '';
		submitMessage = 'GitHub issue page opened! Please submit the issue there.';
		isSubmitting = false;
	}
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
	<div class="flex flex-grow flex-col gap-1">
		<div class="textbox flex flex-col h-full w-full">
			<textarea
				bind:value={text}
				class="h-full w-full rounded-md p-2 border-2 border-gray-300 focus:outline-none resize-none"
				placeholder="Enter your feedback here"
			></textarea>
		</div>
	</div>
	<div class="flex flex-col gap-1 gap-2">
		{#if submitMessage}
			<div class="text-sm p-2 rounded {submitMessage.includes('Please enter') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
				{submitMessage}
			</div>
		{/if}
		<Button
			text={isSubmitting ? "Sending..." : "Submit"}
			onClick={handleSubmit}
			disabled={isSubmitting}
		/>
	</div>
</div>

<style>
	.title {
		color: #9c9c9c;
	}
	.textbox {
		border-radius: 0.3rem;
	}
</style>

