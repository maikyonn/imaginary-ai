<script lang="ts">
	import Section from '../layout/Section.svelte';

	const books = [
		{
			title: 'Luna\'s Starlight Adventure',
			cover: 'linear-gradient(145deg, #F8D0B8, #E8A87C, #D4895C)',
			emoji: '🌙',
			age: 'Ages 3-6'
		},
		{
			title: 'Captain Max Saves the Day',
			cover: 'linear-gradient(145deg, #A8D8EA, #7CB8D4, #5A9BB8)',
			emoji: '🦸',
			age: 'Ages 4-8'
		},
		{
			title: 'The Enchanted Garden',
			cover: 'linear-gradient(145deg, #C3E6CB, #8FBF9A, #6BA37A)',
			emoji: '🌻',
			age: 'Ages 2-5'
		},
		{
			title: 'Buddy\'s Big Day Out',
			cover: 'linear-gradient(145deg, #D4CCF2, #B8A9E8, #9585D0)',
			emoji: '🐶',
			age: 'Ages 3-7'
		},
		{
			title: 'Mia and the Rainbow Dragon',
			cover: 'linear-gradient(145deg, #FFD6E0, #F2A3B8, #E87F9A)',
			emoji: '🐉',
			age: 'Ages 5-9'
		},
		{
			title: 'The Little Astronaut',
			cover: 'linear-gradient(145deg, #3D3250, #574A6F, #7A6B9A)',
			emoji: '🚀',
			age: 'Ages 4-8',
			dark: true
		}
	];
</script>

<Section id="gallery" bg="linen">
	<div class="gallery">
		<div class="section-header">
			<span class="section-label">Inspiration</span>
			<h2 class="section-title">See what's possible</h2>
			<p class="section-subtitle">Every book is unique — just like your family</p>
		</div>

		<div class="book-grid">
			{#each books as book, i}
				<div class="book-card" style="--delay: {i * 80}ms">
					<div class="book-cover" style="background: {book.cover}">
						<span class="book-emoji">{book.emoji}</span>
						<div class="book-spine"></div>
						<div class="book-shine"></div>
					</div>
					<div class="book-info">
						<h3 class="book-title">{book.title}</h3>
						<span class="book-age">{book.age}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	.gallery {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2xl);
	}

	.section-header {
		text-align: center;
	}

	.section-label {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-lavender-dark);
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.section-title {
		font-size: var(--text-3xl);
		color: var(--color-plum);
		margin-top: var(--space-xs);
	}

	.section-subtitle {
		font-size: var(--text-lg);
		color: var(--color-plum-muted);
		margin-top: var(--space-xs);
	}

	/* Book grid */
	.book-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-xl) var(--space-lg);
		width: 100%;
		max-width: 900px;
	}

	.book-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		transition: transform var(--duration-base) var(--ease-out-back);
	}

	.book-card:hover {
		transform: translateY(-6px);
	}

	.book-cover {
		position: relative;
		width: 100%;
		aspect-ratio: 3 / 4;
		border-radius: 4px var(--radius-lg) var(--radius-lg) 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			6px 6px 20px rgba(61, 50, 80, 0.15),
			2px 0 0 rgba(61, 50, 80, 0.08) inset;
		overflow: hidden;
		transition: box-shadow var(--duration-base) var(--ease-out-expo);
	}

	.book-card:hover .book-cover {
		box-shadow:
			8px 10px 30px rgba(61, 50, 80, 0.22),
			2px 0 0 rgba(61, 50, 80, 0.08) inset;
	}

	.book-spine {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 6px;
		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.05) 40%,
			rgba(255, 255, 255, 0.1) 60%,
			rgba(0, 0, 0, 0.03)
		);
	}

	.book-shine {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			125deg,
			transparent 30%,
			rgba(255, 255, 255, 0.12) 45%,
			rgba(255, 255, 255, 0.06) 50%,
			transparent 60%
		);
		pointer-events: none;
	}

	.book-emoji {
		font-size: clamp(2.5rem, 5vw, 4rem);
		filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
	}

	.book-info {
		text-align: center;
	}

	.book-title {
		font-family: var(--font-heading);
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-plum);
		line-height: 1.3;
	}

	.book-age {
		font-size: var(--text-xs);
		color: var(--color-plum-muted);
		margin-top: 2px;
		display: block;
	}

	@media (max-width: 768px) {
		.book-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-lg) var(--space-md);
		}
	}

	@media (max-width: 480px) {
		.book-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-md);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.book-card {
			transition: none;
		}
	}
</style>
