import { RedisOmService } from '@bowbridge/nest-redis-om';
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Product } from '@esteros/types';
import { productSchema } from './app.schema';

@Injectable()
export class AppService implements OnModuleInit {
	constructor(private readonly redis: RedisOmService) {}

	private readonly productRepository =
		this.redis.client?.fetchRepository(productSchema);

	async onModuleInit(): Promise<void> {
		await this.productRepository?.createIndex();
	}

	/**
	 * Get all products
	 *
	 * @return {Promise} All products
	 */
	async findAll(): Promise<Product[] | null> {
		const productEntities = await this.productRepository?.search().return.all();

		if (!productEntities) {
			return null;
		}

		return productEntities.map(
			({ entityId, created_at, updated_at, ...data }) => ({
				id: entityId,
				created_at: created_at as string,
				updated_at: updated_at as string,
				...data,
			}),
		);
	}

	/**
	 * Get a product
	 *
	 * @param  {string}  id id of related product
	 * @return {Promise}    A product for provided id
	 */
	async findOne(id: string): Promise<Product | null> {
		const productEntity = await this.productRepository?.fetch(id);

		if (!productEntity) {
			return null;
		}

		const { entityId, created_at, updated_at, ...data } = productEntity;

		return {
			id: entityId,
			created_at: created_at as string,
			updated_at: updated_at as string,
			...data,
		};
	}
}
