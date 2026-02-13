<script lang="ts">
	import { onMount } from 'svelte';
	import { STORY_STYLES } from '@childrenbook/shared/types/pipeline';

	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

	let previews = $state<Record<string, { saved: boolean; loading: boolean; error: string | null }>>({});
	let generatingAll = $state(false);

	function previewUrl(styleId: string) {
		return `${API_URL}/api/admin/style-previews/${styleId}`;
	}

	function getPreview(styleId: string) {
		return previews[styleId] ?? { saved: false, loading: false, error: null };
	}

	onMount(async () => {
		try {
			const res = await fetch(`${API_URL}/api/admin/style-previews`);
			if (res.ok) {
				const data = await res.json();
				for (const id of data.styleIds) {
					previews[id] = { saved: true, loading: false, error: null };
				}
			}
		} catch {
			// server might not be running
		}
	});

	async function generateOne(styleId: string) {
		previews[styleId] = { saved: false, loading: true, error: null };

		try {
			const res = await fetch(`${API_URL}/api/admin/generate-style-preview`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ styleId }),
			});

			if (!res.ok) {
				throw new Error(`${res.status} ${await res.text()}`);
			}

			previews[styleId] = { saved: true, loading: false, error: null };
		} catch (err) {
			previews[styleId] = {
				saved: false,
				loading: false,
				error: err instanceof Error ? err.message : 'Failed',
			};
		}
	}

	async function generateAll() {
		generatingAll = true;

		for (const style of STORY_STYLES) {
			previews[style.id] = { saved: false, loading: true, error: null };
		}

		try {
			const res = await fetch(`${API_URL}/api/admin/generate-all-previews`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!res.ok) {
				throw new Error(`${res.status} ${await res.text()}`);
			}

			const data = await res.json();
			for (const result of data.results) {
				previews[result.styleId] = {
					saved: result.saved,
					loading: false,
					error: result.error ?? null,
				};
			}
		} catch (err) {
			for (const style of STORY_STYLES) {
				if (previews[style.id]?.loading) {
					previews[style.id] = {
						saved: false,
						loading: false,
						error: err instanceof Error ? err.message : 'Failed',
					};
				}
			}
		}

		generatingAll = false;
	}
</script>

<div class="admin-page">
	<header class="admin-header">
		<h1>Style Preview Generator</h1>
		<p>Generate reference images for each illustration style. Images are saved to the database.</p>
		<button class="btn-generate-all" onclick={generateAll} disabled={generatingAll}>
			{generatingAll ? 'Generating all...' : 'Generate All Previews'}
		</button>
	</header>

	<div class="style-grid">
		{#each STORY_STYLES as style}
			{@const preview = getPreview(style.id)}
			<div class="style-card">
				<div class="style-preview">
					{#if preview.loading}
						<div class="preview-loading">
							<div class="spinner"></div>
							<span>Generating...</span>
						</div>
					{:else if preview.saved}
						<img src={previewUrl(style.id)} alt="{style.name} preview" />
					{:else}
						<div class="preview-empty">No preview</div>
					{/if}
				</div>

				<div class="style-info">
					<h3>{style.name}</h3>
					<p class="style-desc">{style.description}</p>
					<p class="style-prompt">{style.imageStylePrompt}</p>

					{#if preview.error}
						<p class="style-error">{preview.error}</p>
					{/if}

					<div class="style-actions">
						<button
							class="btn-generate"
							onclick={() => generateOne(style.id)}
							disabled={preview.loading || generatingAll}
						>
							{preview.loading ? 'Generating...' : preview.saved ? 'Regenerate' : 'Generate'}
						</button>
						{#if preview.saved}
							<span class="saved-badge">Saved</span>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.admin-page {
		min-height: 100vh;
		background: var(--color-cream, #faf5ef);
		padding: 2rem;
	}

	.admin-header {
		max-width: 1000px;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.admin-header h1 {
		font-family: var(--font-heading, 'Quicksand', sans-serif);
		font-size: 2rem;
		color: var(--color-plum, #3d3250);
		margin-bottom: 0.5rem;
	}

	.admin-header p {
		color: var(--color-plum-muted, #6b5f7d);
		margin-bottom: 1.5rem;
	}

	.btn-generate-all {
		font-family: var(--font-heading, 'Quicksand', sans-serif);
		font-weight: 700;
		font-size: 1rem;
		padding: 0.75rem 2rem;
		border-radius: 999px;
		border: none;
		background: linear-gradient(135deg, var(--color-peach, #f4a886), var(--color-peach-dark, #e8845f));
		color: white;
		cursor: pointer;
		transition: opacity 0.2s, transform 0.2s;
	}

	.btn-generate-all:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	.btn-generate-all:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.style-grid {
		max-width: 1000px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.style-card {
		background: white;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		display: grid;
		grid-template-columns: 320px 1fr;
		min-height: 240px;
	}

	.style-preview {
		background: #f0ebe4;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.style-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		color: var(--color-plum-muted, #6b5f7d);
		font-size: 0.875rem;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #e0d8ce;
		border-top-color: var(--color-peach, #f4a886);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.preview-empty {
		color: #b8afa4;
		font-size: 0.875rem;
	}

	.style-info {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.style-info h3 {
		font-family: var(--font-heading, 'Quicksand', sans-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-plum, #3d3250);
	}

	.style-desc {
		color: var(--color-plum, #3d3250);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.style-prompt {
		font-size: 0.75rem;
		color: var(--color-plum-muted, #6b5f7d);
		line-height: 1.5;
		padding: 0.5rem 0.75rem;
		background: var(--color-linen, #f5ede3);
		border-radius: 0.5rem;
		font-family: monospace;
		flex: 1;
	}

	.style-error {
		color: #c44;
		font-size: 0.8125rem;
	}

	.style-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.btn-generate {
		font-family: var(--font-heading, 'Quicksand', sans-serif);
		font-weight: 700;
		font-size: 0.875rem;
		padding: 0.5rem 1.25rem;
		border-radius: 999px;
		border: 2px solid var(--color-lavender, #b8a9d4);
		background: transparent;
		color: var(--color-lavender-dark, #7c6a9e);
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}

	.btn-generate:hover:not(:disabled) {
		background: var(--color-lavender, #b8a9d4);
		color: white;
	}

	.btn-generate:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.saved-badge {
		font-family: var(--font-heading, 'Quicksand', sans-serif);
		font-size: 0.75rem;
		font-weight: 700;
		color: #5a9a6a;
		background: #e8f5ec;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.style-card {
			grid-template-columns: 1fr;
		}

		.style-preview {
			height: 200px;
		}
	}
</style>
