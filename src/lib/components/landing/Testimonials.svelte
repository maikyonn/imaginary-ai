<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '../layout/Section.svelte';

	const testimonials = [
		{
			name: 'Sarah M.',
			role: 'Mom of two',
			text: 'My daughter\'s face when she saw herself as a princess in her own book — I\'ll never forget it. We\'ve read it every night since.',
			avatar: '👩‍👧',
			stars: 5
		},
		{
			name: 'David K.',
			role: 'Dad & dog lover',
			text: 'We put our golden retriever in a book for our son\'s birthday. He now tells everyone his dog is famous. Best $29 ever spent.',
			avatar: '👨‍👦',
			stars: 5
		},
		{
			name: 'Emily R.',
			role: 'Grandmother',
			text: 'I made books for all six grandchildren with each of them as the hero. The quality is incredible — hardcover, beautiful illustrations.',
			avatar: '👵',
			stars: 5
		},
		{
			name: 'James T.',
			role: 'Uncle',
			text: 'Didn\'t know what to get my niece for her birthday. This was the most thoughtful gift I\'ve ever given. She thinks I\'m the coolest uncle now.',
			avatar: '👨',
			stars: 5
		},
		{
			name: 'Priya L.',
			role: 'Mom of three',
			text: 'The AI captured my kids so well! They fight over whose book to read at bedtime. I guess I need to order more stories.',
			avatar: '👩‍👧‍👦',
			stars: 5
		},
		{
			name: 'Maria C.',
			role: 'Teacher',
			text: 'I made a class book featuring all my students as characters in an adventure. They were absolutely thrilled. Such a wonderful keepsake.',
			avatar: '👩‍🏫',
			stars: 5
		}
	];

	let trackEl = $state<HTMLDivElement>(undefined!);
	let isPaused = $state(false);
	let translateX = $state(0);
	let animationId = 0;

	onMount(() => {
		const speed = 0.4; // px per frame
		let lastTime = performance.now();

		function tick(now: number) {
			if (!isPaused) {
				const delta = now - lastTime;
				translateX -= speed * (delta / 16.67);

				// Reset when we've scrolled through half (the duplicate set)
				const halfWidth = trackEl.scrollWidth / 2;
				if (Math.abs(translateX) >= halfWidth) {
					translateX += halfWidth;
				}
			}
			lastTime = now;
			animationId = requestAnimationFrame(tick);
		}

		animationId = requestAnimationFrame(tick);

		// Check reduced motion
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) isPaused = true;
		mq.addEventListener('change', (e) => { isPaused = e.matches; });

		return () => cancelAnimationFrame(animationId);
	});
</script>

<Section bg="cream" padding="lg">
	<div class="testimonials">
		<div class="section-header">
			<span class="section-label">Loved by families</span>
			<h2 class="section-title">Stories from happy readers</h2>
		</div>

		<div
			class="carousel-viewport"
			onmouseenter={() => (isPaused = true)}
			onmouseleave={() => (isPaused = false)}
			role="region"
			aria-label="Testimonials carousel"
		>
			<div
				class="carousel-track"
				bind:this={trackEl}
				style="transform: translateX({translateX}px)"
			>
				{#each [...testimonials, ...testimonials] as t, i}
					<div class="testimonial-card" aria-hidden={i >= testimonials.length}>
						<div class="card-stars">
							{#each Array(t.stars) as _}
								<span class="star">&#9733;</span>
							{/each}
						</div>
						<p class="card-text">&ldquo;{t.text}&rdquo;</p>
						<div class="card-author">
							<span class="author-avatar">{t.avatar}</span>
							<div class="author-info">
								<span class="author-name">{t.name}</span>
								<span class="author-role">{t.role}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</Section>

<style>
	.testimonials {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);
	}

	.section-header {
		text-align: center;
	}

	.section-label {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-peach);
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.section-title {
		font-size: var(--text-3xl);
		color: var(--color-plum);
		margin-top: var(--space-xs);
	}

	/* Carousel */
	.carousel-viewport {
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		overflow: hidden;
		mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 8%,
			black 92%,
			transparent 100%
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 8%,
			black 92%,
			transparent 100%
		);
		padding: var(--space-md) 0;
	}

	.carousel-track {
		display: flex;
		gap: var(--space-lg);
		will-change: transform;
		padding: 0 var(--space-lg);
	}

	.testimonial-card {
		flex-shrink: 0;
		width: 340px;
		background: var(--color-white);
		border-radius: var(--radius-xl);
		padding: var(--space-lg);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		transition: transform var(--duration-base) var(--ease-out-back),
					box-shadow var(--duration-base) var(--ease-out-expo);
	}

	.testimonial-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-xl);
	}

	.card-stars {
		display: flex;
		gap: 2px;
	}

	.star {
		color: #F5B942;
		font-size: 1.1rem;
	}

	.card-text {
		font-size: var(--text-base);
		color: var(--color-plum);
		line-height: 1.65;
		flex: 1;
	}

	.card-author {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding-top: var(--space-sm);
		border-top: 1px solid rgba(61, 50, 80, 0.06);
	}

	.author-avatar {
		font-size: 1.8rem;
	}

	.author-info {
		display: flex;
		flex-direction: column;
	}

	.author-name {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-plum);
	}

	.author-role {
		font-size: var(--text-xs);
		color: var(--color-plum-muted);
	}

	@media (max-width: 640px) {
		.testimonial-card {
			width: 280px;
			padding: var(--space-md);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.testimonial-card {
			transition: none;
		}
	}
</style>
