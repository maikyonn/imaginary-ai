<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		id?: string;
		bg?: 'linen' | 'cream' | 'white' | 'plum';
		padding?: 'sm' | 'md' | 'lg';
		children: Snippet;
	}

	let { id, bg = 'linen', padding = 'lg', children }: Props = $props();

	let sectionEl: HTMLElement;
	let isVisible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
		);
		observer.observe(sectionEl);
		return () => observer.disconnect();
	});
</script>

<section
	{id}
	class="section section-{bg} section-pad-{padding}"
	class:is-visible={isVisible}
	bind:this={sectionEl}
>
	<div class="section-inner">
		{@render children()}
	</div>
</section>

<style>
	.section {
		position: relative;
		width: 100%;
		opacity: 0;
		transform: translateY(32px);
		transition: opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo);
	}

	.section.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.section {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}

	.section-inner {
		max-width: var(--max-width);
		margin: 0 auto;
		padding-left: var(--space-md);
		padding-right: var(--space-md);
	}

	/* Padding variants */
	.section-pad-sm {
		padding-top: var(--space-xl);
		padding-bottom: var(--space-xl);
	}
	.section-pad-md {
		padding-top: var(--space-2xl);
		padding-bottom: var(--space-2xl);
	}
	.section-pad-lg {
		padding-top: var(--space-3xl);
		padding-bottom: var(--space-3xl);
	}

	/* Background variants */
	.section-linen {
		background-color: var(--color-linen);
	}
	.section-cream {
		background-color: var(--color-cream);
	}
	.section-white {
		background-color: var(--color-white);
	}
	.section-plum {
		background-color: var(--color-plum);
		color: var(--color-linen);
	}
</style>
