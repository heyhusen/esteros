import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cookies } from '../app.decorator';
import { CreateOrderDto } from './orders.dto';
import type { CreateOrder, Order, PubSubPattern } from '@esteros/types';

@Controller('orders')
export class OrdersController {
	constructor(@Inject('ORDER_SERVICE') private readonly client: ClientProxy) {}

	@Post()
	create(@Body() dto: CreateOrderDto, @Cookies('user_id') userId: string) {
		const pattern: PubSubPattern = { cmd: 'createOrder' };

		const order = this.client.send<Order, CreateOrder>(pattern, {
			user_id: userId,
			...dto,
		});

		return order;
	}
}
