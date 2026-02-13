<script lang="ts">
	import Section from '../layout/Section.svelte';
	import Button from '../ui/Button.svelte';

	const features = [
		'24 pages of personalized story',
		'Hardcover with dust jacket',
		'Premium satin paper',
		'AI-generated illustrations',
		'Personalized dedication page',
		'Gift-ready packaging',
	];
</script>

<Section id="pricing" bg="cream">
	<div class="pricing">
		<div class="section-header">
			<span class="section-label">Simple Pricing</span>
			<h2 class="section-title">One Book, One Price</h2>
			<p class="section-subtitle">No subscriptions. No hidden fees. Just magic.</p>
		</div>

		<div class="pricing-card">
			<div class="card-ribbon">Most Popular</div>

			<div class="card-header">
				<h3 class="card-name">Your Story Book</h3>
				<div class="card-price">
					<span class="price-currency">$</span>
					<span class="price-amount">29</span>
				</div>
				<p class="price-note">per book + shipping</p>
			</div>

			<ul class="card-features">
				{#each features as feature}
					<li class="card-feature">
						<span class="check">&#10003;</span>
						{feature}
					</li>
				{/each}
			</ul>

			<div class="card-cta">
				<Button variant="primary" size="lg">Create Your Book</Button>
			</div>

			<p class="card-guarantee">
				100% satisfaction guarantee — love it or we'll make it right
			</p>
		</div>
	</div>
</Section>

<style>
	.pricing {
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
		color: var(--color-peach);
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

	/* Card */
	.pricing-card {
		position: relative;
		background: var(--color-white);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl) var(--space-xl);
		max-width: 420px;
		width: 100%;
		box-shadow: var(--shadow-xl);
		text-align: center;
		overflow: hidden;
		border: 2px solid var(--color-peach-light);
	}

	.card-ribbon {
		position: absolute;
		top: 20px;
		right: -32px;
		background: linear-gradient(135deg, var(--color-lavender), var(--color-lavender-dark));
		color: var(--color-white);
		font-family: var(--font-heading);
		font-size: var(--text-xs);
		font-weight: 700;
		padding: 6px 40px;
		transform: rotate(45deg);
		letter-spacing: 0.05em;
	}

	.card-header {
		margin-bottom: var(--space-lg);
	}

	.card-name {
		font-family: var(--font-brand);
		font-size: var(--text-2xl);
		color: var(--color-plum);
	}

	.card-price {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 2px;
		margin-top: var(--space-sm);
	}

	.price-currency {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-plum);
		margin-top: 0.4em;
	}

	.price-amount {
		font-family: var(--font-brand);
		font-size: var(--text-4xl);
		font-weight: 800;
		color: var(--color-plum);
		line-height: 1;
	}

	.price-note {
		font-size: var(--text-sm);
		color: var(--color-plum-muted);
		margin-top: var(--space-xs);
	}

	/* Features list */
	.card-features {
		text-align: left;
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.card-feature {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: var(--text-base);
		color: var(--color-plum);
	}

	.check {
		color: var(--color-peach);
		font-weight: 700;
		font-size: 1.1em;
		flex-shrink: 0;
	}

	.card-cta {
		margin-bottom: var(--space-md);
	}

	.card-guarantee {
		font-size: var(--text-xs);
		color: var(--color-plum-muted);
		font-style: italic;
	}

	@media (max-width: 480px) {
		.pricing-card {
			padding: var(--space-xl) var(--space-md);
		}
	}
</style>
