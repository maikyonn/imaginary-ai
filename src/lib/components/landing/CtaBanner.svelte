<script lang="ts">
	import Section from '../layout/Section.svelte';
	import Button from '../ui/Button.svelte';
</script>

<Section bg="plum" padding="lg">
	<div class="cta-banner">
		<div class="cta-sparkle cta-sparkle-1">&#10022;</div>
		<div class="cta-sparkle cta-sparkle-2">&#10022;</div>
		<div class="cta-sparkle cta-sparkle-3">&#10022;</div>

		<h2 class="cta-title">Every child deserves to be the hero</h2>
		<p class="cta-subtitle">
			Create a one-of-a-kind storybook they'll treasure forever.
		</p>
		<div class="cta-actions">
			<Button variant="primary" size="lg" href="#">Create Their Book</Button>
		</div>
	</div>
</Section>

<style>
	.cta-banner {
		text-align: center;
		position: relative;
		padding: var(--space-xl) 0;
	}

	.cta-title {
		font-family: var(--font-brand);
		font-size: var(--text-3xl);
		color: var(--color-linen);
		max-width: 600px;
		margin: 0 auto;
	}

	.cta-subtitle {
		font-size: var(--text-lg);
		color: var(--color-lavender-light);
		margin-top: var(--space-md);
		max-width: 480px;
		margin-left: auto;
		margin-right: auto;
	}

	.cta-actions {
		margin-top: var(--space-xl);
	}

	/* Sparkle decorations */
	.cta-sparkle {
		position: absolute;
		color: var(--color-peach);
		font-size: 1.5rem;
		opacity: 0.4;
		animation: sparkleFloat 4s ease-in-out infinite;
	}

	.cta-sparkle-1 {
		top: 10%;
		left: 8%;
		animation-delay: 0s;
	}
	.cta-sparkle-2 {
		top: 20%;
		right: 12%;
		animation-delay: 1.3s;
		color: var(--color-lavender-light);
		font-size: 1.2rem;
	}
	.cta-sparkle-3 {
		bottom: 15%;
		left: 15%;
		animation-delay: 2.5s;
		font-size: 1rem;
	}

	@keyframes sparkleFloat {
		0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
		50% { transform: translateY(-10px) rotate(20deg); opacity: 0.7; }
	}

	@media (prefers-reduced-motion: reduce) {
		.cta-sparkle {
			animation: none;
		}
	}
</style>
