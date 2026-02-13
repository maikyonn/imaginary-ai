<script lang="ts">
	import type { StoryPage } from '@childrenbook/shared/types/pipeline';
	import Button from '$lib/components/ui/Button.svelte';
	import { resetPipeline } from '$lib/stores/pipeline.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		pages: StoryPage[];
	}

	let { pages }: Props = $props();

	function handleStartOver() {
		resetPipeline();
		goto('/');
	}
</script>

<div class="completion-step">
	<div class="celebration">
		<h2 class="done-title">Your book is ready!</h2>
		<p class="done-subtitle">A magical story, just for you</p>
	</div>

	<div class="book-preview">
		{#each pages as page}
			<div class="book-page">
				{#if page.imageUrl}
					<div class="page-illustration">
						<img src={page.imageUrl} alt="Illustration for page {page.pageNumber}" />
					</div>
				{/if}
				<div class="page-content">
					<span class="page-number">Page {page.pageNumber}</span>
					<p class="page-text">{page.text}</p>
				</div>
			</div>
		{/each}
	</div>

	<div class="actions">
		<Button variant="secondary" size="lg" onclick={handleStartOver}>
			Create Another Book
		</Button>
	</div>
</div>

<style>
	.completion-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);
		width: 100%;
		animation: fadeUp 0.6s var(--ease-out-expo) both;
	}

	.celebration {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.done-title {
		font-family: var(--font-brand);
		font-size: var(--text-3xl);
		color: var(--color-plum);
		animation: popIn 0.6s var(--ease-out-back) both;
	}

	.done-subtitle {
		font-size: var(--text-lg);
		color: var(--color-plum-muted);
	}

	.book-preview {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: 100%;
		max-width: 640px;
	}

	.book-page {
		background: var(--color-white);
		border-radius: var(--radius-xl);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
	}

	.page-illustration {
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
	}

	.page-illustration img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.page-content {
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
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
	}

	.actions {
		padding: var(--space-md) 0;
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes popIn {
		from { opacity: 0; transform: scale(0.9); }
		to { opacity: 1; transform: scale(1); }
	}

	@media (max-width: 640px) {
		.page-illustration {
			aspect-ratio: 4 / 3;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.completion-step, .done-title { animation: none; opacity: 1; transform: none; }
	}
</style>
