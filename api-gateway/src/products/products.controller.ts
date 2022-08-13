import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import type { Observable } from 'rxjs';
import type { Product } from '@esteros/types';

@Controller('products')
export class ProductsController {
	constructor(
		@Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
	) {}

	@Get()
	getAllProducts(): Observable<Product[]> {
		const data = this.client.send<Product[]>({ cmd: 'getProducts' }, {});

		return data;
	}

	@Get(':id')
	getOneProduct(@Param('id') id: string): Observable<Product> {
		const data = this.client.send<Product, string>(
			{ cmd: 'getProductById' },
			id,
		);

		return data;
	}
}
