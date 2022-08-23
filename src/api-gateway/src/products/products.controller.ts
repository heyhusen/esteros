import type { Product, PubSubPattern } from '@esteros/types';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
	constructor(
		@Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
	) {}

	@Get()
	getAllProducts() {
		const pattern: PubSubPattern = { cmd: 'getProducts' };

		const data = this.client.send<Product[]>(pattern, {});

		return data;
	}

	@Get(':id')
	getOneProduct(@Param('id') id: string) {
		const pattern: PubSubPattern = { cmd: 'getProductById' };

		const data = this.client.send<Product, string>(pattern, id);

		return data;
	}
}
