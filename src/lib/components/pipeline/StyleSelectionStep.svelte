<script lang="ts">
	import { STORY_STYLES } from '@childrenbook/shared/types/pipeline';
	import { selectStyle, getPipelineState } from '$lib/stores/pipeline.svelte';

	let pipelineState = $derived(getPipelineState());

	function handleSelect(styleId: string) {
		if (pipelineState.selectedStyleId !== null) return;
		selectStyle(styleId);
	}
</script>

<div class="style-step">
	<h2 class="step-title">Choose Your Style</h2>
	<p class="step-subtitle">Pick the illustration style for your book</p>
	<div class="style-grid">
		{#each STORY_STYLES as style, i}
			<button
				class="style-card"
				class:selected={pipelineState.selectedStyleId === style.id}
				class:disabled={pipelineState.selectedStyleId !== null && pipelineState.selectedStyleId !== style.id}
				style="animation-delay: {i * 60}ms"
				onclick={() => handleSelect(style.id)}
				disabled={pipelineState.selectedStyleId !== null}
			>
				<h3 class="style-name">{style.name}</h3>
				<p class="style-desc">{style.description}</p>
			</button>
		{/each}
	</div>
</div>

<style>
	.style-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		width: 100%;
	}

	.step-title {
		font-family: var(--font-heading);
		font-size: var(--text-2xl);
		color: var(--color-plum);
		text-align: center;
	}

	.step-subtitle {
		font-size: var(--text-base);
		color: var(--color-plum-muted);
		margin-top: calc(-1 * var(--space-sm));
	}

	.style-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
		width: 100%;
		max-width: 640px;
	}

	.style-card {
		background: var(--color-white);
		border-radius: var(--radius-xl);
		padding: var(--space-md) var(--space-lg);
		box-shadow: var(--shadow-sm);
		text-align: left;
		cursor: pointer;
		border: 2px solid transparent;
		transition:
			transform var(--duration-base) var(--ease-out-back),
			box-shadow var(--duration-base) var(--ease-out-expo),
			border-color var(--duration-base) var(--ease-out-expo);
		animation: fadeUp 0.5s var(--ease-out-expo) both;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.style-card:hover:not(:disabled) {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.style-card.selected {
		border-color: var(--color-lavender);
		box-shadow: var(--shadow-glow-lavender, var(--shadow-lg));
	}

	.style-card.disabled:not(.selected) {
		opacity: 0.5;
		cursor: default;
	}

	.style-name {
		font-family: var(--font-heading);
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-plum);
	}

	.style-desc {
		font-size: var(--text-sm);
		color: var(--color-plum-muted);
		line-height: 1.5;
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 640px) {
		.style-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.style-card { animation: none; opacity: 1; }
		.style-card:hover:not(:disabled) { transform: none; }
	}
</style>
