import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartsController } from './carts.controller';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'CART_SERVICE',
				transport: Transport.REDIS,
				options: {
					host: 'localhost',
					port: 6379,
				},
			},
		]),
	],
	controllers: [CartsController],
})
export class CartsModule {}
