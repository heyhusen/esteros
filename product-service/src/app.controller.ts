import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { Product } from '@esteros/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * Get all products
	 */
	@MessagePattern({ cmd: 'getProducts' })
	async getAllProducts(): Promise<Product[] | null> {
		const products = await this.appService.findAll();

		return products;
	}

	/**
	 * Get a product
	 */
	@MessagePattern({ cmd: 'getProductById' })
	async getOneProduct(id: string): Promise<Product | null> {
		const product = await this.appService.findOne(id);

		return product;
	}
}
