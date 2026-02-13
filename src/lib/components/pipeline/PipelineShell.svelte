<script lang="ts">
	import { onMount } from 'svelte';
	import { getUploadedFiles, clearUploadedFiles } from '$lib/stores/upload-handoff.svelte';
	import {
		getPipelineState,
		getDebugLogs,
		startPipeline,
		resetPipeline,
	} from '$lib/stores/pipeline.svelte';
	import StepIndicator from './StepIndicator.svelte';
	import UploadStep from './UploadStep.svelte';
	import CharacterizeStep from './CharacterizeStep.svelte';
	import StorySuggestionsStep from './StorySuggestionsStep.svelte';
	import StyleSelectionStep from './StyleSelectionStep.svelte';
	import StoryGenerationStep from './StoryGenerationStep.svelte';
	import ImageGenerationStep from './ImageGenerationStep.svelte';
	import CompletionStep from './CompletionStep.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let pipelineState = $derived(getPipelineState());
	let logs = $derived(getDebugLogs());
	let showDebug = $state(true);
	let uploadedFiles = $state<File[]>([]);
	let debugPanel: HTMLElement | undefined = $state();

	onMount(() => {
		const files = getUploadedFiles();
		if (files.length > 0) {
			uploadedFiles = files;
			clearUploadedFiles();
			startPipeline(files);
		}
	});

	$effect(() => {
		if (debugPanel && logs.length) {
			debugPanel.scrollTop = debugPanel.scrollHeight;
		}
	});

	let showUpload = $derived(
		pipelineState.status === 'uploading' || pipelineState.status === 'idle'
	);
	let showCharacterize = $derived(
		pipelineState.status === 'characterizing' || pipelineState.status === 'waiting-for-names'
	);
	let showSuggestions = $derived(
		pipelineState.status === 'suggesting' || pipelineState.status === 'waiting-for-selection'
	);
	let showStyle = $derived(
		pipelineState.status === 'waiting-for-style'
	);
	let showGeneration = $derived(
		pipelineState.status === 'generating-story'
	);
	let showImages = $derived(
		pipelineState.status === 'generating-images'
	);
	let showComplete = $derived(
		pipelineState.status === 'complete'
	);
	let showError = $derived(
		pipelineState.status === 'error'
	);

	function handleRetry() {
		if (uploadedFiles.length > 0) {
			resetPipeline();
			startPipeline(uploadedFiles);
		}
	}
</script>

<div class="pipeline-shell">
	<StepIndicator status={pipelineState.status} />

	<main class="pipeline-content">
		{#if pipelineState.status === 'idle' && uploadedFiles.length === 0}
			<div class="empty-state">
				<h2>No photos uploaded</h2>
				<p>Head back to the home page to upload your photos and start creating.</p>
				<div class="empty-action">
					<Button variant="primary" size="lg" href="/">Upload Photos</Button>
				</div>
			</div>
		{/if}

		{#if showUpload && uploadedFiles.length > 0}
			<UploadStep files={uploadedFiles} />
		{/if}

		{#if showCharacterize}
			<CharacterizeStep characters={pipelineState.characters} status={pipelineState.status} />
		{/if}

		{#if showSuggestions}
			<StorySuggestionsStep suggestions={pipelineState.suggestions} status={pipelineState.status} />
		{/if}

		{#if showStyle}
			<StyleSelectionStep />
		{/if}

		{#if showGeneration}
			<StoryGenerationStep pages={pipelineState.pages} status={pipelineState.status} />
		{/if}

		{#if showImages}
			<ImageGenerationStep pages={pipelineState.pages} imageProgress={pipelineState.imageProgress} />
		{/if}

		{#if showComplete}
			<CompletionStep pages={pipelineState.pages} />
		{/if}

		{#if showError}
			<div class="error-state">
				<div class="error-icon">!</div>
				<h2 class="error-title">Something went wrong</h2>
				<p class="error-message">{pipelineState.error}</p>
				<div class="error-action">
					<Button variant="primary" size="md" onclick={handleRetry}>Try Again</Button>
					<Button variant="ghost" size="md" href="/">Back to Home</Button>
				</div>
			</div>
		{/if}
	</main>

	{#if logs.length > 0}
		<div class="debug-wrapper">
			<button class="debug-toggle" onclick={() => showDebug = !showDebug}>
				{showDebug ? 'Hide' : 'Show'} Debug ({logs.length})
			</button>
			{#if showDebug}
				<div class="debug-panel" bind:this={debugPanel}>
					{#each logs as log}
						<div class="debug-line">{log}</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.pipeline-shell {
		min-height: calc(100vh - var(--nav-height));
		background: var(--color-cream);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-lg) var(--space-md) var(--space-2xl);
	}

	.pipeline-content {
		width: 100%;
		max-width: 720px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-lg) 0;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-2xl) var(--space-md);
		animation: fadeUp 0.5s var(--ease-out-expo) both;
	}

	.empty-state h2 {
		font-family: var(--font-heading);
		font-size: var(--text-2xl);
		color: var(--color-plum);
	}

	.empty-state p {
		font-size: var(--text-base);
		color: var(--color-plum-muted);
		max-width: 400px;
	}

	.empty-action {
		margin-top: var(--space-sm);
	}

	/* Error state */
	.error-state {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-2xl) var(--space-md);
		animation: fadeUp 0.5s var(--ease-out-expo) both;
	}

	.error-icon {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-peach), var(--color-peach-dark));
		color: var(--color-white);
		font-family: var(--font-heading);
		font-size: var(--text-2xl);
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error-title {
		font-family: var(--font-heading);
		font-size: var(--text-2xl);
		color: var(--color-plum);
	}

	.error-message {
		font-size: var(--text-base);
		color: var(--color-plum-muted);
		max-width: 400px;
	}

	.error-action {
		display: flex;
		gap: var(--space-md);
		margin-top: var(--space-sm);
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.empty-state, .error-state { animation: none; opacity: 1; }
	}

	/* Debug panel */
	.debug-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 11px;
	}

	.debug-toggle {
		display: block;
		width: 100%;
		padding: 4px 12px;
		background: #1a1a2e;
		color: #7fdbca;
		border: none;
		border-top: 1px solid #333;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		font-size: inherit;
	}

	.debug-toggle:hover {
		background: #222244;
	}

	.debug-panel {
		max-height: 240px;
		overflow-y: auto;
		background: #0d1117;
		color: #c9d1d9;
		padding: 8px 12px;
		border-top: 1px solid #333;
	}

	.debug-line {
		padding: 1px 0;
		white-space: pre-wrap;
		word-break: break-all;
		line-height: 1.5;
	}

	.debug-line:nth-child(odd) {
		background: rgba(255, 255, 255, 0.02);
	}
</style>
