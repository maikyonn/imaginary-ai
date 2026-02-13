<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Imaginary Books — Turn Photos into Magical Storybooks</title>
</svelte:head>

<Navbar />
{@render children()}
