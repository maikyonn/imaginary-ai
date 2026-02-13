<script lang="ts">
	import type { StoryPage } from '@childrenbook/shared/types/pipeline';

	interface Props {
		pages: StoryPage[];
		imageProgress: { completed: number; total: number };
	}

	let { pages, imageProgress }: Props = $props();

	let progressPercent = $derived(
		imageProgress.total > 0
			? Math.round((imageProgress.completed / imageProgress.total) * 100)
			: 0
	);
</script>

<div class="image-step">
	<h2 class="step-title">Illustrating Your Story</h2>
	<p class="step-subtitle">
		{imageProgress.completed} of {imageProgress.total || 1} illustration{imageProgress.total !== 1 ? 's' : ''} complete
	</p>

	<div class="progress-bar-container">
		<div class="progress-bar" style="width: {progressPercent}%"></div>
	</div>

	<div class="pages-preview">
		{#each pages as page}
			<div class="page-preview-card">
				<div class="image-area">
					{#if page.imageUrl}
						<img src={page.imageUrl} alt="Illustration for page {page.pageNumber}" class="page-image" />
					{:else}
						<div class="image-placeholder">
							<div class="placeholder-shimmer"></div>
							<div class="placeholder-icon">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21 15 16 10 5 21" />
								</svg>
							</div>
						</div>
					{/if}
				</div>
				<span class="page-label">Page {page.pageNumber}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.image-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		width: 100%;
		animation: fadeUp 0.5s var(--ease-out-expo) both;
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

	.progress-bar-container {
		width: 100%;
		max-width: 400px;
		height: 8px;
		background: var(--color-cream);
		border-radius: var(--radius-pill);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--color-lavender), var(--color-peach));
		border-radius: var(--radius-pill);
		transition: width var(--duration-slow) var(--ease-out-expo);
	}

	.pages-preview {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		justify-content: center;
		width: 100%;
		max-width: 560px;
	}

	.page-preview-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
		flex: 1 1 240px;
		max-width: 360px;
	}

	.image-area {
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-xl);
		overflow: hidden;
		box-shadow: var(--shadow-md);
	}

	.page-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		animation: fadeIn 0.5s var(--ease-out-expo) both;
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		background: var(--color-cream);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.placeholder-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(232, 168, 124, 0.08) 50%,
			transparent 100%
		);
		animation: shimmer 2s ease-in-out infinite;
	}

	.placeholder-icon {
		color: rgba(61, 50, 80, 0.2);
		z-index: 1;
	}

	.page-label {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-plum-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		.image-step { animation: none; opacity: 1; }
		.placeholder-shimmer { animation: none; }
		.page-image { animation: none; }
	}
</style>
