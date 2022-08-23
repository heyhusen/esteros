import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
	let controller: ProductsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			imports: [
				ClientsModule.register([
					{
						name: 'PRODUCT_SERVICE',
					},
				]),
			],
		}).compile();

		controller = module.get<ProductsController>(ProductsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
