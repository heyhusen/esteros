import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { Cart, AddCartItem } from '@esteros/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'getCart' })
	async getCurrentUserCart(@Payload() userId: string): Promise<Cart | null> {
		const cart = await this.appService.getCartByUserId(userId);

		return cart;
	}

	@MessagePattern({ cmd: 'addItemIntoCart' })
	async addItemIntoCart(@Payload() data: AddCartItem): Promise<Cart> {
		const cart = await this.appService.addItemIntoCart(data);

		return cart;
	}

	@MessagePattern({ cmd: 'emptyCart' })
	async emptyCart(@Payload() userId: string): Promise<boolean> {
		const isDeleted = await this.appService.emptyCart(userId);

		return isDeleted;
	}
}
