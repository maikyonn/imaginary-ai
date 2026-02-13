<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const FRAME_COUNT = 72;
	let containerEl = $state<HTMLDivElement>(undefined!);
	let canvasEl = $state<HTMLCanvasElement>(undefined!);
	let ctx: CanvasRenderingContext2D | null = null;
	let frames: HTMLImageElement[] = [];
	let loadedCount = $state(0);
	let currentFrame = $state(0);
	let reducedMotion = $state(false);
	let scrollProgress = $state(0);
	let canvasWidth = $state(1280);
	let canvasHeight = $state(720);

	function getFrameSrc(index: number): string {
		const num = String(index + 1).padStart(3, '0');
		return `/frames/frame-${num}.webp`;
	}

	function drawFrame(index: number) {
		if (!ctx || !frames[index]?.complete) return;
		const img = frames[index];

		// Cover-fit the image to the canvas
		const canvasRatio = canvasEl.width / canvasEl.height;
		const imgRatio = img.naturalWidth / img.naturalHeight;

		let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
		if (imgRatio > canvasRatio) {
			sw = img.naturalHeight * canvasRatio;
			sx = (img.naturalWidth - sw) / 2;
		} else {
			sh = img.naturalWidth / canvasRatio;
			sy = (img.naturalHeight - sh) / 2;
		}

		ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasEl.width, canvasEl.height);
	}

	onMount(() => {
		// Check reduced motion preference
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		mq.addEventListener('change', (e) => (reducedMotion = e.matches));

		if (reducedMotion) return;

		// Set up canvas
		ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		function handleResize() {
			const dpr = Math.min(window.devicePixelRatio, 2);
			canvasWidth = window.innerWidth;
			canvasHeight = window.innerHeight;
			canvasEl.width = canvasWidth * dpr;
			canvasEl.height = canvasHeight * dpr;
			ctx!.scale(dpr, dpr);
			canvasEl.style.width = canvasWidth + 'px';
			canvasEl.style.height = canvasHeight + 'px';
			drawFrame(currentFrame);
		}

		// Preload all frames
		for (let i = 0; i < FRAME_COUNT; i++) {
			const img = new Image();
			img.src = getFrameSrc(i);
			img.onload = () => {
				loadedCount++;
				if (i === 0) {
					handleResize();
					drawFrame(0);
				}
			};
			frames[i] = img;
		}

		handleResize();
		window.addEventListener('resize', handleResize);

		// Scroll handler
		let ticking = false;
		function onScroll() {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				if (!containerEl) { ticking = false; return; }
				const rect = containerEl.getBoundingClientRect();
				const scrollable = rect.height - window.innerHeight;
				const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
				scrollProgress = progress;
				const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

				if (frameIndex !== currentFrame) {
					currentFrame = frameIndex;
					drawFrame(frameIndex);
				}
				ticking = false;
			});
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="scroll-video" bind:this={containerEl}>
	{#if reducedMotion}
		<div class="static-poster">
			<img src="/frames/frame-poster.webp" alt="Imaginary Books preview" />
			{#if children}
				<div class="overlay-wrap">
					{@render children()}
				</div>
			{/if}
		</div>
	{:else}
		<div class="sticky-frame">
			<canvas bind:this={canvasEl} class="video-canvas"></canvas>

			<!-- Gradient overlays for text readability -->
			<div class="gradient-top"></div>
			<div class="gradient-bottom"></div>

			{#if children}
				<div class="overlay-wrap">
					{@render children()}
				</div>
			{/if}

			{#if loadedCount < FRAME_COUNT}
				<div class="loading-bar">
					<div class="loading-fill" style="width: {(loadedCount / FRAME_COUNT) * 100}%"></div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.scroll-video {
		position: relative;
		height: 400vh;
		width: 100%;
	}

	.sticky-frame {
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	.video-canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.gradient-top {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40%;
		background: linear-gradient(
			to bottom,
			rgba(61, 50, 80, 0.45) 0%,
			rgba(61, 50, 80, 0.15) 50%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	.gradient-bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(
			to top,
			rgba(254, 246, 240, 0.95) 0%,
			rgba(254, 246, 240, 0.4) 30%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 1;
	}

	.overlay-wrap {
		position: absolute;
		inset: 0;
		z-index: 2;
		pointer-events: none;
	}

	.overlay-wrap :global(*) {
		pointer-events: auto;
	}

	/* Loading bar */
	.loading-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(255,255,255,0.15);
		z-index: 10;
	}

	.loading-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-peach), var(--color-lavender));
		transition: width 0.3s ease-out;
	}

	/* Static poster fallback */
	.static-poster {
		position: relative;
		width: 100%;
		height: 100vh;
		height: 100dvh;
		overflow: hidden;
	}

	.static-poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
