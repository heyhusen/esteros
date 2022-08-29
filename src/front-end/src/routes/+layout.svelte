<script lang="ts">
	import '../app.postcss';
	import type { LayoutData } from './$types';

	import Cart from '$lib/components/Cart.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	// import Search from '$lib/components/Search.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data: LayoutData;
	export let { cart } = data;

	$: ({ cart } = data);

	export let cartCount = 0;
	export let cartTotal = 0;

	if (cart) {
		cartCount = cart.products
			.map(({ quantity }) => quantity)
			.reduce((previousValue, currentvalue) => previousValue + currentvalue);
		cartTotal = cart.total_price;
	}
</script>

<svelte:head>
	<title>Esteros</title>
</svelte:head>

<div class="wrapper wrapper--body">
	<Navbar>
		<Logo slot="logo" />

		<div slot="items" class="navbar__items">
			<!-- <Search /> -->

			<Cart count={cartCount} total={cartTotal} />
		</div>
	</Navbar>

	<div class="wrapper wrapper--container">
		<slot />
	</div>

	<Footer />
</div>

<style lang="postcss">
	.navbar__items {
		@apply flex-none gap-2;
	}
</style>
