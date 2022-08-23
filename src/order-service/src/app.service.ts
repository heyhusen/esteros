import type { Cart, CreateOrder, Order, PubSubPattern } from '@esteros/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomInt } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
	constructor(
		@Inject('CART_SERVICE') private readonly cartService: ClientProxy,
	) {}

	async createOrder(dto: CreateOrder): Promise<Order> {
		const { user_id: userId } = dto;

		const getCartPattern: PubSubPattern = { cmd: 'getCart' };

		const cart = await firstValueFrom(
			this.cartService.send<Cart, string>(getCartPattern, userId),
		);

		const emptyCartPattern: PubSubPattern = { cmd: 'emptyCart' };

		await firstValueFrom(
			this.cartService.send<void, string>(emptyCartPattern, userId),
		);

		const today = new Date();

		return {
			confirmation_number: `#CN${today.getTime()}${randomInt(100)}`,
			tracking_number: `#TN${today.getTime()}${randomInt(100)}`,
			price: cart.total_price,
		};
	}
}
