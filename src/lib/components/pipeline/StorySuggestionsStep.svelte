<script lang="ts">
	import type { StorySuggestion, PipelineStatus } from '@childrenbook/shared/types/pipeline';
	import { selectStory, getPipelineState } from '$lib/stores/pipeline.svelte';

	interface Props {
		suggestions: StorySuggestion[];
		status: PipelineStatus;
	}

	let { suggestions, status }: Props = $props();

	let pipelineState = $derived(getPipelineState());
	let isLoading = $derived(status === 'suggesting' && suggestions.length === 0);

	function handleSelect(index: number) {
		if (pipelineState.selectedStoryIndex !== null) return;
		selectStory(index);
	}
</script>

<div class="suggestions-step">
	{#if isLoading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p class="loading-text">Crafting story ideas...</p>
			<p class="loading-sub">Imagining adventures for your characters</p>
		</div>
	{:else}
		<h2 class="step-title">Choose Your Story</h2>
		<p class="step-subtitle">Pick the adventure that speaks to you</p>
		<div class="suggestions-grid">
			{#each suggestions as suggestion, i}
				<button
					class="suggestion-card"
					class:selected={pipelineState.selectedStoryIndex === suggestion.index}
					class:disabled={pipelineState.selectedStoryIndex !== null && pipelineState.selectedStoryIndex !== suggestion.index}
					style="animation-delay: {i * 80}ms"
					onclick={() => handleSelect(suggestion.index)}
					disabled={pipelineState.selectedStoryIndex !== null}
				>
					<h3 class="suggestion-title">{suggestion.title}</h3>
					<p class="suggestion-synopsis">{suggestion.synopsis}</p>
					<div class="suggestion-meta">
						<span class="meta-tag theme">{suggestion.theme}</span>
						<span class="meta-tag tone">{suggestion.tone}</span>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.suggestions-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		width: 100%;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-xl);
		animation: fadeUp 0.5s var(--ease-out-expo) both;
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 3px solid var(--color-cream);
		border-top-color: var(--color-lavender);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.loading-text {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-plum);
	}

	.loading-sub {
		font-size: var(--text-sm);
		color: var(--color-plum-muted);
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

	.suggestions-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-md);
		width: 100%;
		max-width: 640px;
	}

	.suggestion-card {
		background: var(--color-white);
		border-radius: var(--radius-xl);
		padding: var(--space-lg);
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
		gap: var(--space-sm);
	}

	.suggestion-card:hover:not(:disabled) {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.suggestion-card.selected {
		border-color: var(--color-peach);
		box-shadow: var(--shadow-glow-peach);
	}

	.suggestion-card.disabled:not(.selected) {
		opacity: 0.5;
		cursor: default;
	}

	.suggestion-title {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-plum);
	}

	.suggestion-synopsis {
		font-size: var(--text-sm);
		color: var(--color-plum);
		line-height: 1.6;
		flex: 1;
	}

	.suggestion-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: var(--space-xs);
	}

	.meta-tag {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 600;
		padding: 2px 10px;
		border-radius: var(--radius-pill);
	}

	.meta-tag.theme {
		background: var(--color-linen);
		color: var(--color-peach-dark);
	}

	.meta-tag.tone {
		background: var(--color-linen);
		color: var(--color-lavender-dark);
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (max-width: 640px) {
		.suggestions-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner { animation: none; }
		.suggestion-card, .loading-state { animation: none; opacity: 1; }
		.suggestion-card:hover:not(:disabled) { transform: none; }
	}
</style>
