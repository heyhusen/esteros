<script lang="ts">
	import { decode } from 'html-entities';

	import type { PageData } from './$types';

	export let data: PageData;
	export let { product } = data;

	$: ({ product } = data);
</script>

<svelte:head>
	<title>{product?.name} - Esteros</title>
</svelte:head>

{#if product}
	<div class="product">
		<img class="product__image" src={product.photo} alt={product.name} />

		<div class="product__detail">
			<header class="product__header">
				<h1 class="product__title">{product.name}</h1>

				<p class="product__price">${product.price}</p>
			</header>

			{#if product.description}
				<div class="product__description prose">
					{@html decode(product.description)}
				</div>
			{/if}

			<div class="product__add-to-cart">
				<form action="/cart" method="post">
					<input type="hidden" name="product_id" value={product.id} />

					<select class="select select-bordered" name="quantity">
						{#each { length: 10 } as _, i}
							<option value={i + 1}>{i + 1}</option>
						{/each}
					</select>

					<button class="btn">Add to cart</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.product {
		@apply flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-10;

		&__image {
			@apply w-full sm:w-1/2 object-cover object-center rounded-lg;
			aspect-ratio: 9/16;
		}

		&__detail {
			@apply md:flex-1 flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10;
		}

		&__header {
			@apply flex flex-col gap-1 md:gap-2 lg:gap-3 xl:gap-4;
		}

		&__title {
			@apply font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl;
		}

		&__price {
			@apply font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl;
		}

		&__add-to-cart {
			form {
				@apply flex flex-col items-start gap-3 md:gap-4 lg:gap-5 xl:gap-6;
			}

			.btn {
				@apply normal-case rounded-full;
			}
		}
	}
</style>
