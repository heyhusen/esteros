import { RedisOmService } from '@bowbridge/nest-redis-om';
import type {
	AddCartItem,
	Cart as ICart,
	CartItem,
	Product,
	PubSubPattern,
} from '@esteros/types';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'redis-om';
import { firstValueFrom } from 'rxjs';
import { Cart } from './app.entity';
import { cartSchema } from './app.schema';

@Injectable()
export class AppService implements OnModuleInit {
	private cartRepository: Repository<Cart> | undefined;

	constructor(
		private readonly redis: RedisOmService,
		@Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
	) {}

	async onModuleInit(): Promise<void> {
		this.cartRepository = this.redis.client?.fetchRepository(cartSchema);

		await this.cartRepository?.createIndex();
	}

	/**
	 * Serialize cart
	 *
	 * @param  {Cart}    entity Cart entity from Redis OM
	 * @return {Promise<ICart>}        A cart
	 */
	async serializeCart(entity: Cart): Promise<ICart> {
		const { entityId, created_at, updated_at, products, ...data } =
			entity.toJSON() as Cart;

		const pattern: PubSubPattern = { cmd: 'getProductById' };

		return {
			id: entityId,
			created_at: created_at as string,
			updated_at: updated_at as string,
			products: await Promise.all(
				products.map(async (item) => {
					const { id, ...data } = JSON.parse(item) as CartItem;

					const product = await firstValueFrom(
						this.productService.send<Product, string>(pattern, id),
					);

					return {
						...product,
						...data,
					};
				}),
			),
			...data,
		};
	}

	/**
	 * Get a cart by user id
	 *
	 * @param  {string}  id user id of expected cart
	 * @return {Promise}    A cart for given user id
	 */
	async getCartByUserId(id: string): Promise<ICart | null> {
		const cartEntity = await this.cartRepository
			?.search()
			.where('user_id')
			.equals(id)
			.return.first();

		if (!cartEntity) {
			return null;
		}

		const cart = await this.serializeCart(cartEntity);

		return cart;
	}

	/**
	 * Calculate shipping cost (mock)
	 *
	 * @param  {CartItem[]}      items Array of cart item
	 * @return {Promise<number>}       A mocked cost
	 */
	async calculateShippingCost(items: CartItem[]): Promise<number> {
		const pattern: PubSubPattern = { cmd: 'getProductById' };

		const cost = await Promise.all(
			items.map(async ({ id, quantity }) => {
				const product = await firstValueFrom(
					this.productService.send<Product, string>(pattern, id),
				);

				const cost = (product.price * quantity * 10) / 100;

				return cost;
			}),
		);

		return cost.reduce(
			(previousValue, currentvalue) => previousValue + currentvalue,
		);
	}

	/**
	 * Calculate total price (mock)
	 *
	 * @param  {CartItem[]}      items Array of cart item
	 * @return {Promise<number>}       A mocked price
	 */
	async calculateTotalPrice(items: CartItem[]): Promise<number> {
		const shippingCost = await this.calculateShippingCost(items);

		const pattern: PubSubPattern = { cmd: 'getProductById' };

		const cost = await Promise.all(
			items.map(async ({ id, quantity }) => {
				const product = await firstValueFrom(
					this.productService.send<Product, string>(pattern, id),
				);

				const cost = product.price * quantity;

				return cost;
			}),
		);

		const totalPrice =
			shippingCost +
			cost.reduce(
				(previousValue, currentvalue) => previousValue + currentvalue,
			);

		return totalPrice;
	}

	/**
	 * Add item into cart
	 *
	 * @param  {AddCartItem}   data A cart item dto
	 * @return {Promise<ICart>}      An updated cart
	 */
	async addItemIntoCart(data: AddCartItem): Promise<ICart> {
		const { user_id: userId, product_id: productId, quantity } = data;
		const newItem: CartItem = {
			id: productId,
			quantity,
		};
		const today = new Date();

		let cartEntity = await this.cartRepository
			?.search()
			.where('user_id')
			.equals(userId)
			.return.first();

		let isNewCartEntity = false;

		// If the cart not exists
		if (!cartEntity) {
			cartEntity = await this.cartRepository?.createAndSave({
				user_id: userId,
				products: [newItem].map((item) => JSON.stringify(item)),
				shipping_cost: await this.calculateShippingCost([newItem]),
				total_price: await this.calculateTotalPrice([newItem]),
				created_at: today.toISOString(),
				updated_at: today.toISOString(),
			});

			const { entityId: id } = cartEntity as Cart;

			await this.cartRepository?.expire(id, 259200); // 3 days

			isNewCartEntity = true;
		}

		cartEntity = cartEntity as Cart;

		if (!isNewCartEntity) {
			const cartItemIndex = cartEntity.products.findIndex((item) => {
				const { id } = JSON.parse(item) as CartItem;

				return id === productId;
			});

			// If item already in the cart
			if (cartItemIndex >= 0) {
				const { quantity: oldQuantity, ...data } = JSON.parse(
					cartEntity.products[cartItemIndex],
				) as CartItem;

				cartEntity.products[cartItemIndex] = JSON.stringify({
					quantity: oldQuantity + quantity,
					...data,
				});
			} else {
				cartEntity.products.push(JSON.stringify(newItem));
			}

			cartEntity.shipping_cost += await this.calculateShippingCost([newItem]);
			cartEntity.total_price += await this.calculateTotalPrice([newItem]);

			await this.cartRepository?.save(cartEntity);
		}

		const cart = await this.serializeCart(cartEntity);

		return cart;
	}

	/**
	 * Empty cart
	 *
	 * @param  {string}        userId An user id of cart
	 */
	async emptyCart(userId: string): Promise<boolean> {
		const cartEntity = await this.cartRepository
			?.search()
			.where('user_id')
			.equals(userId)
			.return.first();

		if (!cartEntity) {
			return false;
		}

		await this.cartRepository?.remove(cartEntity.entityId);

		return true;
	}
}
