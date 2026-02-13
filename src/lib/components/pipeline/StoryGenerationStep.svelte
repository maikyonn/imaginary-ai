<script lang="ts">
	import type { StoryPage, PipelineStatus } from '@childrenbook/shared/types/pipeline';

	interface Props {
		pages: StoryPage[];
		status: PipelineStatus;
	}

	let { pages, status }: Props = $props();

	let isLoading = $derived(status === 'generating-story' && pages.length === 0);
</script>

<div class="generation-step">
	{#if isLoading}
		<div class="loading-state">
			<div class="quill-animation">
				<div class="quill-line"></div>
				<div class="quill-line short"></div>
				<div class="quill-line"></div>
			</div>
			<p class="loading-text">Writing your story...</p>
			<p class="loading-sub">Every great adventure starts with a single page</p>
		</div>
	{:else}
		<h2 class="step-title">Your Story</h2>
		<div class="pages-list">
			{#each pages as page}
				<div class="page-card">
					<span class="page-number">Page {page.pageNumber}</span>
					<p class="page-text">{page.text}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.generation-step {
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

	.quill-animation {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 60px;
		padding: var(--space-sm);
	}

	.quill-line {
		height: 3px;
		border-radius: 2px;
		background: var(--color-peach);
		animation: writeLine 1.5s ease-in-out infinite;
	}

	.quill-line.short {
		width: 60%;
		animation-delay: 0.3s;
	}

	.quill-line:nth-child(3) {
		animation-delay: 0.6s;
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

	.pages-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		width: 100%;
		max-width: 560px;
	}

	.page-card {
		background: var(--color-white);
		border-radius: var(--radius-xl);
		padding: var(--space-lg);
		box-shadow: var(--shadow-md);
		animation: fadeUp 0.5s var(--ease-out-expo) both;
	}

	.page-number {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-lavender-dark);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.page-text {
		font-family: var(--font-body);
		font-size: var(--text-lg);
		color: var(--color-plum);
		line-height: 1.8;
		margin-top: var(--space-sm);
	}

	@keyframes writeLine {
		0%, 100% { transform: scaleX(0.3); opacity: 0.3; transform-origin: left; }
		50% { transform: scaleX(1); opacity: 1; }
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.quill-line { animation: none; opacity: 1; transform: none; }
		.loading-state, .page-card { animation: none; opacity: 1; }
	}
</style>
