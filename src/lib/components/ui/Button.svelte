<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		children: Snippet;
		onclick?: () => void;
	}

	let { variant = 'primary', size = 'md', href, children, onclick }: Props = $props();
</script>

{#if href}
	<a {href} class="btn btn-{variant} btn-{size}" role="button">
		{@render children()}
	</a>
{:else}
	<button class="btn btn-{variant} btn-{size}" {onclick}>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		border-radius: var(--radius-pill);
		font-family: var(--font-heading);
		font-weight: 600;
		letter-spacing: 0.01em;
		white-space: nowrap;
		transition:
			transform var(--duration-base) var(--ease-out-back),
			box-shadow var(--duration-base) var(--ease-out-expo),
			background-color var(--duration-base) var(--ease-out-expo);
		position: relative;
		overflow: hidden;
		text-decoration: none;
	}

	.btn::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		opacity: 0;
		transition: opacity var(--duration-fast);
		background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
	}

	.btn:hover::after {
		opacity: 1;
	}

	.btn:hover {
		transform: translateY(-2px);
	}

	.btn:active {
		transform: translateY(0) scale(0.97);
	}

	/* Sizes */
	.btn-sm {
		padding: 0.5rem 1.25rem;
		font-size: var(--text-sm);
	}

	.btn-md {
		padding: 0.75rem 2rem;
		font-size: var(--text-base);
	}

	.btn-lg {
		padding: 1rem 2.75rem;
		font-size: var(--text-lg);
	}

	/* Primary */
	.btn-primary {
		background: linear-gradient(135deg, var(--color-peach), var(--color-peach-dark));
		color: var(--color-white);
		box-shadow: var(--shadow-glow-peach);
	}

	.btn-primary:hover {
		box-shadow: 0 6px 32px rgba(232, 168, 124, 0.5);
	}

	/* Secondary */
	.btn-secondary {
		background: linear-gradient(135deg, var(--color-lavender), var(--color-lavender-dark));
		color: var(--color-white);
		box-shadow: var(--shadow-glow-lavender);
	}

	.btn-secondary:hover {
		box-shadow: 0 6px 32px rgba(184, 169, 232, 0.45);
	}

	/* Ghost */
	.btn-ghost {
		background: transparent;
		color: var(--color-plum);
		border: 2px solid var(--color-plum);
		box-shadow: none;
	}

	.btn-ghost:hover {
		background: var(--color-plum);
		color: var(--color-linen);
		box-shadow: var(--shadow-md);
	}
</style>
