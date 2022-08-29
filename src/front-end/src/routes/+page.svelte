<script lang="ts">
	import type { PageData } from './$types';

	import ProductList from '$lib/components/ProductList.svelte';

	export let data: PageData;
	export let { products } = data;

	$: ({ products } = data);
</script>

<svelte:head>
	<title>Home - Esteros</title>
</svelte:head>

{#if products && products.length > 0}
	<section class="products">
		<header class="products__header">
			<h1 class="products__title">Want ice cream?</h1>

			<p class="products__subtitle">The best treat for a bad mood.</p>
		</header>

		<ProductList {products} />
	</section>
{:else}
	<div>No product.</div>
{/if}

<style type="postcss">
	.products {
		@apply flex flex-col gap-6 md:gap-8 lg:gap-10 xl:gap-12;

		&__header {
			@apply flex flex-col gap-1 md:gap-2 lg:gap-3 xl:gap-4;
		}

		&__title {
			@apply font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl;
		}

		&__subtitle {
			@apply text-lg md:text-xl lg:text-2xl xl:text-3xl;
		}
	}
</style>
