import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'ORDER_SERVICE',
				transport: Transport.REDIS,
				options: {
					host: 'localhost',
					port: 6379,
				},
			},
		]),
	],
	controllers: [OrdersController],
})
export class OrdersModule {}
