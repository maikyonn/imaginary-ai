<script lang="ts">
	import Section from '../layout/Section.svelte';

	const features = [
		{
			icon: '🎨',
			title: 'Personalized Characters',
			description: 'Your child becomes the hero of their very own story. Our AI faithfully captures their likeness and personality in every illustration.',
			accent: 'peach'
		},
		{
			icon: '📖',
			title: 'Premium Print Quality',
			description: 'Every book is printed on thick, durable pages with a hardcover binding. Vibrant colors that pop and paper that can survive sticky fingers.',
			accent: 'lavender'
		},
		{
			icon: '🖌️',
			title: 'Stunning AI Illustrations',
			description: 'Beautiful, whimsical artwork in a consistent style throughout your book. Each illustration is crafted to capture the magic of childhood.',
			accent: 'peach'
		},
		{
			icon: '🎁',
			title: 'Gift-Ready Packaging',
			description: 'Each book arrives in beautiful packaging, ready to gift. Add a personalized dedication page to make it truly special.',
			accent: 'lavender'
		}
	];
</script>

<Section id="features" bg="linen">
	<div class="features">
		<div class="section-header">
			<span class="section-label">Why Families Love Us</span>
			<h2 class="section-title">Made with Magic,<br />Built to Last</h2>
		</div>

		<div class="feature-list">
			{#each features as feature, i}
				<div class="feature-row" class:reversed={i % 2 === 1}>
					<div class="feature-visual">
						<div class="feature-blob {feature.accent}">
							<span class="feature-icon">{feature.icon}</span>
						</div>
					</div>
					<div class="feature-content">
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-desc">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	.features {
		display: flex;
		flex-direction: column;
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

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xl);
	}

	.feature-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		align-items: center;
	}

	.feature-row.reversed {
		direction: rtl;
	}

	.feature-row.reversed > * {
		direction: ltr;
	}

	.feature-visual {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.feature-blob {
		width: clamp(160px, 25vw, 240px);
		height: clamp(160px, 25vw, 240px);
		border-radius: 42% 58% 62% 38% / 46% 52% 48% 54%;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: blobMorph 8s ease-in-out infinite;
		transition: transform var(--duration-base) var(--ease-out-back);
	}

	.feature-blob:hover {
		transform: scale(1.06);
	}

	.feature-blob.peach {
		background: linear-gradient(135deg, var(--color-peach-light), var(--color-peach));
		box-shadow: 0 12px 40px rgba(232, 168, 124, 0.25);
	}

	.feature-blob.lavender {
		background: linear-gradient(135deg, var(--color-lavender-light), var(--color-lavender));
		box-shadow: 0 12px 40px rgba(184, 169, 232, 0.25);
	}

	@keyframes blobMorph {
		0%, 100% { border-radius: 42% 58% 62% 38% / 46% 52% 48% 54%; }
		25% { border-radius: 52% 48% 42% 58% / 58% 42% 58% 42%; }
		50% { border-radius: 38% 62% 52% 48% / 42% 58% 42% 58%; }
		75% { border-radius: 58% 42% 48% 52% / 52% 48% 52% 48%; }
	}

	.feature-icon {
		font-size: clamp(3rem, 5vw, 4.5rem);
	}

	.feature-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.feature-title {
		font-size: var(--text-2xl);
		color: var(--color-plum);
	}

	.feature-desc {
		font-size: var(--text-base);
		color: var(--color-plum-muted);
		line-height: 1.7;
		max-width: 440px;
	}

	@media (max-width: 768px) {
		.feature-row,
		.feature-row.reversed {
			grid-template-columns: 1fr;
			text-align: center;
			direction: ltr;
		}

		.feature-content {
			align-items: center;
		}

		.feature-desc {
			max-width: 480px;
		}

		.feature-blob {
			width: 140px;
			height: 140px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.feature-blob {
			animation: none;
		}
	}
</style>
