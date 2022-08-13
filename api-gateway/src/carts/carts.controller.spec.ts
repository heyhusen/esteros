import { ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';

describe('CartsController', () => {
	let controller: CartsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CartsController],
			imports: [
				ClientsModule.register([
					{
						name: 'CART_SERVICE',
					},
				]),
			],
		}).compile();

		controller = module.get<CartsController>(CartsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
