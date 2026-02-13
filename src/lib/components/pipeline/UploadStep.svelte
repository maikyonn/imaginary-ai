<script lang="ts">
	interface Props {
		files: File[];
	}

	let { files }: Props = $props();

	let previews = $state<string[]>([]);

	$effect(() => {
		const urls: string[] = [];
		for (const file of files) {
			const url = URL.createObjectURL(file);
			urls.push(url);
		}
		previews = urls;

		return () => {
			for (const url of urls) {
				URL.revokeObjectURL(url);
			}
		};
	});
</script>

<div class="upload-step">
	<div class="photo-grid">
		{#each previews as src, i}
			<div class="photo-thumb">
				<img {src} alt={files[i]?.name ?? 'Uploaded photo'} />
			</div>
		{/each}
	</div>
	<div class="status-message">
		<div class="pulse-dot"></div>
		<p>Starting pipeline...</p>
	</div>
</div>

<style>
	.upload-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		animation: fadeUp 0.5s var(--ease-out-expo) both;
	}

	.photo-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: center;
		max-width: 400px;
	}

	.photo-thumb {
		width: 80px;
		height: 80px;
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-md);
	}

	.photo-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.status-message {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-plum);
	}

	.pulse-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--color-peach);
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.5; transform: scale(0.85); }
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.upload-step { animation: none; opacity: 1; }
		.pulse-dot { animation: none; }
	}
</style>
