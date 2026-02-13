<script lang="ts">
	import Section from '../layout/Section.svelte';

	const steps = [
		{
			number: '1',
			icon: '📸',
			title: 'Upload Your Photos',
			description: 'Share photos of your kids, family, or pets. Our AI gets to know their unique features.'
		},
		{
			number: '2',
			icon: '✨',
			title: 'AI Creates Your Story',
			description: 'Choose a theme and watch as AI weaves your loved ones into a beautifully illustrated adventure.'
		},
		{
			number: '3',
			icon: '📚',
			title: 'Print & Ship',
			description: 'Receive a professionally printed, hardcover book delivered to your doorstep within days.'
		}
	];
</script>

<Section id="how-it-works" bg="cream">
	<div class="how-it-works">
		<div class="section-header">
			<span class="section-label">Simple as 1-2-3</span>
			<h2 class="section-title">How It Works</h2>
			<p class="section-subtitle">
				From photos to a printed book in just a few clicks
			</p>
		</div>

		<div class="steps">
			{#each steps as step, i}
				<div class="step" style="--delay: {i * 120}ms">
					<div class="step-number-wrap">
						<span class="step-number">{step.number}</span>
						{#if i < steps.length - 1}
							<div class="step-connector"></div>
						{/if}
					</div>
					<div class="step-card">
						<span class="step-icon">{step.icon}</span>
						<h3 class="step-title">{step.title}</h3>
						<p class="step-desc">{step.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	.how-it-works {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2xl);
	}

	.section-header {
		text-align: center;
		max-width: 560px;
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
		margin-top: var(--space-sm);
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
		width: 100%;
		max-width: 960px;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.step-number-wrap {
		display: flex;
		align-items: center;
		margin-bottom: var(--space-md);
		position: relative;
	}

	.step-number {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-lavender), var(--color-lavender-dark));
		color: var(--color-white);
		font-family: var(--font-brand);
		font-size: var(--text-xl);
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-glow-lavender);
		flex-shrink: 0;
	}

	.step-connector {
		position: absolute;
		left: 100%;
		top: 50%;
		width: calc(100% + var(--space-lg));
		height: 2px;
		background: linear-gradient(90deg, var(--color-lavender-light), transparent);
		transform: translateY(-50%);
	}

	.step-card {
		background: var(--color-white);
		border-radius: var(--radius-lg);
		padding: var(--space-lg) var(--space-md);
		box-shadow: var(--shadow-md);
		transition: transform var(--duration-base) var(--ease-out-back),
					box-shadow var(--duration-base) var(--ease-out-expo);
		width: 100%;
	}

	.step-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-xl);
	}

	.step-icon {
		font-size: 2.5rem;
		display: block;
		margin-bottom: var(--space-sm);
	}

	.step-title {
		font-size: var(--text-lg);
		color: var(--color-plum);
		margin-bottom: var(--space-xs);
	}

	.step-desc {
		font-size: var(--text-sm);
		color: var(--color-plum-muted);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.steps {
			grid-template-columns: 1fr;
			max-width: 400px;
		}

		.step-connector {
			display: none;
		}

		.step {
			flex-direction: row;
			text-align: left;
			gap: var(--space-md);
		}

		.step-number-wrap {
			margin-bottom: 0;
		}

		.step-card {
			padding: var(--space-md);
		}

		.step-icon {
			font-size: 1.8rem;
			margin-bottom: var(--space-xs);
		}
	}
</style>
