<script lang="ts">
	import type { CharacterProfile, PipelineStatus } from '@childrenbook/shared/types/pipeline';
	import { confirmNames } from '$lib/stores/pipeline.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		characters: CharacterProfile[];
		status: PipelineStatus;
	}

	let { characters, status }: Props = $props();

	let isLoading = $derived(status === 'characterizing' && characters.length === 0);
	let isWaitingForNames = $derived(status === 'waiting-for-names');
	let editedNames = $state<string[]>([]);
	let isSubmitting = $state(false);

	$effect(() => {
		if (characters.length > 0 && editedNames.length === 0) {
			editedNames = characters.map((c) => c.name);
		}
	});

	async function handleConfirmNames() {
		isSubmitting = true;
		await confirmNames(editedNames);
		isSubmitting = false;
	}
</script>

<div class="characterize-step">
	{#if isLoading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p class="loading-text">Analyzing your photos...</p>
			<p class="loading-sub">Discovering the characters in your story</p>
		</div>
	{:else}
		<h2 class="step-title">Your Characters</h2>
		{#if isWaitingForNames}
			<p class="step-subtitle">Give each character a name for your story</p>
		{/if}
		<div class="character-grid">
			{#each characters as character, i}
				<div class="character-card" style="animation-delay: {i * 100}ms">
					<div class="character-avatar">
						<span class="avatar-letter">{(editedNames[i] || character.name).charAt(0)}</span>
					</div>
					<div class="character-info">
						{#if isWaitingForNames}
							<input
								class="name-input"
								type="text"
								bind:value={editedNames[i]}
								placeholder="Enter a name..."
							/>
						{:else}
							<h3 class="character-name">{character.name}</h3>
						{/if}
						<p class="character-age">{character.age}</p>
						<p class="character-desc">{character.physicalDescription}</p>
						<div class="character-traits">
							{#each character.traits as trait}
								<span class="trait-tag">{trait}</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
		{#if isWaitingForNames}
			<div class="confirm-action">
				<Button
					variant="primary"
					size="lg"
					onclick={handleConfirmNames}
					disabled={isSubmitting || editedNames.some((n) => !n.trim())}
				>
					{isSubmitting ? 'Confirming...' : 'Confirm Names'}
				</Button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.characterize-step {
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
		border-top-color: var(--color-peach);
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
		text-align: center;
	}

	.character-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		justify-content: center;
		width: 100%;
		max-width: 600px;
	}

	.character-card {
		background: var(--color-white);
		border-radius: var(--radius-xl);
		padding: var(--space-lg);
		box-shadow: var(--shadow-md);
		display: flex;
		gap: var(--space-md);
		flex: 1 1 260px;
		max-width: 400px;
		animation: fadeUp 0.5s var(--ease-out-expo) both;
		transition: box-shadow var(--duration-base) var(--ease-out-expo);
	}

	.character-card:hover {
		box-shadow: var(--shadow-lg);
	}

	.character-avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-lavender), var(--color-lavender-dark));
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.avatar-letter {
		font-family: var(--font-brand);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-white);
	}

	.character-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.character-name {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-plum);
	}

	.name-input {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-plum);
		background: var(--color-linen);
		border: 2px solid var(--color-lavender);
		border-radius: var(--radius-md);
		padding: 6px 12px;
		width: 100%;
		outline: none;
		transition: border-color var(--duration-base) var(--ease-out-expo);
	}

	.name-input:focus {
		border-color: var(--color-lavender-dark);
	}

	.name-input::placeholder {
		color: var(--color-plum-muted);
		font-weight: 400;
	}

	.confirm-action {
		margin-top: var(--space-md);
	}

	.character-age {
		font-size: var(--text-sm);
		color: var(--color-plum-muted);
	}

	.character-desc {
		font-size: var(--text-sm);
		color: var(--color-plum);
		line-height: 1.5;
	}

	.character-traits {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: var(--space-xs);
	}

	.trait-tag {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 600;
		padding: 2px 10px;
		border-radius: var(--radius-pill);
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
		.character-card {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.character-traits {
			justify-content: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner { animation: none; border-top-color: var(--color-peach); }
		.character-card, .loading-state { animation: none; opacity: 1; }
	}
</style>
