<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let { order } = data;
</script>

<section class="order">
	<header class="order__header">
		<h1 class="order__title">Your order is complete!</h1>
	</header>

	<div class="overflow-x-auto">
		<table class="table order-table">
			<tbody>
				<tr>
					<td>Confirmation</td>
					<td>{order.confirmation_number}</td>
				</tr>
				<tr>
					<td>Tracking</td>
					<td>{order.tracking_number}</td>
				</tr>
				<tr>
					<td>Total Paid</td>
					<td>${order.price}</td>
				</tr>
			</tbody>
		</table>
	</div>
</section>

<style lang="postcss">
	.order {
		@apply flex flex-col gap-8 md:gap-12 lg:gap-16 xl:gap-20;

		&__header {
			@apply flex flex-col items-center text-center;
		}

		&__title {
			@apply font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl;
		}
	}

	.order-table {
		@apply w-full;

		tr {
			td {
				&:last-child {
					@apply text-right;
				}
			}
		}
	}
</style>
