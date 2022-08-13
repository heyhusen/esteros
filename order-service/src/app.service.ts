import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { CreateOrder, Order } from '@esteros/types';
import { firstValueFrom } from 'rxjs';
import type { Cart } from '@esteros/types';

@Injectable()
export class AppService {
	constructor(
		@Inject('CART_SERVICE') private readonly cartService: ClientProxy,
	) {}

	async createOrder(dto: CreateOrder): Promise<Order> {
		const { user_id: userId } = dto;

		const cart = await firstValueFrom(
			this.cartService.send<Cart, string>({ cmd: 'getCart' }, userId),
		);

		await firstValueFrom(
			this.cartService.send<void, string>({ cmd: 'emptyCart' }, userId),
		);

		return {
			confirmation_number: '',
			tracking_number: '',
			price: cart.total_price,
		};
	}
}
