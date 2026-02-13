<script lang="ts">
	import type { PipelineStatus } from '@childrenbook/shared/types/pipeline';

	interface Props {
		status: PipelineStatus;
	}

	let { status }: Props = $props();

	const steps = [
		{ key: 'upload', label: 'Upload' },
		{ key: 'characterize', label: 'Characters' },
		{ key: 'choose', label: 'Story' },
		{ key: 'style', label: 'Style' },
		{ key: 'generate', label: 'Generate' },
		{ key: 'illustrate', label: 'Illustrate' },
		{ key: 'done', label: 'Done' },
	] as const;

	const statusToStep: Record<PipelineStatus, number> = {
		idle: 0,
		uploading: 0,
		characterizing: 1,
		'waiting-for-names': 1,
		suggesting: 2,
		'waiting-for-selection': 2,
		'waiting-for-style': 3,
		'generating-story': 4,
		'generating-images': 5,
		complete: 6,
		error: -1,
	};

	let currentStep = $derived(statusToStep[status] ?? 0);
</script>

<nav class="step-indicator" aria-label="Pipeline progress">
	<ol class="steps">
		{#each steps as step, i}
			<li
				class="step"
				class:completed={i < currentStep}
				class:active={i === currentStep && status !== 'error'}
				class:future={i > currentStep}
				aria-current={i === currentStep ? 'step' : undefined}
			>
				<div class="step-dot">
					{#if i < currentStep}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="20 6 9 17 4 12" />
						</svg>
					{:else}
						<span class="step-number">{i + 1}</span>
					{/if}
				</div>
				<span class="step-label">{step.label}</span>
			</li>
			{#if i < steps.length - 1}
				<div class="step-connector" class:filled={i < currentStep}></div>
			{/if}
		{/each}
	</ol>
</nav>

<style>
	.step-indicator {
		width: 100%;
		max-width: 700px;
		margin: 0 auto;
		padding: var(--space-md) 0;
	}

	.steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		flex-shrink: 0;
	}

	.step-dot {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: var(--text-sm);
		transition:
			background-color var(--duration-base) var(--ease-out-expo),
			color var(--duration-base) var(--ease-out-expo),
			box-shadow var(--duration-base) var(--ease-out-expo),
			transform var(--duration-base) var(--ease-out-back);
		background: var(--color-cream);
		color: var(--color-plum-muted);
		border: 2px solid transparent;
	}

	.step.active .step-dot {
		background: linear-gradient(135deg, var(--color-peach), var(--color-peach-dark));
		color: var(--color-white);
		box-shadow: var(--shadow-glow-peach);
		transform: scale(1.1);
	}

	.step.completed .step-dot {
		background: var(--color-lavender);
		color: var(--color-white);
	}

	.step.future .step-dot {
		background: var(--color-cream);
		color: rgba(61, 50, 80, 0.3);
		border-color: rgba(61, 50, 80, 0.1);
	}

	.step-number {
		font-size: var(--text-xs);
	}

	.step-label {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-plum-muted);
		white-space: nowrap;
		transition: color var(--duration-base);
	}

	.step.active .step-label {
		color: var(--color-peach-dark);
		font-weight: 700;
	}

	.step.completed .step-label {
		color: var(--color-lavender-dark);
	}

	.step.future .step-label {
		color: rgba(61, 50, 80, 0.3);
	}

	.step-connector {
		flex: 1;
		height: 2px;
		min-width: 20px;
		max-width: 60px;
		background: rgba(61, 50, 80, 0.1);
		margin: 0 var(--space-xs);
		margin-bottom: calc(var(--text-xs) + var(--space-xs));
		border-radius: 1px;
		transition: background var(--duration-base);
	}

	.step-connector.filled {
		background: var(--color-lavender);
	}

	@media (max-width: 640px) {
		.step-label {
			display: none;
		}

		.step-dot {
			width: 30px;
			height: 30px;
		}

		.step-connector {
			margin-bottom: 0;
			min-width: 12px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.step-dot {
			transition: none;
		}

		.step.active .step-dot {
			transform: none;
		}
	}
</style>
