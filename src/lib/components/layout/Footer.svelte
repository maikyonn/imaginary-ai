<script lang="ts">
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-grid">
			<div class="footer-brand">
				<a href="/" class="brand">
					<span class="brand-icon">&#10022;</span>
					<span class="brand-text">Imaginary Books</span>
				</a>
				<p class="brand-desc">
					Turning everyday moments into stories that last a lifetime.
				</p>
			</div>

			<div class="footer-col">
				<h4 class="footer-heading">Product</h4>
				<a href="#how-it-works" class="footer-link">How It Works</a>
				<a href="#gallery" class="footer-link">Gallery</a>
			</div>

			<div class="footer-col">
				<h4 class="footer-heading">Company</h4>
				<span class="footer-link">About</span>
				<span class="footer-link">Blog</span>
				<span class="footer-link">Contact</span>
			</div>

			<div class="footer-col">
				<h4 class="footer-heading">Legal</h4>
				<span class="footer-link">Privacy Policy</span>
				<span class="footer-link">Terms of Service</span>
			</div>
		</div>

		<div class="footer-bottom">
			<p class="copyright">&copy; {new Date().getFullYear()} Imaginary Books. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-plum);
		color: var(--color-linen);
		padding: var(--space-2xl) var(--space-md) var(--space-lg);
	}

	.footer-inner {
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: var(--space-xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid rgba(254, 246, 240, 0.1);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-brand);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-linen);
		margin-bottom: var(--space-sm);
	}

	.brand-icon {
		color: var(--color-peach);
		font-size: 1.3em;
	}

	.brand-desc {
		font-size: var(--text-sm);
		color: rgba(254, 246, 240, 0.6);
		max-width: 280px;
		line-height: 1.6;
	}

	.footer-heading {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-peach-light);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: var(--space-md);
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.footer-link {
		font-size: var(--text-sm);
		color: rgba(254, 246, 240, 0.6);
		transition: color var(--duration-fast);
	}

	.footer-link:hover {
		color: var(--color-linen);
	}

	.footer-bottom {
		padding-top: var(--space-lg);
		text-align: center;
	}

	.copyright {
		font-size: var(--text-xs);
		color: rgba(254, 246, 240, 0.35);
	}

	@media (max-width: 768px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-xl) var(--space-lg);
		}

		.footer-brand {
			grid-column: span 2;
		}
	}

	@media (max-width: 480px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}
		.footer-brand {
			grid-column: span 1;
		}
	}
</style>
