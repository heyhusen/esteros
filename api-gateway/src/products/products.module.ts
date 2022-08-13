import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'PRODUCT_SERVICE',
				transport: Transport.REDIS,
				options: {
					host: 'localhost',
					port: 6379,
				},
			},
		]),
	],
	controllers: [ProductsController],
})
export class ProductsModule {}
