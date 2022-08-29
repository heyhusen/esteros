<script lang="ts">
	import type { Product } from '@esteros/types';

	export let products: Product[];
</script>

<div class="product-list">
	{#each products as product}
		<div class="card card-compact bg-base-100 shadow-xl">
			<figure>
				<a href="/product/{product.id}">
					<img src={product.photo} alt={product.name} />
				</a>
			</figure>

			<div class="card-body">
				<a href="/product/{product.id}">
					<h2 class="card-title">{product.name}</h2>
				</a>

				<p>${product.price}</p>

				<div class="card-actions justify-end">
					<form action="/cart" method="post">
						<input type="hidden" name="product_id" value={product.id} />
						<input type="hidden" name="quantity" value="1" />

						<button class="btn btn-sm">Add to cart</button>
					</form>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	.product-list {
		@apply grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 xl:gap-12;
	}

	.card {
		img {
			@apply w-full object-center object-cover duration-200;
			aspect-ratio: 3 / 4;

			&:hover {
				@apply brightness-75;
			}
		}

		&-body {
			p {
				@apply font-bold;
			}
		}

		.btn {
			@apply normal-case rounded-full;
		}
	}
</style>
