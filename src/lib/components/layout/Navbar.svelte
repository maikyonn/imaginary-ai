<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '../ui/Button.svelte';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 40;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<nav class="navbar" class:scrolled class:mobile-open={mobileOpen}>
	<div class="navbar-inner">
		<a href="/" class="brand" onclick={closeMobile}>
			<span class="brand-icon">✦</span>
			<span class="brand-text">Imaginary Books</span>
		</a>

		<div class="nav-links" class:open={mobileOpen}>
			<a href="#how-it-works" class="nav-link" onclick={closeMobile}>How It Works</a>
			<a href="#gallery" class="nav-link" onclick={closeMobile}>Gallery</a>
			<div class="nav-cta">
				<Button variant="primary" size="sm" href="#" onclick={closeMobile}>Create Your Book</Button>
			</div>
		</div>

		<button
			class="hamburger"
			class:active={mobileOpen}
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle menu"
			aria-expanded={mobileOpen}
		>
			<span class="hamburger-line"></span>
			<span class="hamburger-line"></span>
			<span class="hamburger-line"></span>
		</button>
	</div>
</nav>

{#if mobileOpen}
	<div class="mobile-backdrop" onclick={closeMobile} role="presentation"></div>
{/if}

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		height: var(--nav-height);
		display: flex;
		align-items: center;
		transition:
			background-color var(--duration-base) var(--ease-out-expo),
			box-shadow var(--duration-base) var(--ease-out-expo),
			backdrop-filter var(--duration-base);
	}

	.navbar.scrolled {
		background-color: rgba(254, 246, 240, 0.85);
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		box-shadow: 0 1px 0 rgba(61, 50, 80, 0.06);
	}

	.navbar-inner {
		max-width: var(--max-width);
		margin: 0 auto;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--space-md);
	}

	/* Brand */
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-brand);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-plum);
		z-index: 10;
	}

	.brand-icon {
		font-size: 1.4em;
		color: var(--color-peach);
		display: inline-block;
		animation: twinkle 3s ease-in-out infinite;
	}

	@keyframes twinkle {
		0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
		50% { transform: scale(1.1) rotate(15deg); opacity: 0.8; }
	}

	/* Nav Links (desktop) */
	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	.nav-link {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-plum-muted);
		transition: color var(--duration-fast);
		position: relative;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--color-peach);
		border-radius: 1px;
		transition: width var(--duration-base) var(--ease-out-expo);
	}

	.nav-link:hover {
		color: var(--color-plum);
	}

	.nav-link:hover::after {
		width: 100%;
	}

	/* Hamburger */
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 36px;
		height: 36px;
		z-index: 10;
	}

	.hamburger-line {
		display: block;
		width: 24px;
		height: 2px;
		background: var(--color-plum);
		border-radius: 2px;
		transition: all var(--duration-base) var(--ease-out-expo);
		transform-origin: center;
	}

	.hamburger.active .hamburger-line:nth-child(1) {
		transform: translateY(7px) rotate(45deg);
	}

	.hamburger.active .hamburger-line:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
	}

	.hamburger.active .hamburger-line:nth-child(3) {
		transform: translateY(-7px) rotate(-45deg);
	}

	.mobile-backdrop {
		display: none;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.hamburger {
			display: flex;
		}

		.nav-links {
			position: fixed;
			top: 0;
			right: 0;
			width: min(320px, 85vw);
			height: 100dvh;
			flex-direction: column;
			justify-content: center;
			gap: var(--space-lg);
			background: var(--color-linen);
			padding: var(--space-2xl) var(--space-xl);
			transform: translateX(100%);
			transition: transform var(--duration-slow) var(--ease-out-expo);
			box-shadow: -8px 0 32px rgba(61, 50, 80, 0.12);
		}

		.nav-links.open {
			transform: translateX(0);
		}

		.nav-link {
			font-size: var(--text-lg);
		}

		.mobile-backdrop {
			display: block;
			position: fixed;
			inset: 0;
			background: rgba(61, 50, 80, 0.3);
			z-index: 999;
			backdrop-filter: blur(4px);
		}

		.navbar.mobile-open {
			background-color: rgba(254, 246, 240, 0.95);
			backdrop-filter: blur(16px);
		}
	}
</style>
