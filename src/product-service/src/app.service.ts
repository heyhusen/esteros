import { S3 } from '@aws-sdk/client-s3';
import { RedisOmService } from '@bowbridge/nest-redis-om';
import type { Product as IProduct } from '@esteros/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectS3 } from 'nestjs-aws-s3';
import { Repository } from 'redis-om';
import type { Product } from './app.entity';
import { productSchema } from './app.schema';

@Injectable()
export class AppService implements OnModuleInit {
	private productRepository: Repository<Product> | undefined;

	constructor(
		private readonly redis: RedisOmService,
		@InjectS3() private readonly s3: S3,
	) {}

	async onModuleInit(): Promise<void> {
		this.productRepository = this.redis.client?.fetchRepository(productSchema);

		await this.productRepository?.createIndex();
	}

	/**
	 * Get all products
	 *
	 * @return {Promise} All products
	 */
	async findAll(): Promise<IProduct[] | null> {
		const productEntities = await this.productRepository?.search().return.all();

		if (!productEntities) {
			return null;
		}

		const products = await Promise.all(
			productEntities.map(async (item) => {
				const { entityId, created_at, updated_at, photo, ...data } =
					item.toJSON() as Product;

				return {
					id: entityId,
					created_at: created_at as string,
					updated_at: updated_at as string,
					photo: `http://localhost:9000/local/${photo}`,
					...data,
				};
			}),
		);

		return products;
	}

	/**
	 * Get a product
	 *
	 * @param  {string}  id id of related product
	 * @return {Promise}    A product for provided id
	 */
	async findOne(id: string): Promise<IProduct | null> {
		const productEntity = await this.productRepository?.fetch(id);

		if (!productEntity) {
			return null;
		}

		const { entityId, created_at, updated_at, photo, ...data } =
			productEntity.toJSON() as Product;

		return {
			id: entityId,
			created_at: created_at as string,
			updated_at: updated_at as string,
			photo: `http://localhost:9000/local/${photo}`,
			...data,
		};
	}
}
