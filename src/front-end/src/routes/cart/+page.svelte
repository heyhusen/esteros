<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let { cart } = data;
	export let count = 0;

	$: ({ cart } = data);

	if (cart) {
		count = cart.products
			.map(({ quantity }) => quantity)
			.reduce((previousValue, currentvalue) => previousValue + currentvalue);
	}

	export const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const today = new Date();
	export const currentYear = today.getFullYear();
</script>

<svelte:head>
	<title>Cart - Esteros</title>
</svelte:head>

<section
	class="cart-container my-auto"
	class:cart-container--empty={!cart || cart.products.length < 1}
>
	{#if cart && cart.products.length > 0}
		<header class="cart-container__header">
			<h1 class="cart-container__title">Cart ({count})</h1>

			<div class="cart-container__action">
				<form action="/cart/empty" method="post">
					<button class="btn btn-outline btn-secondary">Empty</button>
				</form>

				<a href="/product" class="btn btn-secondary">Continue Shopping</a>
			</div>
		</header>

		<div class="cart-wrapper">
			<div class="cart">
				<div class="product-list">
					{#each cart.products as product}
						<div class="product">
							<img
								class="product__photo"
								src={product.photo}
								alt={product.name}
							/>

							<div class="product__detail">
								<header class="product__header">
									<h3 class="product__title">{product.name}</h3>

									<small class="product__subtitle">SKU #{product.sku}</small>
								</header>

								<footer class="product__footer">
									<span>Quantity: {product.quantity}</span>

									<span class="product__price">
										${product.quantity * product.price}
									</span>
								</footer>
							</div>
						</div>
					{/each}
				</div>

				<div class="cart__shipping-price">
					<span>Shipping</span>

					<span class="cart__shipping-cost">${cart.shipping_cost}</span>
				</div>

				<div class="cart__total-price">
					<span>Total</span>

					<span class="cart__total-cost">${cart.total_price}</span>
				</div>
			</div>

			<form action="/order" method="post" class="user-info">
				<section class="address">
					<h3>Shipping Address</h3>

					<div class="address__input">
						<div class="form-control sm:col-span-2">
							<label class="label">E-Mail</label>

							<input
								type="text"
								class="input input-bordered"
								name="email"
								value="johndoe@example.com"
								required
							/>
						</div>

						<div class="form-control sm:col-span-2">
							<label class="label">Street</label>

							<input
								type="text"
								class="input input-bordered"
								name="street"
								value="58104 Morning Hill"
								required
							/>
						</div>

						<div class="form-control sm:col-span-2">
							<label class="label">Zip Code</label>

							<input
								type="text"
								class="input input-bordered"
								name="zip_code"
								value="51262"
								required
							/>
						</div>

						<div class="form-control sm:col-span-2">
							<label class="label">City</label>

							<input
								type="text"
								class="input input-bordered"
								name="city"
								value="Ciamis"
								required
							/>
						</div>

						<div
							class="form-control md:col-span-2 lg:col-span-1 sm:mr-2 md:mr-0 lg:mr-1"
						>
							<label class="label">State</label>

							<input
								type="text"
								class="input input-bordered"
								name="state"
								value="West Java"
								required
							/>
						</div>

						<div
							class="form-control md:col-span-2 lg:col-span-1 sm:ml-2 md:ml-0 lg:ml-1"
						>
							<label class="label">Country</label>

							<input
								type="text"
								class="input input-bordered"
								name="country"
								value="Indonesia"
								required
							/>
						</div>
					</div>
				</section>

				<section class="credit-card">
					<h3>Payment Info</h3>

					<div class="credit-card__input">
						<div class="form-control sm:col-span-3 md:col-span-1 lg:col-span-3">
							<label class="label">Credit Card Number</label>

							<input
								type="text"
								class="input input-bordered"
								name="credit_card_number"
								value="5470929422658807"
								required
							/>
						</div>

						<div class="form-control sm:mr-2 md:mr-0 lg:mr-1">
							<label class="label">Month</label>

							<select
								class="select select-bordered"
								name="expiration_month"
								required
							>
								{#each months as month, index}
									<option value={index + 1}>{month}</option>
								{/each}
							</select>
						</div>

						<div
							class="form-control sm:ml-2 md:ml-0 lg:ml-1 sm:mr-2 md:mr-0 lg:mr-1"
						>
							<label class="label">Year</label>

							<select
								class="select select-bordered"
								name="expiration_year"
								required
							>
								{#each { length: 5 } as _, i}
									<option value={currentYear + i}>{currentYear + i}</option>
								{/each}
							</select>
						</div>

						<div class="form-control sm:ml-2 md:ml-0 lg:ml-1">
							<label class="label">CCV</label>

							<input
								type="password"
								class="input input-bordered"
								name="ccv"
								maxlength="3"
								value="123"
								required
							/>
						</div>
					</div>
				</section>

				<footer class="user-info__footer">
					<button class="btn btn-secondary">Place Order</button>
				</footer>
			</form>
		</div>
	{:else}
		<h1>Your shopping cart is empty!</h1>

		<a href="/product" class="btn btn-secondary">Continue Shopping</a>
	{/if}
</section>

<style lang="postcss">
	.cart-container {
		@apply flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14;

		&--empty {
			@apply gap-10 md:gap-12 lg:gap-14 xl:gap-16 items-center text-center;

			h1 {
				@apply font-bold text-3xl md:text-4xl lg:text-5xl xl:text-6xl;
			}

			.btn {
				@apply rounded-full normal-case;
			}
		}

		&__header {
			@apply flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4;
			@apply md:gap-5 lg:gap-6 xl:gap-7;
		}

		&__title {
			@apply font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl;
		}

		&__action {
			@apply flex flex-row flex-wrap gap-4 justify-between sm:justify-start;

			.btn {
				@apply normal-case rounded-full;
			}
		}
	}

	.cart-wrapper {
		@apply flex flex-col md:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-14;
		@apply xl:gap-16;
	}

	.cart {
		@apply md:w-3/5 lg:w-1/2 flex flex-col gap-5 md:gap-7 lg:gap-9 xl:gap-11;

		&:before,
		&:after {
			@apply self-stretch border-t border-gray-200;
			content: '';
		}

		&__shipping-price,
		&__total-price {
			@apply flex flex-row flex-wrap gap-4 justify-between md:text-lg;
			@apply lg:text-xl;
		}

		&__shipping-cost,
		&__total-cost {
			@apply font-bold;
		}

		&__total-price {
			@apply order-last text-lg md:text-xl lg:text-2xl;
		}
	}

	.product-list {
		@apply flex flex-col gap-4 md:gap-5 lg:gap-6 xl:gap-7 divide-y -order-1;
	}

	.product {
		@apply flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-5;
		@apply xl:gap-6 pt-4 md:pt-5 lg:pt-6 xl:pt-7;

		&:first-child {
			@apply pt-0;
		}

		&__photo {
			@apply sm:w-48 object-cover rounded-3xl;
			aspect-ratio: 3/4;
		}

		&__title {
			@apply font-bold;
		}

		&__detail {
			@apply sm:flex-1 flex flex-col sm:justify-between gap-2;
		}

		&__header {
			@apply text-base lg:text-lg;
		}

		&__footer {
			@apply flex flex-row flex-wrap justify-between text-sm lg:text-base;
		}

		&__price {
			@apply font-bold;
		}
	}

	.user-info {
		@apply md:flex-1 flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14;
		@apply xl:gap-16;

		&__footer {
			@apply flex flex-row md:justify-end;

			.btn {
				@apply rounded-full normal-case;
			}
		}
	}

	.address,
	.credit-card {
		@apply flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5;

		h3 {
			@apply font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl;
		}
	}

	.address {
		&__input {
			@apply grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 lg:gap-3;
		}
	}

	.credit-card {
		&__input {
			@apply grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3;
			@apply gap-1 md:gap-2 lg:gap-3;
		}
	}

	.form-control {
		.label {
			@apply px-0;
		}
	}
</style>
