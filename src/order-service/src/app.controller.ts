import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrder, Order } from '@esteros/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'createOrder' })
	async createOrder(@Payload() dto: CreateOrder): Promise<Order> {
		const order = await this.appService.createOrder(dto);

		return order;
	}
}
