import { RedisOmService } from '@bowbridge/nest-redis-om';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { Product } from '@esteros/types';
import { CartEntity } from './app.entity';
import type { AddCartItem, Cart, CartItem } from '@esteros/types';
import { cartSchema } from './app.schema';

@Injectable()
export class AppService implements OnModuleInit {
	constructor(
		private readonly redis: RedisOmService,
		@Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
	) {}

	private readonly cartRepository =
		this.redis.client?.fetchRepository(cartSchema);

	async onModuleInit(): Promise<void> {
		await this.cartRepository?.createIndex();
	}

	/**
	 * Serialize cart
	 *
	 * @param  {CartEntity}    entity Cart entity from Redis OM
	 * @return {Promise<Cart>}        A cart
	 */
	async serializeCart(entity: CartEntity): Promise<Cart> {
		const { entityId, created_at, updated_at, products, ...data } = entity;

		return {
			id: entityId,
			created_at: created_at as string,
			updated_at: updated_at as string,
			products: await Promise.all(
				products.map(async ({ id, ...data }) => {
					const product = await firstValueFrom(
						this.productService.send<Product, string>(
							{
								cmd: 'getProductById',
							},
							id,
						),
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
	async getCartByUserId(id: string): Promise<Cart | null> {
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
		const cost = await Promise.all(
			items.map(async ({ id, quantity }) => {
				const product = await firstValueFrom(
					this.productService.send<Product, string>(
						{
							cmd: 'getProductById',
						},
						id,
					),
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

		const cost = await Promise.all(
			items.map(async ({ id, quantity }) => {
				const product = await firstValueFrom(
					this.productService.send<Product, string>(
						{
							cmd: 'getProductById',
						},
						id,
					),
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
	 * @return {Promise<Cart>}      An updated cart
	 */
	async addItemIntoCart(data: AddCartItem): Promise<Cart> {
		const { user_id: userId, product_id: productId, quantity } = data;

		const products: CartItem[] = [
			{
				id: productId,
				quantity,
			},
		];

		let cartEntity = await this.cartRepository
			?.search()
			.where('user_id')
			.equals(userId)
			.return.first();

		let isNewCartEntity = false;

		if (!cartEntity) {
			const today = new Date();

			cartEntity = await this.cartRepository?.createAndSave({
				userId,
				products,
				shipping_cost: await this.calculateShippingCost(products),
				total_price: await this.calculateTotalPrice(products),
				created_at: today.toISOString(),
				updated_at: today.toISOString(),
			});

			isNewCartEntity = true;
		}

		const updateCartEntity = cartEntity as CartEntity;

		if (!isNewCartEntity) {
			const today = new Date();
			const updatedShippingCost = await this.calculateShippingCost(products);
			const updatedTotalPrice = await this.calculateTotalPrice(products);

			updateCartEntity.products = updateCartEntity.products.map(
				({ id, quantity: oldQuantity }) => {
					let newQuantity = oldQuantity;

					if (id === productId) {
						newQuantity = newQuantity + quantity;
					}

					return {
						id,
						quantity: newQuantity,
					};
				},
			);
			updateCartEntity.shipping_cost =
				updateCartEntity.shipping_cost + updatedShippingCost;
			updateCartEntity.total_price =
				updateCartEntity.total_price + updatedTotalPrice;
			updateCartEntity.updated_at = today.toISOString();

			await this.cartRepository?.save(updateCartEntity);
		}

		const cart = await this.serializeCart(updateCartEntity);

		return cart;
	}

	/**
	 * Empty cart
	 *
	 * @param  {string}        userId An user id of cart
	 */
	async emptyCart(userId: string): Promise<void> {
		const cartEntity = await this.cartRepository
			?.search()
			.where('user_id')
			.equals(userId)
			.return.first();

		if (cartEntity) {
			await this.cartRepository?.remove(cartEntity.entityId);
		}
	}
}
