<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ShoppingCart } from '@steeze-ui/heroicons';

	export let count: number;
	export let total: number;
</script>

<div class="cart">
	<label tabindex="0" class="cart__icon">
		<div>
			<Icon src={ShoppingCart} theme="outline" class="h-5 w-5" />

			<span class="indicator-item">{count}</span>
		</div>
	</label>

	<div tabindex="0" class="cart__content dropdown-content">
		<div class="card-body">
			<span>{count}</span>
			<span>Subtotal: ${total}</span>

			<div>
				<a class="btn btn-secondary btn-block" href="/cart">View Cart</a>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.cart {
		@apply dropdown dropdown-end;

		&__icon {
			@apply btn btn-ghost btn-circle;

			div {
				@apply indicator;

				span {
					@apply badge badge-sm;
				}
			}
		}

		&__content {
			@apply mt-3 card card-compact w-52 bg-base-100 shadow;

			& > div {
				span:first-child {
					@apply font-bold text-lg;
				}

				div {
					@apply card-actions;
				}
			}
		}
	}
</style>
