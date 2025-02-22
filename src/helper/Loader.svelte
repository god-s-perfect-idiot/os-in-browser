<div class="flex items-center justify-center">
    <div class="progress2 progress-moved w-[30rem] rounded-full">
        <div class="progress-bar2"></div>
    </div>
</div>

<style>
	@keyframes progressAnimationStrike {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	.progress2 {
		background: #cfcfcf;
	}

	.progress-bar2 {
		height: 0.6rem;
		border-radius: 30px;
		background-color: var(--secondary-color);
		transition: 0.4s ease-in-out;
		transition-property: width, background-color;
	}

	.progress-moved .progress-bar2 {
		width: 100%;
		background-color: var(--accent-color);
		animation: progressAnimation 3s;
	}

	@keyframes progressAnimation {
		0% {
			width: 5%;
			background-color: var(--accent-color);
		}
		100% {
			width: 100%;
			background-color: var(--accent-color);
		}
	}
</style>
