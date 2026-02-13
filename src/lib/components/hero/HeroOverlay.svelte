<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setUploadedFiles } from '$lib/stores/upload-handoff.svelte';
	import Button from '../ui/Button.svelte';

	let scrollProgress = $state(0);
	let visible = $state(false);
	let dragOver = $state(false);
	let uploadedFiles = $state<{ name: string; preview: string }[]>([]);
	let rawFiles = $state<File[]>([]);
	let fileInput = $state<HTMLInputElement>(undefined!);

	onMount(() => {
		visible = true;

		let ticking = false;
		function onScroll() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const scrollable = document.querySelector('.scroll-video');
				if (!scrollable) { ticking = false; return; }
				const rect = scrollable.getBoundingClientRect();
				const total = rect.height - window.innerHeight;
				scrollProgress = Math.max(0, Math.min(1, -rect.top / total));
				ticking = false;
			});
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	let titleOpacity = $derived(
		scrollProgress < 0.35
			? 1
			: Math.max(0, 1 - (scrollProgress - 0.35) / 0.15)
	);
	let contentOpacity = $derived(
		scrollProgress < 0.05
			? scrollProgress / 0.05
			: scrollProgress < 0.4
				? 1
				: Math.max(0, 1 - (scrollProgress - 0.4) / 0.15)
	);
	let uploadOpacity = $derived(
		scrollProgress < 0.08
			? scrollProgress / 0.08
			: scrollProgress < 0.45
				? 1
				: Math.max(0, 1 - (scrollProgress - 0.45) / 0.15)
	);
	let titleTranslate = $derived(scrollProgress * -50);
	let contentTranslate = $derived(scrollProgress * -25);

	let scrollHintOpacity = $derived(
		scrollProgress < 0.05 ? 1 : Math.max(0, 1 - scrollProgress / 0.12)
	);

	function handleFiles(files: FileList | null) {
		if (!files) return;
		for (const file of files) {
			if (!file.type.startsWith('image/')) continue;
			rawFiles = [...rawFiles, file];
			const reader = new FileReader();
			reader.onload = (e) => {
				uploadedFiles = [...uploadedFiles, { name: file.name, preview: e.target?.result as string }];
			};
			reader.readAsDataURL(file);
		}
	}

	function removeFile(index: number) {
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		rawFiles = rawFiles.filter((_, i) => i !== index);
	}

	function handleCreateBook() {
		setUploadedFiles([...rawFiles]);
		goto('/create');
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function onDragLeave() {
		dragOver = false;
	}

	function triggerFileInput() {
		fileInput?.click();
	}
</script>

<div class="hero-overlay" class:visible>
	<div class="hero-content">
		<h1
			class="hero-title"
			style="opacity: {titleOpacity}; transform: translateY({titleTranslate}px)"
		>
			Imaginary<br />Books
		</h1>

		<p
			class="hero-tagline"
			style="opacity: {contentOpacity}; transform: translateY({contentTranslate}px)"
		>
			Turn your photos into magical storybooks
		</p>

		<div
			class="upload-area"
			style="opacity: {uploadOpacity}; transform: translateY({contentTranslate}px)"
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="upload-dropzone"
				class:drag-over={dragOver}
				class:has-files={uploadedFiles.length > 0}
				ondrop={onDrop}
				ondragover={onDragOver}
				ondragleave={onDragLeave}
				onclick={triggerFileInput}
				role="button"
				tabindex="0"
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput(); }}
			>
				<input
					bind:this={fileInput}
					type="file"
					accept="image/*"
					multiple
					class="file-input"
					onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
				/>

				{#if uploadedFiles.length === 0}
					<div class="dropzone-content">
						<div class="upload-icon">
							<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
						</div>
						<p class="dropzone-text">
							<span class="dropzone-cta">Upload your photos</span>
							<span class="dropzone-hint">or drag & drop here</span>
						</p>
						<span class="dropzone-formats">JPG, PNG, HEIC up to 20MB</span>
					</div>
				{:else}
					<div class="preview-grid">
						{#each uploadedFiles as file, i}
							<div class="preview-item">
								<img src={file.preview} alt={file.name} class="preview-img" />
								<button
									class="preview-remove"
									onclick={(e) => { e.stopPropagation(); removeFile(i); }}
									aria-label="Remove {file.name}"
								>
									&times;
								</button>
							</div>
						{/each}
						<button class="add-more" aria-label="Add more photos" onclick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<line x1="12" y1="5" x2="12" y2="19" />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
						</button>
					</div>
				{/if}
			</div>

			{#if uploadedFiles.length > 0}
				<div class="upload-action">
					<Button variant="primary" size="lg" onclick={handleCreateBook}>Create My Book &rarr;</Button>
					<span class="upload-count">{uploadedFiles.length} photo{uploadedFiles.length > 1 ? 's' : ''} selected</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="scroll-hint" style="opacity: {scrollHintOpacity}">
		<div class="scroll-mouse">
			<div class="scroll-dot"></div>
		</div>
		<span class="scroll-text">Scroll to explore</span>
	</div>
</div>

<style>
	.hero-overlay {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		text-align: center;
		padding: var(--space-md);
		will-change: auto;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
	}

	.hero-title {
		font-family: var(--font-brand);
		font-size: var(--text-hero);
		font-weight: 800;
		color: var(--color-white);
		line-height: 0.95;
		letter-spacing: -0.02em;
		text-shadow:
			0 2px 20px rgba(61, 50, 80, 0.4),
			0 0 60px rgba(232, 168, 124, 0.15);
		will-change: transform, opacity;
	}

	.hero-tagline {
		font-family: var(--font-heading);
		font-size: var(--text-2xl);
		font-weight: 500;
		color: rgba(255, 255, 255, 0.92);
		text-shadow: 0 1px 12px rgba(61, 50, 80, 0.3);
		max-width: 520px;
		will-change: transform, opacity;
	}

	/* Upload area */
	.upload-area {
		width: 100%;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		will-change: transform, opacity;
	}

	.upload-dropzone {
		width: 100%;
		border: 2px dashed rgba(255, 255, 255, 0.45);
		border-radius: var(--radius-xl);
		padding: var(--space-xl) var(--space-lg);
		cursor: pointer;
		transition:
			border-color var(--duration-base) var(--ease-out-expo),
			background-color var(--duration-base) var(--ease-out-expo),
			transform var(--duration-base) var(--ease-out-back);
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
	}

	.upload-dropzone:hover {
		border-color: var(--color-peach);
		background: rgba(255, 255, 255, 0.14);
		transform: scale(1.01);
	}

	.upload-dropzone.drag-over {
		border-color: var(--color-peach);
		background: rgba(232, 168, 124, 0.15);
		transform: scale(1.03);
		border-style: solid;
	}

	.upload-dropzone.has-files {
		padding: var(--space-md);
	}

	.file-input {
		display: none;
	}

	.dropzone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
	}

	.upload-icon {
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: var(--space-xs);
	}

	.dropzone-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.dropzone-cta {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-white);
	}

	.dropzone-hint {
		font-size: var(--text-sm);
		color: rgba(255, 255, 255, 0.6);
	}

	.dropzone-formats {
		font-size: var(--text-xs);
		color: rgba(255, 255, 255, 0.4);
		margin-top: var(--space-xs);
	}

	/* Preview grid */
	.preview-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: center;
	}

	.preview-item {
		position: relative;
		width: 72px;
		height: 72px;
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0,0,0,0.2);
	}

	.preview-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.preview-remove {
		position: absolute;
		top: 2px;
		right: 2px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgba(0,0,0,0.6);
		color: white;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		padding: 0;
		border: none;
		cursor: pointer;
		transition: background var(--duration-fast);
	}

	.preview-remove:hover {
		background: rgba(220, 60, 60, 0.9);
	}

	.add-more {
		width: 72px;
		height: 72px;
		border-radius: var(--radius-md);
		border: 2px dashed rgba(255,255,255,0.4);
		background: rgba(255,255,255,0.08);
		color: rgba(255,255,255,0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--duration-fast);
	}

	.add-more:hover {
		border-color: var(--color-peach);
		color: var(--color-peach);
		background: rgba(255,255,255,0.12);
	}

	/* Upload action */
	.upload-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
	}

	.upload-count {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
	}

	/* Entrance animation */
	.hero-overlay {
		opacity: 0;
	}
	.hero-overlay.visible {
		animation: heroEntrance 1.2s var(--ease-out-expo) forwards;
	}

	@keyframes heroEntrance {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Scroll hint */
	.scroll-hint {
		position: absolute;
		bottom: var(--space-xl);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		will-change: opacity;
	}

	.scroll-mouse {
		width: 24px;
		height: 38px;
		border: 2px solid rgba(255, 255, 255, 0.6);
		border-radius: 12px;
		display: flex;
		justify-content: center;
		padding-top: 6px;
	}

	.scroll-dot {
		width: 4px;
		height: 8px;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 2px;
		animation: scrollBounce 1.8s ease-in-out infinite;
	}

	@keyframes scrollBounce {
		0%, 100% { transform: translateY(0); opacity: 1; }
		50% { transform: translateY(10px); opacity: 0.3; }
	}

	.scroll-text {
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	@media (max-width: 640px) {
		.hero-title {
			font-size: clamp(2.5rem, 10vw, 4rem);
		}
		.hero-tagline {
			font-size: var(--text-lg);
		}
		.upload-dropzone {
			padding: var(--space-lg) var(--space-md);
		}
		.preview-item, .add-more {
			width: 60px;
			height: 60px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-overlay {
			opacity: 1;
			animation: none;
		}
		.scroll-dot {
			animation: none;
		}
	}
</style>
