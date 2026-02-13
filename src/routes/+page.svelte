<script lang="ts">
	import ScrollVideo from '$lib/components/hero/ScrollVideo.svelte';
	import HeroOverlay from '$lib/components/hero/HeroOverlay.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Gallery from '$lib/components/landing/Gallery.svelte';
	import Testimonials from '$lib/components/landing/Testimonials.svelte';
	import CtaBanner from '$lib/components/landing/CtaBanner.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
</script>

<!-- Hero: Scroll-driven video with upload area -->
<ScrollVideo>
	<HeroOverlay />
</ScrollVideo>

<!-- How It Works -->
<HowItWorks />

<!-- Gallery -->
<Gallery />

<!-- Testimonials -->
<Testimonials />

<!-- CTA Banner -->
<CtaBanner />

<!-- Footer -->
<Footer />
